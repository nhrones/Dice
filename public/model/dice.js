import { events, topic } from '../globals.js';
import PlaySound from '../framework/model/sounds.js';
import DiceEvaluator from './diceEvaluator.js';
import { game } from './diceGame.js';
export default class Dice {
    constructor() {
        this.rollCount = 0;
        this.dieSize = 72;
        this.isFiveOfaKind = false;
        this.fiveOfaKindCount = 0;
        this.fiveOfaKindBonusAllowed = false;
        this.fiveOfaKindWasSacrificed = false;
        this.evaluator = DiceEvaluator.init();
        this.die = [
            { value: 0, frozen: false },
            { value: 0, frozen: false },
            { value: 0, frozen: false },
            { value: 0, frozen: false },
            { value: 0, frozen: false }
        ];
        this.sum = 0;
        events.when(topic.DieTouched, (payload) => {
            let thisDie = this.die[payload.index];
            if (thisDie.value > 0) {
                thisDie.frozen = !thisDie.frozen;
                this.updateView(payload.index, thisDie.value, thisDie.frozen);
                PlaySound.Select();
            }
        });
    }
    static init() {
        if (!Dice._instance) {
            Dice._instance = new Dice();
        }
        return Dice._instance;
    }
    resetTurn() {
        this.die.forEach((thisDie, index) => {
            thisDie.frozen = false;
            thisDie.value = 0;
            this.updateView(index, 0, false);
        });
        this.rollCount = 0;
        this.sum = 0;
    }
    resetGame() {
        this.resetTurn();
        this.isFiveOfaKind = false;
        this.fiveOfaKindCount = 0;
        this.fiveOfaKindBonusAllowed = false;
        this.fiveOfaKindWasSacrificed = false;
    }
    roll(dieValues) {
        PlaySound.Roll();
        this.sum = 0;
        this.die.forEach((thisDie, index) => {
            if (dieValues === null) {
                if (!thisDie.frozen) {
                    thisDie.value = Math.floor(Math.random() * 6) + 1;
                    this.updateView(index, thisDie.value, thisDie.frozen);
                }
            }
            else {
                if (!thisDie.frozen) {
                    thisDie.value = dieValues[index];
                    this.updateView(index, thisDie.value, thisDie.frozen);
                }
            }
            this.sum += thisDie.value;
        });
        this.rollCount += 1;
        this.evaluator.evaluateDieValues();
        game.evaluatePossibleScores();
    }
    updateView(index, value, frozen) {
        events.broadcast(topic.UpdateDie + index, { value: value, frozen: frozen });
    }
    toString() {
        let str = '[';
        this.die.forEach((thisDie, index) => {
            str += thisDie.value;
            if (index < 4) {
                str += ',';
            }
        });
        return str + ']';
    }
}
