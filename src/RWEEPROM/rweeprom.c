/*
 * rweeprom.c
 *
 *  Created on: 13.02.2016
 *  Author: Johannes Strasser
 *  Handler to read and write EEPROM
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include "24AA256-EEPROM.h"


int main(int argc, char *argv[], char *env[]){


	char input[1];
	char startregchar[6];
	char numberbytes[3];
	char eepromdata[255] = {0};
	char datatoeeprom[65] = {0};
	unsigned int startregint, numbytes;


	//read in argument
		sscanf(argv[1],"%c",&input[0]);

	switch (input[0]){
	case 'h':
		printf("Description of function rweeprom:\n"
				"rweeprom [i,r,w] [char \"string which shall be written\"]\n"
				"  max length of chars = 255"
				"	i => init, int I2C-channel (0,1,2), device address as hex \n"
				"	r => read, int start reg. no., int number of bytes max. 255\n"
				"	w => write, int start reg. no., string content max. length 64\n");
		break;
	case 'i':
		if (argc != 4) {
			fprintf(stderr, "PT1000handler: missing argument! => %s\n", strerror(errno));
		} else {


		}
		break;
	case 'r':
		if (argc !=4) {
			fprintf(stderr, "rweeprom: missing argument! => %s\n", strerror(errno));
		} else {
			if (strlen(argv[2]) > 6){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(startregchar, argv[2]);
				startregint = atoi(startregchar);
			}
			if (strlen(argv[3]) > 3){
				fprintf(stderr, "%s is too long!", strerror(errno));
			}
			else
			{
				strcpy(numberbytes, argv[3]);
				numbytes = atoi(numberbytes);
				if (numbytes > 255){
					fprintf(stderr, "%s is to larg (max 255)!", strerror(errno));
				}
			}
			//EEPROMreadbytes(unsigned int EEPROMregister, char *EEPROMdata, unsigned int length)
			EEPROMreadbytes(startregint, eepromdata, numbytes);
			printf("%s\n",eepromdata);
		}
		break;
	case 'w':
		if (argc !=4) {
			fprintf(stderr, "rweeprom: missing argument! => %s\n", strerror(errno));
		} else {
			if (strlen(argv[2]) > 6){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(startregchar, argv[2]);
				startregint = atoi(startregchar);
			}
			if (strlen(argv[3]) > 64){
				fprintf(stderr, "%s is too long!", strerror(errno));
			}
			else
			{
				strcpy(datatoeeprom,argv[3]);
			}
			//EEPROMwriteblock64(unsigned int EEPROMregister, char *EEPROMdata)
			EEPROMwriteblock64(startregint, datatoeeprom);
		}
		break;
	default:
		printf("Wrong arguments!\n"
				"try rweeprom h\n");
		break;
	}

		return 0;

}
