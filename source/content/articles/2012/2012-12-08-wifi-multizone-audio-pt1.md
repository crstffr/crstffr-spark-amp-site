---
title: Wifi Audio Streaming - Pt 1
date: 2012-12-08
tags:
    - ideas
    - spotify
    - icecast
    - rasppi
---

These are my first ideas regarding building a wireless streaming audio distribution system for my home.

Prior to this endeavor, I had just finished building a linux-based NAS server for storing media files (mostly movies and tv shows), and was looking for a way to have an always-on music source that could be tapped into from multiple locations in the home.

I had just started playing with my first `Raspberry Pi` and was looking for a project to use it on.

![](/pictures/sketches/sketch-rpi-speakers/sketch-rpi-speakers-medium.jpg)

<!-- more -->

## And so it begins… ##

I want to be able to carry a device (my phone) that controls (and/or) plays music from room to room.

- I have wifi access throughout my house - all on the same network.
- The rooms do not need to play different channels, the same feed is all that is needed.
- I use and love `Spotify`. No need to steal, seek out, find, store music.  It's always there and sounds fine and has plenty of content.


## What if ##

- I had a dedicated machine running Spotify hosted on the local network
- That machine runs a Spotify remote control server app
- Audio from machine is broadcast as an `Icecast` MP3 radio station (need to use `Virtual Audio Cable` for loopback audio)
- RaspberryPi's distributed throughout the house, each hooked up to powered speakers, are tuned to the MP3 radio station
- RPI's could be configured to turn on/off music based upon activity in each room

## Initial results

I was able to get a concept working, streaming Spotify output over an Icecast server.

There's a promising looking [Spotify Remote](https://www.npmjs.org/package/spotify-remote) built on Node.js that has a web interface.  Not sure yet, but it probably doesn't support the radio feature, which is a critical feature that I need.

There are also Spotify remote apps for Android.

If Remote Desktop (RDP) isn't terribly slow, then that can be used to control Spotify from a desktop.

## Further testing

Synchronizing the audio playback between devices will be **very difficult**.  BUT! I was able to get a single RaspberryPi to stream audio from my Windows Spotify Icecast stream.

Having a house full of Pi's could be possible.