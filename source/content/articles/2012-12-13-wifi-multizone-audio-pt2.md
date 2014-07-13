---
title: Wifi Multizone Audio Streaming - Pt 2
date: 2012-12-13
tags:
    - ideas
    - spotify
    - icecast
    - rasppi
---

I've made some progress in the past few days and want to recap what's currently setup and what will need to be figured out before moving forward.

<!-- more -->

## What's currently setup

1. A dedicated streaming server is setup, currently running Windows.  Will probably setup dual-boot to Ubuntu.

1. Streaming server takes it's audio output and feeds it into an Icecast stream.  Any device on the network can access the stream at: http://apollo:8000/play

1. Streaming server is running Spotify for source of audio.

1. A web service is setup to control the Spotify client, so songs can be queued, skipped, etc from remote devices - such as laptops, desktops, or phones.

1. A RaspberryPi is setup running `MPD + MPC` to play the Spotify Icecast stream.  This is great for putting in various rooms that don't have a PC hooked up to speakers.

## Here's what I need to figure out

1. Audio playback is not synchronized between playback devices. This results in echo between rooms, or when listening to techno/house - it sounds like a "trainwreck".

    * It looks like it's been a problem people have been trying to solve for quite some time (solid article + code going all the way back to 2002)

        * `p4sync` - plugin for MPC, really old, no documentation on how to use it.  It may potentially run on RaspPi's but not on Windows.

        * `SyncBoss` - Winamp + Java solution, appears to not support audio streams - just local audio files.

        * `VLC` - has a netsync method for server/client streaming.

1. How to skip tracks from the Pi itself?  Physical buttons?

1. I would like to see the album artwork, artist name, and song title on the clients.