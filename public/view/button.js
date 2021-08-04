import { events, topic } from '../framework/model/events.js';
import { container, ctx } from './container.js';
import Label from './label.js';
export default class Button {
    constructor(name, text, geometry, path) {
        this.id = 0;
        this.activeView = true;
        this.index = -1;
        this.zOrder = 0;
        this.name = '';
        this.enabled = true;
        this.hovered = false;
        this.selected = false;
        this.firstPass = true;
        this.text = "";
        this.name = name;
        this.zOrder = 0;
        this.geometry = geometry;
        this.color = container.textColor;
        this.textColor = container.color;
        this.enabled = true;
        this.textLabel = new Label(-1, this.name + 'Label', text, {
            left: geometry.left + 68,
            top: geometry.top + 30,
            width: geometry.width - 25,
            height: 40
        }, 'blue', true);
        this.path = path;
        this.firstPass = true;
        this.render();
        events.when(topic.UpdateButton + this.name, (data) => {
            this.enabled = data.enabled;
            this.color = data.color;
            this.text = data.text;
            this.render();
        });
    }
    touched(broadcast, x, y) {
        if (this.enabled) {
            if (broadcast) {
                events.broadcast(topic.ButtonTouched + this.name, {});
            }
        }
    }
    update() {
        this.render();
    }
    render() {
        ctx.save();
        if (this.firstPass) {
            ctx.shadowColor = 'burlywood';
        }
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = (this.hovered) ? 'orange' : 'black';
        ctx.stroke(this.path);
        ctx.restore();
        ctx.fillStyle = this.color;
        ctx.fill(this.path);
        ctx.fillStyle = container.color;
        if (this.firstPass || this.hovered) {
            this.firstPass = false;
        }
        ctx.restore();
        this.textLabel.fillColor = this.color;
        this.textLabel.fontColor = this.textColor;
        this.textLabel.text = this.text;
        this.textLabel.render();
    }
}
