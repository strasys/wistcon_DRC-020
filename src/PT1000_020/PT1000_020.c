/*
 * PT1000_020.c
 *
 *  Created on: 11.07.2016
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <math.h>
#include "ADS1015.h"

//calculation of temperature based on hardware design
void calctemp_Celsius(int channel, double *t_celsius){
	double A, B;
	int AINval;
	//get AINval from ADC
	AINval = getADCPT1000singleval(channel);
//Hardware PT1000 Funktion EL-100-020-020
	A = pow(10, -6);
	B = AINval * AINval;
	//printf("AINval = %i\n", AINval);
	//Hardware related function.
	//Derived from hardware design simulation.
	//Trend function generated with spread sheet trend line
	t_celsius[0] = -2.201 * A * B + 0.081*AINval-41.291;
}

void calctemp_Kelvin(int channel, double *t_kelvin){
	double t_celsius, A, B;
	int AINval;
	//get AINval from ADC
	AINval = getADCPT1000singleval(channel);
	//Hardware PT1000 Funktion
	A = pow(10, -6);
	B = AINval * AINval;
	//Hardware related function.
	//Derived from hardware design simulation.
	//Trend function generated with spread sheet trend line
	t_celsius = -2.201 * A * B + 0.081*AINval-41.291;
	t_kelvin[0] = t_celsius + 273.15;
}

void round05(double *valtoberound, double *roundresult){
	double valfraction, valfractionround, valint;
	int signflag;
	valfraction = modf(valtoberound[0], &valint);

	//check sign
	if (valfraction < 0 ) signflag = -1;
	if (valfraction > 0) signflag = 1;

	if (fabs(valfraction) < 0.3)
	{
		valfractionround = 0.0;
	}
	else if ((fabs(valfraction) <= 0.7) && (fabs(valfraction) >= 0.3))
	{
		valfractionround = 0.5;
	}
	else if (fabs(valfraction) > 0.7)
	{
		valfractionround = 1.0;
	}
	if (signflag == -1) roundresult[0] = valint - valfractionround;
	if (signflag == 1) roundresult[0] = valint + valfractionround;
}

int main(int argc, char *argv[], char *env[]){

char input[3];
double t_celsius[1], t_kelvin[1], t_celsiusround[1], averagetemp, temp;
int i, channel, x;

//read in arguments
for (i=1;i<argc;i++){
	sscanf(argv[i],"%c",&input[i]);
}
initADS1015();

switch (input[1]){
case 'h':
	printf("Description of function PT1000 handler:\n"
			"PT1000handler [g] [Channel Number (0 = PT1000 channel 1, 1 = 2, etc.]\n"
			"	g => get\n"
			"	h => help\n"
			"	Channel => integer Number from 0 ... 3\n");
	break;
case 'g':
	if (argc != 3) {
		fprintf(stderr, "PT1000handler: missing argument! => %s\n", strerror(errno));
	} else {
		channel = atoi(argv[2]);

		calctemp_Kelvin(channel, t_kelvin);

		for (x=0;x<20;x++){
			calctemp_Celsius(channel, t_celsius);
			temp = temp + t_celsius[0];
			usleep(1000);
		}
		averagetemp = temp/20;

	//	round05(&t_celsius[0], t_celsiusround);
	//	round05(&averagetemp, t_celsiusround);
	//  printf("%.01f\n", t_celsiusround[0]);
		printf("%.0f\n", averagetemp);

	}
	break;
default:
	printf("Wrong arguments!\n"
			"Try PT1000handler h\n");
	break;
}

	return 0;
}

