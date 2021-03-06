# DenoDice
 
## Single player poker dice game.

* No dependencies, single HTMLCanvas element with virtual Dom-like UI.

* The virtual element objects are hydrated from HTML and css.

[![dice](https://github.com/nhrones/Dice/blob/master/dice.jpg)](https://nhrones.github.io/Dice/)

## Run Online
https://nhrones.github.io/Dice/

Usage:
```
Click the 'Roll Button' to start.    
After each roll of the dice, you can 'click' a die to 'freeze' it.    
Click again to toggle it.  
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
    Compilation produces element-descriptor objects. Compilation is controlled by<br/>
    a DEV flag, and element-descriptor objects are persisted in localStorage.<br/>
    Hydration uses these descriptor objects to build virtual dom-like viewElement objects .<br/>
    The dice objects build their own images during hydration.<br/> 
    Each viewElement instantiates and initializes its own backing view-model during hydration.<br/> 
    Geometric attributes from html/css are used to configure Path2D objects for each.<br/>
    
### ZERO External Dependencies PURE Vanilla Typescript  

    
