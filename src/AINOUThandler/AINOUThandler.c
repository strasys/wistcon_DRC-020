/*
0 * AINOUThandler.c
 *
 *  Created on: 01.04.2015
 *      Author: Johannes Strasser
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <AOUT_LTC2635.h>
#include <AIN-handler.h>

/*
 * Function documentation:
 * get Analog IN value: AINOUThandler g (=get) I (=Input) 1 (=Channel number)
 * set Analog OUT value: AINOUThandler s (=set) O (=Output) 1 (=Channel number) 0:1023 (= Output value)
 */


int main(int argc, char *argv[], char *env[]){
	int channel, AINvalue, AOUTvalue;
	char setget;
	char InOut;

	if (argv[1] != 0){
	sscanf(argv[1], "%c", &setget);
	}

	if (setget == 'g'){
		sscanf(argv[2], "%c", &InOut);
		channel = atoi(argv[3]);
		if (InOut == 'I'){
			AINvalue = get_iio_value_n(channel);
			printf("%i\n", AINvalue);
		}
		else if (InOut == 'O'){
			AOUTvalue = AOUT_get_value_DACn(channel);
			printf("%i\n", AOUTvalue);
		}
	}

	else if (setget == 's'){
		sscanf(argv[2], "%c", &InOut);
		channel = atoi(argv[3]);
		AOUTvalue = atoi(argv[4]);
		if (InOut == 'O'){
			AOUT_set_value_DACn(channel, AOUTvalue);
		}

	}

return 0;

}
