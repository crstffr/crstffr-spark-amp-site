---
title: Wifi Multizone Audio Streaming - Pt 1
date: 2012-12-08
tags:
    - ideas
    - spotify
    - icecast
    - rasppi
---

These are the first ideas I had regarding building a wireless streaming audio distribution system for my home.  Prior to this endeavor I had built a linux-based NAS server for storing media files (mostly movies and tv shows), and was looking for a way to have a constant-on music source that could be tapped into from multiple locations in the home.

<!-- more -->

## And so it begins… ##

I want to be able to carry a device (my phone) that controls (and/or) plays music from room to room.

I have wifi access throughout my house - all on the same network.

The rooms do not need to play different channels, the same feed is all that is needed.

I use and love `Spotify`. No need to steal, seek out, find, store music.  It's always there and sounds fine and has plenty of content.


## What if ##

- I had a Windows box dedicated to running Spotify hosted on the local network
- Box is running a remote control server
- Audio output from Windows is broadcast as an `Icecast` MP3 radio station
    - Windows has made this rather difficult to do, but there is a program called `Virtual Audio Cable` that provides loopback audio
 - RaspberryPi's distributed throughout the house, hooked up to powered speakers, tuned to the MP3 radio station

## Initial results

I was able to get a concept working, streaming Spotify output over an Icecast server.

There's a promising looking [Spotify Remote](https://www.npmjs.org/package/spotify-remote) built on Node.js that has a web interface.  Not sure yet, but it probably doesn't support the radio feature, which is a critical feature that I need.

There are also Spotify remote apps for Android.

If Remote Desktop (RDP) isn't terribly slow, then that can be used to control Spotify from a desktop.

## Further testing

2012-12-12

I believe synchronizing the audio playback between devices will be **very difficult**.  BUT! I got a RaspberryPi to stream audio from my Windows Spotify icecast stream.  

So having a house full of Pi's could be possible.