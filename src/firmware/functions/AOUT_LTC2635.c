/*
 * AOUT_LTC2635.c
 *
 *  Created on: 01.11.2014
 *      Author: Johannes Strasser
 *
 *
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include "I2C-handler.h"
#include "AOUT_LTC2635.h"
#include "accessorg.h"



int dacOUT1addr = 0b00000000;	//The last 4 bits describe the address codes
int dacOUT2addr = 0b00000001;
int dacALLaddr = 0b00001111;

int dacOUT1 = 1;
int dacOUT2 = 2;

void init_AOUT(unsigned int addr_AOUT) {
	char fopenModus[2] = {};
	FILE *f = NULL;
	char username[255];
	long int uidresult[] = {0};
	long int gidresult[] = {0};
	long int uidowner[] = {0};
	long int gidowner[] = {0};
	long int fileprotection[] = {0};
	int filedesc;

	AOUT_set_internal_reference(addr_AOUT);
	//For the first call the txt file will be generated with val = 0
	if (access(AOUT_DIR, (R_OK | W_OK)) != -1) {
				sprintf(fopenModus, "r+");
			} else {
				sprintf(fopenModus, "w");
			}

		f = fopen(AOUT_DIR, fopenModus);
		fprintf(f,
				"AOUT1=%4i:AOUT2=%4i",
				0, 0);
		fclose(f);

	// Check if file has the defined uid (user ID) and gid (group ID)!
			filedesc = open(AOUT_DIR, O_RDWR);

			getinfofile(&filedesc, uidowner, gidowner, fileprotection);

		//	printf("getinfofile call: \n uidowner : %li\n gidowner : %li\n fileprotection : %lo\n", uidowner[0], gidowner[0], fileprotection[0]);
			strcpy(username, uid_Name);
			getuidbyname(username, uidresult, gidresult);

		//	printf("Result of function call:\n uid : %li\n gid : %li\n", uidresult[0], gidresult[0]);

			if ((uidowner[0] != uidresult[0]) || (gidowner[0] != gidresult[0])){
				if ((fchown(filedesc, uidresult[0], gidresult[0])) != 0){
					fprintf(stderr, "%s\n", strerror(errno));
				}
			}

			close(filedesc);

	AOUT_set_value_DACn(dacOUT1, 0, addr_AOUT);
	AOUT_set_value_DACn(dacOUT2, 0, addr_AOUT);
}
//This set's the internal reference of the Digital
//to Analog converter.
//For that chip the internal ref. is 2,5 V

void AOUT_set_internal_reference(unsigned int addr_AOUT) {
	int file;
	unsigned char buf[3];
	buf[0] = 0b01101111; //The first 4 bit in byte 1 are relevant to set to internal reference.
	buf[1] = 0;
	buf[2] = 0;
	file = i2c_open(I2C1_path, addr_AOUT);
	i2c_write(file, buf, 3);
	//printf("AOUT Number of bytes written: %d\n", numByte);
	i2c_close(file);
}

// DACchannel is DAC_A or DAC_B

void AOUT_set_value_DACn(int DACchl, int value, unsigned int addr_AOUT) {
	int file;
	unsigned char buf[3];
	buf[0] = 0b00110000; //The first 4 bits COMMAND = Write to and Update (Power Up) DAC Register n.
	buf[1] = 0;
	buf[2] = 0;

	if (DACchl == 1) {
		buf[0] = buf[0] | dacOUT1addr;
		AOUT_write_value_DACn(DACchl,value);
	}
	if (DACchl == 2) {
		buf[0] = buf[0] | dacOUT2addr;
		AOUT_write_value_DACn(DACchl,value);
	}

	if ((value < 0) | (value > 1024)) {
		printf("Error: DAC value < 0 or > 1023\n");
	} else {
		buf[1] = (value >> 2) & 0xFF;
		//printf("buf 1 %x\n",buf[1]);
		buf[2] = (value << 6) & 0xFF;
		//printf("buf 2 %x\n",buf[2]);
	}

	file = i2c_open(I2C1_path, addr_AOUT);
	i2c_write(file, buf, 3);
	//printf("AOUT Number of bytes written: %d\n", numByte);
	i2c_close(file);
}

int AOUT_get_value_DACn(unsigned int channel) {
	int AOUTn, AOUTval1, AOUTval2;
	char DIR_AOUTvalue[255] = {};
	FILE *f = NULL;

		sprintf(DIR_AOUTvalue, AOUT_DIR);

		if (access(DIR_AOUTvalue, (R_OK | W_OK)) != -1) {
					f = fopen(DIR_AOUTvalue, "r");
					fscanf(f,
							"AOUT1=%i:AOUT2=%i",
							&AOUTval1, &AOUTval2);
					fclose(f);

					if ((channel == 1) | (channel == 2)) {
						if (channel == 1) {
							AOUTn = AOUTval1;
						}
						else if (channel == 2) {
							AOUTn = AOUTval2;
						}
					} else {
						fprintf(stderr, "AOUT_get_value_DACn (LTC2635): Channel %i does not exist!\n",channel);
						return -1;
					}


				} else {
					fprintf(stderr, "AOUT_get_value_DACn (LTC2635): File %s does not exist!\n",DIR_AOUTvalue);
					return -1;
				}

	return (AOUTn);
}

//Since there is no possibility to read the actual set value
//from the LTC2635 it is necessary to store the last set value.
void AOUT_write_value_DACn(int channel, int value) {
	FILE *f = NULL;
	int AOUTval1, AOUTval2;
	char DIR_AOUTvalue[255] = {};
	char fopenModus[2] = {};

	sprintf(DIR_AOUTvalue, AOUT_DIR);

	if ((channel == 1) || (channel == 2)){
		if (channel == 1) {
			AOUTval1 = value;
			AOUTval2 = AOUT_get_value_DACn(2);
		}
		else if (channel == 2) {
			AOUTval1 = AOUT_get_value_DACn(1);
			AOUTval2 = value;
		}
	}
	else
	{
		fprintf(stderr, "AOUT_write_value_DACn (LTC2635): wrong channel number %i\n", channel);
	}

	//Check if the file exists already.
	if (access(DIR_AOUTvalue, (R_OK | W_OK)) != -1) {
			sprintf(fopenModus, "r+");
		} else {
			sprintf(fopenModus, "w");
		}

	f = fopen(DIR_AOUTvalue, fopenModus);
	fprintf(f,
			"AOUT1=%4i:AOUT2=%4i",
			AOUTval1, AOUTval2);
	fclose(f);

}

