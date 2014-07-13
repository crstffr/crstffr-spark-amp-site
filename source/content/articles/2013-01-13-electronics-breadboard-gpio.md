---
title: Electronics, Breadboard, GPIO
date: 2013-01-13
tags:
    - hardware
    - rasppi
---

Today I did my first experimenting with opensource hardware, and soldered some electronics for the first time since junior high.  

I put together the [RaspPi Cobbler Kit](https://learn.adafruit.com/adafruit-pi-cobbler-kit) from Adafruit and plugged it into the breadboard.  Using the 3.3v output I wired a tiny circuit to power a red LED with a 220 ohm resistor.

<!-- more -->

Next I wired a little tactile switch between the power and LED and that worked just as expected.

Out of curiosity, I plugged the LED in without the resistor and sure enough it popped and let out a nasty stink.  Good to know!

Using the [Python Rpi.GPIO](https://pypi.python.org/pypi/RPi.GPIO) library, I ran a very simple test off of PIN18 to turn on/off the LED using Python commands.

Overall, this was a productive session of learning some GPIO and breadboarding basics.