---
title: Etching an Arduino Shield PCB 
date: 2013-04-02
tags:  
    - circuits
    - progress
    - pics
    - pcb 
---

In the past I have experimented with etching brass plates using a combination of [muriatic acid and hydrogen peroxide.](http://www.instructables.com/id/Stop-using-Ferric-Chloride-etchant!--A-better-etc/)  To etch my own printed circuit boards I decided to pick up a bottle of [ferric chloride from Radio Shack](http://www.radioshack.com/product/index.jsp?productId=2102868#) because I thought it might work better and put off less noxious fumes.

![](http://draft.smartamp.brace.io/pictures/2013/pcb-etchant-developer/pcb-etchant-developer-medium.jpg)

I also have a whole bunch of photo developing and screen printing equipment that I use for my other artistic endeavors, so I decided that I would try using [MG Chemicals Presensitized PCB](http://www.mgchemicals.com/products/prototyping-and-circuit-repair/presensitized-boards/positive-presensitized-600-series/).  

This type of PCB (printed circuit board) has a photo sensitive mask on top of the copper.  When the mask is exposed to light and then developed using a special chemical, it leaves behind a copy of the design directly on the board.  When dunked in etchant, the mask protects the parts of the board you want to keep as copper, and allows the rest to be etched down to fiberglass.

<!-- more -->

----------

### Overview of the Process

1. Print your PCB design POSITIVE onto a transparency (see notes below)
2. With the protective coating still on, trim PCB to size (see notes below)
3. In very low light, slowly peel off the protective coating
4. Affix the design transparency to the mask-side of the sensitized PCB
5. Smush the design against the PCB using a piece of glass 
6. Expose the board to UV light for some time (amount depends upon light source)
7. Develop the board in a shallow tray of developer (see notes below)
8. Rinse in cold water and dry, maybe use a hair dryer
9. Prepare etchant by bringing it to correct temperature 
10. Submerse the board in the etchant bath
11. Occasionally agitate the etchant
13. My boards tend to take around a half hour
14. Remove board from bath, wipe off excess etchant, then rinse
16. Using a drill press, drill out your pin holes (see notes below)
17. Bask in the glory of your hand made PCB!

There are definitely more thorough tutorials online for how to make your own DIY PCBs.  Using presensitzed boards is not for everyone since it does require so much stuff, but since I dabble in printing, I had most of the stuff already.

----------

![](http://draft.smartamp.brace.io/pictures/2013/motion-radio-pcb-positive-etch-bottom-r2/motion-radio-pcb-positive-etch-bottom-r2-medium.jpg)

### Notes on Printing Designs for PCB Etching

You will be printing a POSITIVE, meaning the black areas on the design will end up as copper, and the white areas will be fiberglass. 

You may need to print a MIRROR image of the design if you're intending to solder through-hole components (since it will technically be the bottom of the board). 

Your image must be made up of all BLACK.  No color, no gray.  If the image area is not made up of 100% black, then you will get unexpected results.

For best results, I print my designs using an Epson Photo 1400 inkjet printer and "waterproof" transparency films.  I use these films for screen printing, so I have them laying around.  Most people will not.

Print using only BLACK ink, on the highest quality setting your printer can muster.  What you are looking for is a very opaque coating of ink so as to block as much light as possible.

----------

### Notes on Cutting Presensitized PCB 

Be VERY careful when cutting presensitized PCB. The photo mask is very fragile and tends to come off very easily.  Any excess pressure applied will lift the mask off and ruin it.

I tried using my old-school guillotine paper cutter. Though the blade was sharp and cut clean, the mask was ruined a 1/2" on either side of the cut (due to the pressure).  Not recommended.

I also tried a handheld jigsaw and that was no good.  Some people use rotary tools (like Dremel) with cutting disks, so that may be a good option.

The cleanest method I found, (although the most time consuming and difficult) was to score the PCB with a utility knife and straight-edge, then snapping the board.  The fiberglass boards destroy razor blades, but you end up with sharp cuts and the mask sticks.

----------

### Notes on Developing the Mask

The mask can develop REAL quick and you can be left with a bare piece of copper board if you're not careful.

From my experience, the warmer the developer the faster it develops.  If it's at or below room temperature, the process is more manageable and you will have time to ensure it doesn't over-develop.

As soon as it appears to have removed the mask in your design, CAREFULLY rinse it in cold water, the mask is thin and likes to come off easily when it's warm and wet.

----------

![](http://draft.smartamp.brace.io/pictures/2013/drillbit-city-bits/drillbit-city-bits-medium.jpg)

### Notes on Drilling Holes for PCBs

I originally tried drilling the holes using a cordless drill and just broke a bunch of bits.  I found an old drill press on Craigslist for $30, and it has been worth every penny.

The holes need to be pretty small, much smaller than any bits I could find at the big box stores in my area (Home Depot, Menards).  So I ordered some bits from a small online shop called [Drill Bit City.](https://www.drillbitcity.com/) They stock nice sets of bits for reasonable prices.  I ordered the `10pc #69 - #60` and the `10pc #79 - #70` just to have a variety of sizes.  Honestly, I only use a couple sizes, so most of the tiny 70's go unused.

For the male pin header holes I used a size #65 bit, which seems to be a good size for most through-hole components. 

Mount the PCB to a larger piece of wood and take your time.  It's really easy to break bits.  Buy extras.

----------

![](http://draft.smartamp.brace.io/pictures/2013/etched-motion-radio-pcb/etched-motion-radio-pcb-medium.jpg)

The final product isn't the prettiest thing I've ever made, but it works, so that makes it one of the coolest things I've ever made.  Luckily the couple holes that I over-drilled are not needed by my circuit. 

Next up: Putting it all together in an enclosure!