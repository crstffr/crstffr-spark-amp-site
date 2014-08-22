---
title: Arduino, Electric Imp, and Web Services
date: 2013-03-30
tags:
    - hardware
    - arduino
    - progress
    - pics
---

![](/pictures/2013/arduino-pir-imp-relay-1/arduino-pir-imp-relay-1-medium.jpg)

Having the radios connected to the net, I should have control over each of the devices and their individual states.

### Actions From Radio
1. Power status (on/off)
1. Volume level
1. Time to shut off
1. Last motion detected
1. Active time

### Actions Sent to Radio
1. Power on / enable radio
1. Power off / disabled radio
1. Volume level

Each ```Electric Imp``` has it's own unique URL to POST data to.  In order to send commands to all devices, every URL will need to be looped over.

### Progress Update

![](/pictures/sketches/sketch-arduino-imp-uart/sketch-arduino-imp-uart-medium.jpg)

I figured out the software serial communication between the Electric Imp and the Arduino.  I am currently able to pass whole strings from the internet to the Imp down to the Arduino and back again.  This means I have a way to trigger the on/off state of the radio device from a webpage loaded on my phone.  Basic HTTP POST's.

### Up Next

Next phase of this is to create a realtime web app that can update automatically when the Imp sends out commands to the net to visually show the device state.
