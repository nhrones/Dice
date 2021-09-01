import { thisPlayer, currentPlayer } from '../../globals.js';
import { events, topic } from '../model/events.js';
import { container, ctx } from '../../view/container.js';
let x = 0;
let y = 0;
let boundingRect = null;
let hit = false;
let node = null;
let hoveredNode = null;
let viewElements;
let canvas;
const left = 0;
const right = 2;
export function initHandlers() {
    canvas = container.canvas;
    viewElements = container.viewElements;
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.button === left)
            handleClickOrTouch(e.pageX, e.pageY);
    }, false);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleClickOrTouch(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }, { passive: true });
    canvas.addEventListener('mousemove', (e) => {
        e.preventDefault();
        if (container.hasVisiblePopup === false) {
            handleMouseMove(e);
        }
    });
}
function handleMouseMove(evt) {
    boundingRect = canvas.getBoundingClientRect();
    x = evt.clientX - boundingRect.left;
    y = evt.clientY - boundingRect.top;
    node = null;
    for (let [Id, element] of viewElements.activeNodes) {
        if (ctx.isPointInPath(element.path, x, y)) {
            node = element;
        }
    }
    if (node !== null) {
        if (node !== hoveredNode) {
            if (!(node.name === 'player0textInput')) {
                clearHovered();
                node.hovered = true;
                node.update();
                hoveredNode = node;
            }
        }
    }
    else {
        if (hoveredNode !== null) {
            clearHovered();
            hoveredNode = null;
        }
    }
}
function handleClickOrTouch(mX, mY) {
    hit = false;
    if (currentPlayer.id === thisPlayer.id) {
        x = mX - canvas.offsetLeft;
        y = mY - canvas.offsetTop;
        for (let [Id, element] of viewElements.activeNodes) {
            if (!hit) {
                if (ctx.isPointInPath(element.path, x, y)) {
                    element.touched(true, x, y);
                    hit = true;
                    if (!(element.name === 'player0textInput')) {
                        events.broadcast(topic.CancelEdits, {});
                    }
                }
            }
        }
    }
}
function clearHovered() {
    if (hoveredNode !== null) {
        hoveredNode.hovered = false;
        hoveredNode.update();
    }
}
