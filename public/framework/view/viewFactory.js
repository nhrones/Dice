import { buildRightScore, buildLeftScore, buildRoundedRectangle, DieBuilder } from './pathFactory.js';
import { container } from '../../view/container.js';
import Label from '../../view/label.js';
import Button from '../../view/button.js';
import Die from '../../view/die.js';
import ScoreButton from '../../view/scoreButton.js';
import Popup from '../../view/popup.js';
let geo = null;
export const player = (element) => {
    container.viewElements.add(new Label(element.idx, element.id, (element.renderAttributes.text) ? element.renderAttributes.text : "", element.pathGeometry, container.color, true));
};
export const label = (element) => {
    container.viewElements.add(new Label(element.idx, element.id, (element.renderAttributes.text) ? element.renderAttributes.text : "", element.pathGeometry, container.color, true));
};
export const popup = (element) => {
    container.viewElements.add(new Popup(element.pathGeometry, buildRoundedRectangle(element.pathGeometry)));
};
export const button = (element) => {
    container.viewElements.add(new Button(element.id, (element.renderAttributes.text) ? element.renderAttributes.text : "", element.pathGeometry, buildRoundedRectangle(element.pathGeometry)));
};
export const die = (element) => {
    if (Die.frozenFaces[0].width === 1) {
        let dieFaceBuilder = new DieBuilder;
        dieFaceBuilder.buildDieFaces(72, container.color);
    }
    container.viewElements.add(new Die(element.idx, element.id, element.pathGeometry, buildRoundedRectangle(element.pathGeometry)));
};
export const score = (element) => {
    let index = element.idx;
    geo = element.pathGeometry;
    let s = new ScoreButton(index, element.id, geo, (element.renderAttributes.isLeft) ? element.renderAttributes.isLeft : false, (element.renderAttributes.text) ? element.renderAttributes.text : "");
    const { left, top } = s.geometry;
    if (s.isLeftHanded) {
        s.path = buildLeftScore(s.geometry);
        s.upperName = new Label(-1, s.name + '-upperText', s.upperText, { left: left + 34, top: top + 35, width: 55, height: 30 }, s.color, false);
        s.lowerName = new Label(-1, s.name + '-lowerText', s.lowerText, { left: left + 32, top: top + 60, width: 55, height: 30 }, s.color, false);
        s.scoreBox = new Label(-1, s.name + '-score', '', { left: left + 80, top: top + 22, width: 28, height: 28 }, s.color, false);
    }
    else {
        s.path = buildRightScore(s.geometry);
        s.upperName = new Label(-1, s.name + '-upperText', s.upperText, { left: left + 60, top: top + 35, width: 55, height: 30 }, s.color, false);
        s.lowerName = new Label(-1, s.name + '-lowerText', s.lowerText, { left: left + 60, top: top + 60, width: 55, height: 30 }, s.color, false);
        s.scoreBox = new Label(-1, s.name + '-score', '', { left: left + 15, top: top + 69, width: 28, height: 28 }, s.color, false);
    }
    container.viewElements.add(s);
};
