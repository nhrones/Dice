import { events, topic } from '../framework/model/events.js';
import { ctx } from './container.js';
export default class Die {
    constructor(index, name, geometry, path) {
        this.id = 0;
        this.index = 0;
        this.activeView = true;
        this.zOrder = 0;
        this.enabled = true;
        this.hovered = false;
        this.selected = false;
        this.frozen = false;
        this.value = 0;
        this.index = index;
        this.name = name;
        this.enabled = true;
        this.geometry = geometry;
        this.color = 'transparent';
        this.path = path;
        this.render({ value: 0, frozen: false });
        events.when(topic.UpdateDie + this.index, (state) => {
            this.frozen = state.frozen;
            this.value = state.value;
            this.render(state);
        });
    }
    touched(broadcast, x, y) {
        events.broadcast(topic.DieTouched, { index: this.index.toString() });
    }
    update() {
        this.render({ frozen: this.frozen, value: this.value });
    }
    render(state) {
        let image = (state.frozen) ? Die.frozenFaces[state.value] : Die.faces[state.value];
        ctx.putImageData(image, this.geometry.left, this.geometry.top);
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = (this.hovered) ? 'orange' : 'white';
        ctx.stroke(this.path);
        ctx.restore();
    }
}
Die.faces = [
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1)
];
Die.frozenFaces = [
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1),
    new ImageData(1, 1)
];
