/*
 * 24AA256-EEPROM.c
 *
 *  Created on: 03.01.2015
 *      Author: Johannes Strasser
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include "I2C-handler.h"
#include "24AA256-EEPROM.h"

void EEPROMinit(int I2Cchannel, int address) {
	char I2CBusDir[255] = { };
	FILE *f;
	sprintf(I2CBusDir,
			"/sys/devices/ocp.3/4819c000.i2c/i2c-%i/%i-00%i/driver/unbind",
			I2Cchannel, I2Cchannel, address);
	f = fopen(I2CBusDir, "w");
	if (f != 0) {
		fprintf(f, "%i-00%i", I2Cchannel, address);
		fclose(f);
	} else {
		fprintf(stderr, "EEPROMinit: %s\n", strerror(errno));
	}

}

int EEPROMwriteblock64(unsigned int EEPROMregister, char *EEPROMdata) {
	int f, i;
	unsigned int length;
	unsigned char buf[255] = { };
	char bufdata[255] = { };

	length = strlen(EEPROMdata);
	printf("length EEPROMdata = %i\n", length);
	if (length <= 64) {

		//split EEPROMregister address in two bytes
		//low byte 8 bit high byte 7 bit
		buf[0] = (EEPROMregister >> 8) & 0xFF;
		buf[1] = EEPROMregister & 0xFF;

		sprintf(bufdata, "%c%c%s", buf[0], buf[1], EEPROMdata);

		for (i = 2; i <= (length + 2); i++) {
			buf[i] = bufdata[i];
		}

		f = i2c_open(I2C2_path, addr_EEPROM);
		i2c_write(f, buf, (length + 2));
		i2c_close(f);
	} else {
		fprintf(stderr,
				"EEPROMwriteblock64; Number of byte bigger than 64! : %s\n",
				strerror(errno));
		return (-1);
	}
	return 0;
}

int EEPROMwritebyte(unsigned int EEPROMregister, char EEPROMdata) {
	int f, length, writenumberbyte;
	unsigned char buf[255] = { };
//	char bufdata[255] = { };
	length = sizeof(EEPROMdata);

	if (length == 1) {
		//split EEPROMregister address in two bytes
		//low byte 8 bit high byte 7 bit
		buf[0] = (EEPROMregister >> 8) & 0xFF;
		buf[1] = EEPROMregister & 0xFF;
		//for (i = 2; i <= sizeof(bufdata); i++) {
			buf[2] = EEPROMdata;
	//	}
		f = i2c_open(I2C2_path, addr_EEPROM);
		writenumberbyte = i2c_write(f, buf, length + 2);
		if (writenumberbyte == 3){
			i2c_close(f);
		}
		else {
			fprintf(stderr, "Data not fully transfered: %s\n",strerror(errno));
		}
	} else {
		fprintf(stderr, "EEPROMwritebyte; Number of byte > or < than 1 : %s\n",
				strerror(errno));
		return (-1);
	}

	return 0;
}
void EEPROMreadbytes(unsigned int EEPROMregister, char *EEPROMdata,
		unsigned int length) {
	int f, i;
	unsigned char buf[255] = { };
	char bufdata[255] = { };
	//split EEPROMregister address in two bytes
	//low byte 8 bit high byte 7 bit

	buf[0] = (EEPROMregister >> 8) & 0xFF;
	buf[1] = EEPROMregister & 0xFF;
	sprintf(bufdata, "%c%c", buf[0], buf[1]);

	for (i = 0; i <= sizeof(bufdata); i++) {
		buf[i] = bufdata[i];
	}

	f = i2c_open(I2C2_path, addr_EEPROM);
	i2c_write(f, buf, 2);
	i2c_read(f, buf, length);
	i2c_close(f);

	for (i = 0; i <= (sizeof(buf)); i++) {
		EEPROMdata[i] = buf[i];
	}
}

