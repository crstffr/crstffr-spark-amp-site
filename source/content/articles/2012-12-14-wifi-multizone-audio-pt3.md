---
title: Wifi Audio Streaming - Pt 3
date: 2012-12-14
tags:
    - ideas
    - vlc
    - rtsp
    - icecast
---

I just got VLC setup to run a test RTSP stream from the Windows server to my workstation.  Connecting an additional client to play the streams simultaneously, somehow managed to sync even though they started drastically out of sync.

<!-- more -->

My next test was to run my Icecast stream, grab that in VLC and stream that over RTSP, which worked.  There is significant lag in the audio (right now it's ~10 seconds).  I'm going to play with the buffer settings, see if I can get that down to a few seconds.  The audio quality is not *quite* the same as playing Spotify directly on the workstation, but honestly, it's not bad.

The RaspberryPi can run VLC using the `vlc-nox` package (no GUI) and the command line version `cvlc`.  It seems to stream the RTSP feed alright, but as soon as I turn on the debugger it uses too much CPU and the stream skips and stutters.

`cvlc --network-caching=1000 rtsp://apollo:8554/stream`

So apparently the Icecast server is redundant, since VLC can take the microphone input and stream it via RTSP, making the whole setup quite a bit easier.


## So here's a plan ##

I picked up a $200 refurbished Dell a while back, it will run Windows 7 and also an Ubuntu virtual machine that will be running Spotify and `Spot Commander`.  The audio will leak out of the virtual machine to Windows, where VLC will pipe it across the network in an RTSP stream.
