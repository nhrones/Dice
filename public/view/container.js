import { $, DEV } from '../globals.js';
import { player, label, popup, button, die, score } from '../framework/view/viewFactory.js';
import { initHandlers } from '../framework/view/domEvents.js';
import ViewElements from '../framework/view/viewElements.js';
import { compileUI } from '../framework/compiler/compiler.js';
export var ctx;
export var container;
export class Container {
    constructor(canvas, color) {
        this.hasVisiblePopup = false;
        this.viewElements = new ViewElements();
        this.color = color;
        this.textColor = 'black';
        this.canvas = canvas;
        this.x = parseInt(this.canvas.style.left);
        this.y = parseInt(this.canvas.style.top);
        ctx = this.initCanvasContext(canvas, color);
    }
    static init(canvas, color) {
        if (!Container._instance) {
            Container._instance = new Container(canvas, color);
            container = Container._instance;
        }
        initHandlers();
    }
    hydrateUI() {
        let nodes = (DEV) ? null : JSON.parse(localStorage.getItem('elementDescriptors'));
        if (nodes == null) {
            compileUI();
            nodes = JSON.parse(localStorage.getItem('elementDescriptors'));
        }
        for (let index = 0; index < nodes.length; index++) {
            let node = nodes[index];
            switch (node.kind) {
                case "label":
                    label(node);
                    break;
                case "popup":
                    popup(node);
                    break;
                case "button":
                    button(node);
                    break;
                case "die":
                    die(node);
                    break;
                case "score":
                    score(node);
                    break;
                case "player":
                    player(node);
                    break;
                default:
                    break;
            }
        }
        let surface = $("surface").parentElement;
        surface.parentElement.removeChild(surface);
    }
    initCanvasContext(canvas, color) {
        let ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.font = "16px Tahoma, Verdana, sans-serif";
            ctx.textAlign = 'center';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        return ctx;
    }
    clearCanvas(buffer) {
        if (buffer) {
        }
        else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return this;
        }
    }
    setPosition(x, y) {
        this.x = x;
        this.canvas.style.left = x + 'px';
        this.y = y;
        this.canvas.style.top = y + 'px';
        return this;
    }
}
