---
title: Enclosing the Motion Radio
date: 2013-05-04
tags:
    - hardware
    - circuits
    - progress
    - pics
---

I have assembled my custom Arduino shield, tested the relay, and configured the software to make it all work.  It is now time to put all of the pieces together inside one box.

![](http://draft.smartamp.brace.io/pictures/2013/shield-assembled-mounting-in-box/shield-assembled-mounting-in-box-medium.jpg)

 - Arduino Uno (for the brains)
 - Realtime Clock (for time keeping)
 - Si4703 FM Radio (for the audio source)
 - Electric Imp (for network connectivity)
 - Solid State Relay (for toggling powered speakers)
 - AC Power Outlet (for plugging in the speakers)
 - Connectors for PIR sensors (for motion sensing)

<!-- more -->

I picked up an ABS plastic enclosure from Radioshack and began laying out where the components would go.  I had a hell of a time lining up the components with  the outer cover and manipulating the plastic.  I tried drilling, cutting, melting, and everything I tried was difficult and felt overly dangerous.  

> I've since picked up a [nibbler tool](http://www.amazon.com/gp/product/B0002KRACO), which chews through hard plastic quite easily and feels very safe to use.  No more threat of grievous bodily harm just to cut a hole in an enclosure.

In the future I may design my enclosures in 3D and send off to have them printed.

![](http://draft.smartamp.brace.io/pictures/2013/shield-assembled-mounting-in-box-2/shield-assembled-mounting-in-box-2-medium.jpg)

I wanted to have one power cord running into the box, and since I run AC mains into the outlet, I figured I could place the 5V DC power supply for the Arduino inside the enclosure.

> Embedding the 5V power supply inside my project box with AC mains running nearby is probably a bad idea.  I would not recommend.

![](http://draft.smartamp.brace.io/pictures/2013/shield-assembled-mounting-in-box-4/shield-assembled-mounting-in-box-4-medium.jpg)

Here you can see it all getting tucked away into the project box.

![](http://draft.smartamp.brace.io/pictures/2013/shield-assembled-mounting-in-box-5/shield-assembled-mounting-in-box-5-medium.jpg)

And here it is all closed up and plugged in!  I've got the powered speakers hooked up, as well as a small desk lamp.  Both the speakers and the lamp turn on when motion is sensed in the room.

----------

Up Next: Test this thing out!  

I plan on watching it really carefully for the first couple weeks.  Unplugging it every time I leave the room - because I don't wish to set my house on fire. 

Now that the hardware is wrapped up I'd like to live with it and see how well it functions in my normal day-to-day life.  If it lives up to my expectations then I hope to make more.