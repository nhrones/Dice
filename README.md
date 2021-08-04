# DenoDice
 
## Single player poker dice game.
This will soon be multi-player via BroadcastChannel on Deno-Deploy.

* No dependencies, single HTMLCanvas element with virtual Dom-like UI.

* The virtual element objects are hydrated from HTML and css.


I have a one-to-four player version that works great served from    
a Deno file/WebSocket server.  I'm rewriting that now to use     
Deploy's BroadcastChannel implementation.  This is not a trivial    
task as WebSeocket is a Client/Server model and BC is peep-to-peer   
model.  I'm using a peer token-passing scheme to rewrite this.

The fun thing about the multiplayer game is that players are allowed    
to 'steal' other players score items if they roll a greater sum for that item.    

HeeHee ... snicker-sniker ...

[![dice](https://github.com/nhrones/DenoDice/blob/main/dice.jpg)](https://dice.deno.dev)

## Run Online
https://dice.deno.dev

Usage:
```
Click the 'Roll Button' to start.    
After each roll of the dice, you can 'click' a die to 'freeze' it.    
Click again to toggle it.  (on phone/touch you may need to long-touch to select die)   
After three rolls, you must select a score item.
```
## Developed using my own custom framework (Surface)
## Interesting features
### Just a single DOM canvas element 
All objects on the screen are simply rendered to this canvas.<br/>
These objects exibit most of the functionality of DOM elements including:<br/>
    hit testing, click/touch, mouse-in/out, hovered, events!<br/>
    The container and all objects are decoupled on an internal event-bus<br/>
    Objects are compiled and hydrated from custom html and css (svelte-like)<br/>
    Compilation produces element-descripter objects. Compilation is controlled by<br/>
    a DEV flag, and element-descripter objects are persisted in localStorage.<br/>
    Hydration uses these descripter objects to build virtual dom-like viewElement objects .<br/>
    The dice objects build their own images during hydration.<br/> 
    Each viewElement instantiates and initializes its own backing view-model during hydration.<br/> 
    Geometric attributes from html/css are used to configure Path2D objects for each.<br/>
    
### ZERO External Dependencies PURE Vanilla Typescript  
Moving this multi-player game from deno-webSockets to Deploy was a real PITA!<br/>
Most tools for deploy don't play well in Windows!<br/>
DeployCtl had issues that caused me to run my own modified repo.<br/>
Fresh doesn't handle new URL() properly in Windows.<br/>
Sift has similar isues.<br/>

So, I write Typescript, transpile it to a public folder and link<br/>
this public folder to Deploy! I can run this public javascript from deployCtl,<br/>
but this is NEVER a guarantee that it will work correctly in Deploy. 
    
