---
title: Wiring Up the Relay 
date: 2013-03-28
tags:
    - circuits
    - progress
    - pics
---

One of the goals of my Motion Radio project is to be able to power on and off a pair of active speakers when there is activity in the room. So, to accomplish this I've purchased and assembled a [Solid State Relay Kit from Sparkfun.](https://www.sparkfun.com/products/10684) 

![](http://draft.smartamp.brace.io/pictures/2013/sparkfun-solid-state-relay-kit/sparkfun-solid-state-relay-kit-medium.jpg)

I chose the solid state model over the mechanical relay because I wanted it to be quiet.  Mechanical relays can have a rather loud snap/clack sound when toggling the power.

I also picked up an electrical outlet and enclosure that I can mount the outlet into.  The enclosure is a big heavy metal thing that is total overkill, but I liked that it had "feet" so it could stand up while I was working with it.

The kit was very easy to assemble and very easy to use.  Passing a 5V control voltage to the middle pin allows the AC power to flow through the other side of the board.

<!-- more -->

![](http://draft.smartamp.brace.io/pictures/2013/arduino-pir-imp-relay-1/arduino-pir-imp-relay-1-medium.jpg)

Above you can see (from right to left):

 * The outlet + enclosure (wall-wart plugged in)
 * Solid state relay board glowing green
 * Arduino Uno + Electric Imp shield
 * Si4703 FM Radio (with green audio cord) + Realtime Clock proto-board
 * Jumper wires to another perfboard that connects two external PIR motion sensors.

Although I feel confident in my abilities when dealing with AC power, it does seem a bit more dangerous now that the AC mains are running through a part of my project. 

The hardware stuff is coming along nicely, but so is the software side of things.  I have the Electric Imp able to take data passed from the internet and pass that down to the Arduino to toggle the speakers on/off.

![does this do anything](http://draft.smartamp.brace.io/pictures/2013/arduino-ide-console-electric-imp-code/arduino-ide-console-electric-imp-code-medium.jpg)

(I apologize, this picture is awful! I should have screencapped it - I'm actually not sure why I didn't...)

Up next is to give PCB etching a shot and see if I can't make an Arduino shield out of my circuit design.