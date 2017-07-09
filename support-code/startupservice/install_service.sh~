#!/bin/sh
# Installation of *.services
# Installation of device tree *.dtbo 
# Johannes Strasser
# 18.07.2016
# www.strasys.at
#
#
# copy and enabeling of system related components
#
cd /tmp/wistcon-020/extract/vers1_0/startupservice/
echo "copy: init_wistcon-020.service to /lib/systemd/system/"
cp init_wistcon-020.service /lib/systemd/system/
echo "copy: strasys-wistcon-020-00A0.dtbo to /lib/firmware/"
cp strasys-wistcon-00A0.dtbo /lib/firmware/

cd /lib/systemd/system/
echo "enable init_wistcon-020.service"
systemctl enable init_wistcon-020.service
echo "start init_wistcon-020.service"
systemctl start init_wistcon-020.service

echo "The wistcon based software installation is done!"
