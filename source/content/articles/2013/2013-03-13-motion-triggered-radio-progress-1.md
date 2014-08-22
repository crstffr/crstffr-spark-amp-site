---
title: Motion Triggered Radio Progress
date: 2013-03-13
tags:
    - hardware
    - PIR
    - progress
    - pictures
---

![](/pictures/2013/parallax-pir-enclosed/parallax-pir-enclosed-medium.jpg)

I've managed to get the PIR motion sensors to work quite easily, even putting one in a small enclosure with an 18' wire and taped it up on the wall.  It's definitely not pretty, but functional prototypes rarely are.  I setup the Arduino sketch so it can have multiple sensors, any one of which will trigger the radio.  

<!-- more -->

![](/pictures/2013/parallax-pir-taped-to-wall/parallax-pir-taped-to-wall-medium.jpg)

One test I just finished was to wire up a potentiometer that controls how long the music stays on based upon the setting of the knob.  Works pretty slick.

![](/pictures/2013/arduino-pir-radio-breadboard/arduino-pir-radio-breadboard-medium.jpg)

I soldered together the LCD shield but need a pair of snub nose wire cutters to cut down a couple pins before I can use it.

Also placed another Sparkfun order for an [Electric Imp](https://www.sparkfun.com/products/11395) for internet connectivity, a [real time clock module](https://www.sparkfun.com/products/12708) for setting inactive times, and a [solid state AC relay kit](https://www.sparkfun.com/products/10684) for being able to switch on/off a pair of active (powered) speakers.  