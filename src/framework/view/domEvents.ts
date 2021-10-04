
import { thisPlayer, currentPlayer } from '../../globals.js'
import { events, topic } from '../model/events.js'
import { container, ctx } from '../../view/container.js'
import ViewElements from './viewElements.js'
import { IView } from '../../types.js';

///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//          aliases for faster resolution           \\
//          helps to reduce pressure on GC          \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

// values re-used repeatedly in event handlers
let x: number = 0
let y: number = 0
let boundingRect: DOMRect | null = null
let hit = false
let node: IView | null = null
let hoveredNode: IView | null = null

// persistance references to container objects
let viewElements: ViewElements
let canvas: HTMLCanvasElement

const left = 0
const right = 2
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//              initialize environment              \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

/**
 * Initializes an environment for custom canvas mouse/touch event handlers.
 * 
 * Registers local handler functions for:     
 *      canvas.mousedown + canvas.touchstart => handleClickOrTouch()    
 *      canvas.mousemove => handleMouseMove     
 */
export function initHandlers(): void {

    // setup local context from our host Container
    canvas = container.canvas
    viewElements = container.viewElements

    ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //                         bind events                        \\
    //  we use these events to decouple the View from the Model   \\
    ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    /*  Mouse Buttons i.e. var buttonPressed = e.button
        0: Main button pressed, usually the left button or the un-initialized state
        1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
        2: Secondary button pressed, usually the right button
        3: Fourth button, typically the Browser Back button
        4: Fifth button, typically the Browser Forward button
    */
   
    // register a handler for our canvas' mousedown event
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault()
        if (e.button === left) handleClickOrTouch(e.pageX, e.pageY)  
    }, false)

    // // register a handler for our canvas' touchstart event
    // canvas.addEventListener('touchstart', (e: TouchEvent) => {
    //     e.preventDefault()
    //     handleClickOrTouch(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
    // }, { passive: true })

    // register a handler for our canvas' mousemove event
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        e.preventDefault()
        if (container.hasVisiblePopup === false) {
            handleMouseMove(e)
        }
    })
}

/** Handles canvas mouse-move event.     
 * Provides logic to emulate 'onmouseenter', and        
 * 'onmouseleave' DOM events on our virtual elements.    
 * Uses the canvasContexts 'isPointInPath' method for hit-testing.    
 * @param {MouseEvent} evt - from canvas.mousemove event  
 */
function handleMouseMove(evt: MouseEvent, ) {
    
    boundingRect = canvas.getBoundingClientRect()
    x = evt.clientX - boundingRect.x
    y = evt.clientY - boundingRect.y
    // test for hovered
    node = null
    
    for (let [Id, element] of viewElements.activeNodes) {
        if (ctx.isPointInPath(element.path, x, y)) {
            // going from bottom to top, top-most object wins
            node = element
        }
    }

    // did we get a hover? 
    if (node !== null) {
        if (node !== hoveredNode) {
            // if this is not a 'player0textInput' ... hover it
            if (!(node.name === 'player0textInput')) {
                clearHovered()
                node.hovered = true
                node.update()
                hoveredNode = node
            }
        }
    } else { // no id was hit
        if (hoveredNode !== null) {
            clearHovered()
            hoveredNode = null
        }
    }
}

/** Handles both, canvas-mouse-Click and canvas-Touch events.    
 * Uses the canvasContexts 'isPointInPath' method for hit-testing.     
 * If a hit is detected, calls the hit elements touched() method.    
 * The elements touched() method will then broadcast this 'event' to any subscribers.   
 * 
 * @param {number} mX - an adjusted horizontal position of this event
 * @param {number} mY - an adjusted vertical position of this event
 */
function handleClickOrTouch(mX: number, mY: number) {
    hit = false
    // we reject all local click-events during a competitors turns
    if (currentPlayer.id === thisPlayer.id) {
        x = mX - canvas.offsetLeft
        y = mY - canvas.offsetTop
        for (let [Id, element] of viewElements.activeNodes) {
            if (!hit) {
                if (ctx.isPointInPath(element.path, x, y)) {
                    element.touched(true, x, y)
                    hit = true
                    if (!(element.name === 'player0textInput')) {
                        events.broadcast(topic.CancelEdits, {})
                    }
                }
            }
        }
    }
}

/** clear last hovered object */
function clearHovered() {
    if (hoveredNode !== null) {
        hoveredNode.hovered = false
        hoveredNode.update()
    }
}
