/*
 * main.c
 *
 *  Created on: 27.09.2014
 *  update EL-100-020-001: 11.07.2016
 *      Author: Johannes Strasser
 */


#include <errno.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <termios.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <fcntl.h>
#include "I2C-handler.h"
#include "RTC_MCP7940N.h"
#include "GPIO.h"
#include "AOUT_LTC2635.h"
#include "24AA256-EEPROM.h"



void init(void){
	//char command[255];
	init_RTC(I2C1_path);
	init_GPIO(2);
	//init_AOUT();
	//EEPROMinit(1, 54);
	//unbind EEPROM from
	//sprintf(command, "/usr/lib/cgi-bin/PT100handler i");
	//system(command);
}

void getFormatForDate(char * pDateTime) {
	// formats for date -u
	// date --universal $(/www/pages/cgi-bin/RTChandler g f)
	sprintf(pDateTime, "%2.2d%2.2d%2.2d%2.2d%4.4d", RTC_get_month(I2C1_path),
			RTC_get_day(I2C1_path), RTC_get_hours(I2C1_path), RTC_get_minutes(I2C1_path), RTC_get_year(I2C1_path));
}


int main(int argc, char *argv[], char *env[])
{

		init();

		//set time on beaglebone according to RTC time
		// at start up.
			char command[128];
			char dateTime[13];
			getFormatForDate(dateTime);
					sprintf(command,"date -u %s",dateTime);
					system(command);

	return (0);
}

