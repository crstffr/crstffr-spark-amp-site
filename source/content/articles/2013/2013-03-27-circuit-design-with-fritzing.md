---
title: Circuit Design with Fritzing 
date: 2013-03-27
tags:
    - fritzing    
    - circuits
    - progress
    - pics
    - pcb
---

My hardware experiment has grown quite a bit and I am ready to move beyond jumper wires and breadboards.  As you can see, this is becoming a bit unwieldy.

![](http://draft.smartamp.brace.io/pictures/2013/arduino-pir-radio-breadboard/arduino-pir-radio-breadboard-medium.jpg)

To do this, I found a cool piece of software called [Fritzing](http://fritzing.org/), which lets you mock up your circuits on a virtual breadboard, with virtual components.

What is really neat is that both [Sparkfun](https://github.com/sparkfun/Fritzing_Parts) and [Adafruit](https://github.com/adafruit/Fritzing-Library) have libraries of their physical products that you can import into Fritzing, so it's visually representative of the physical circuit that you're playing with.  They even had components for my `Si4703 FM Tuner` board and `Realtime Clock` board.  (I had to do some wizardry and flip the pins around on the FM Tuner board to get it to line up the way I wanted).

### Modeling the FM and RTC Module Board

![](http://draft.smartamp.brace.io/pictures/sketches/fritzing-radio-clock-jackboard/fritzing-radio-clock-jackboard-medium.png)

Early on in this experiment I wanted to consolidate some components so that they were more portable, and did not require so many jumper wires.  So I used Fritzing to mock up how I could combine some parts onto a small proto-board.

I soldered male headers to all of the breakout boards and want to plug them into female headers so that the they can be easily removed if necessary.  

This module board combines both the `Si4703 FM Tuner` board and the `Realtime Clock` board onto one proto-board, with a 5-pin connector.  Red wires represent +voltage, black wires represent ground, blue and yellow wires represent serial lines. 

This board reduced the number of jumper wires needed to hook up these components during development.

<!-- more -->

### Modeling the Arduino Shield

![](http://draft.smartamp.brace.io/pictures/sketches/fritzing-motion-radio-v1-breadboard/fritzing-motion-radio-v1-breadboard-medium.png)

Above you see the Arduino Uno (top) wired up to the FM Tuner breakout board (left), a Realtime Clock breakout board (right), and 2 PIR motion sensors (bottom left).

I want to fit the FM module and the Clock module onto an [Arduino Shield](http://shieldlist.org/) so that I can stack it on top of the Electric Imp shield, allowing the power, ground, and serial lines to pass easily between the boards.

A really great feature of Fritzing is that once you've made the electrical connections in the breadboard view, you can switch over to the PCB view and start designing your own circuit boards.

> Designing a circuit using Fritzing is by no means easy. It is much more difficult than dragging and dropping the wires into a visual breadboard.  But, with a lot of patience, [reading tutorials](http://fritzing.org/learning/tutorials/designing-pcb/), and [watching videos](https://www.youtube.com/watch?v=eHU-pF5gSnQ), I managed to design my circuit onto a space just slightly larger than an Arduino shield.

What I ended up with was this.

![](http://draft.smartamp.brace.io/pictures/sketches/fritzing-motion-radio-pcb-r2/fritzing-motion-radio-pcb-r2-medium.jpg)

The orange represents what would be copper when fabricated into an actual PCB (printed circuit board).  You can see the traces that the copper would make, forming an electrical connection between the pins (the little round holes).  My design is not great (for various reasons), as it does require the use of a couple of jumper wires to be soldered in (the blue lines).

All in all, it has been a fun exercise in an area that I have never worked before. I think soon I would like to try to turn this design into an actual physical printed circuit board.









