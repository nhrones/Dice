import { events, topic } from '../globals.js';
import { container, ctx } from './container.js';
let left = 1;
let top = 1;
export default class Popup {
    constructor(geometry, path) {
        this.id = 0;
        this.index = -1;
        this.activeView = true;
        this.zOrder = 100;
        this.name = "";
        this.enabled = true;
        this.hovered = false;
        this.selected = false;
        this.color = "black";
        this.text = "";
        this.visible = true;
        this.buffer = null;
        this.enabled = true;
        this.color = 'white';
        this.shownPath = path;
        this.hiddenPath = new Path2D();
        this.hiddenPath.rect(1, 1, 1, 1);
        this.geometry = geometry;
        this.path = this.hiddenPath;
        events.when(topic.ShowPopup, (data) => {
            this.show(data.message);
        });
        events.when(topic.HidePopup, () => {
            this.hide();
        });
    }
    show(msg) {
        this.text = msg;
        left = this.geometry.left;
        top = this.geometry.top;
        this.path = this.shownPath;
        this.visible = true;
        this.saveScreenToBuffer();
        this.render();
        container.hasVisiblePopup = true;
    }
    hide() {
        if (this.visible) {
            left = 1;
            top = 1;
            this.path = this.hiddenPath;
            this.restoreScreenFromBuffer();
            this.visible = false;
            container.hasVisiblePopup = false;
        }
    }
    saveScreenToBuffer() {
        this.buffer = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    restoreScreenFromBuffer() {
        if (this.buffer) {
            return ctx.putImageData(this.buffer, 0, 0);
        }
    }
    touched(broadcast, x, y) {
        this.hide();
        events.broadcast(topic.PopupResetGame, {});
    }
    update() {
        if (this.visible)
            this.render();
    }
    render() {
        ctx.save();
        ctx.shadowColor = '#404040';
        ctx.shadowBlur = 45;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = container.color;
        ctx.fill(this.path);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = container.textColor;
        ctx.stroke(this.path);
        ctx.strokeText(this.text, left + 150, top + 100);
        ctx.restore();
        this.visible = true;
    }
}
