import { events, topic } from '../globals.js';
import { container, ctx } from './container.js';
export default class ScoreButton {
    constructor(index, name, geometry, isLeftHanded, text) {
        this.id = 0;
        this.zOrder = 0;
        this.activeView = true;
        this.enabled = true;
        this.hovered = false;
        this.selected = false;
        this.path = new Path2D();
        this.color = 'black';
        this.scoreText = '';
        this.available = false;
        this.tooltip = "";
        this.upperText = "";
        this.lowerText = "";
        this.upperName = null;
        this.lowerName = null;
        this.scoreBox = null;
        this.index = index;
        this.name = name;
        this.text = '';
        this.tooltip = `${name} available`;
        this.enabled = true;
        this.hovered = false;
        this.selected = false;
        this.geometry = geometry;
        this.isLeftHanded = isLeftHanded;
        this.upperText = text.split(' ')[0];
        this.lowerText = text.split(' ')[1] || '';
        events.when(topic.UpdateScoreElement + this.index, (data) => {
            if (data.renderAll) {
                this.color = data.color;
                this.render();
            }
            this.available = data.available;
            this.scoreText = data.valueString;
            this.renderScore(data.valueString, data.available);
        });
    }
    touched(broadcast, x, y) {
        events.broadcast(topic.ScoreButtonTouched + this.index, {});
    }
    update() {
        events.broadcast(topic.UpdateTooltip + this.index, { hovered: this.hovered });
        this.render();
        this.renderScore(this.scoreText, this.available);
    }
    render() {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = (this.hovered) ? 'orange' : this.color;
        ctx.stroke(this.path);
        ctx.restore();
        ctx.fillStyle = this.color;
        ctx.fill(this.path);
        if (this.upperName) {
            this.upperName.fillColor = this.color;
            this.upperName.fontColor = container.color;
            this.upperName.text = this.upperText;
            this.upperName.render();
        }
        if (this.lowerName) {
            this.lowerName.fillColor = this.color;
            this.lowerName.fontColor = container.color;
            this.lowerName.text = this.lowerText;
            this.lowerName.render();
        }
    }
    renderScore(scoretext, available) {
        let scoreBoxColor = (available) ? 'blue' : this.color;
        if (scoretext === '') {
            scoreBoxColor = this.color;
        }
        if (this.scoreBox) {
            this.scoreBox.fontColor = container.color;
            this.scoreBox.fillColor = scoreBoxColor;
            this.scoreBox.text = scoretext;
            this.scoreBox.render();
        }
    }
}
