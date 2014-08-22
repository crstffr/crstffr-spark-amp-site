---
title: Arduino Uno and Si4703 eval board
date: 2013-03-11
tags:
    - hardware
    - arduino
    - si4703
    - fm
---

I wanted to get my feet wet with some open source hardware, so I did my research and made my first order to [Sparkfun](http://sparkfun.com).

![](/pictures/2012/ArduinoUnoSmd/ArduinoUnoSmd-medium.jpg)

I received my `Arduino Uno` and started playing with some basic components and "sketches" (which are little Arduino programs).  I also began testing an `Si4703` FM tuner evaluation board to see how feasible it would be to integrate into my project.

<!-- more -->

## Arduino experiments ##

For my initial experiments, I used an [Arduino Uno R3](https://www.sparkfun.com/products/11021), which is supposed to be the easiest to get started with since it has a USB port for programming.

1. I made Arduino blink it's own LED
1. I made Arduino blink an external LED on a breadboard
1. I made Arduino fade in/out LED on a breadboard
1. I read the analog voltage off of a potentiometer and wrote it to the serial monitor
1. I used a potentiometer to control the brightness of an LED on a breadboard

All of that was really simple with the help of online tutorials.

## Si4703 FM Radio tests ##

![](/pictures/2012/si4703-eval-board/si4703-eval-board-medium.jpg)

The FM Radio receiver from Sparkfun is an [Si4703 Evaluation Board](https://www.sparkfun.com/products/10663) that exposes the features of a tiny digital FM tuner chip from Silicon Labs.  It can be controlled using an `SPI` interface, so with a few pins on an Arduino you can set the radio station, volume, scan for stations, and other normal FM radio features.

I soldered some pin headers onto the evaluation board and plugged it into my breadboard.  Following some online tutorials I was able to get the radio up and running quite easily.

![](/pictures/2013/arduino-si4703-test-1/arduino-si4703-test-1-medium.jpg)

I spent more time trying to reduce audio interference than anything. I found if I wired a ground to the breadboard (directly from the electrical outlet) that it reduced the noise quite a bit when using an AC power adapter (instead of USB for power).