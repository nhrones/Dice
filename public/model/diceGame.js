import { thisPlayer, events, topic } from '../globals.js';
import PlaySound from '../framework/model/sounds.js';
import Dice from './dice.js';
import Possible from './possible.js';
import ScoreElement from './scoreElement.js';
import RollButton from './rollButton.js';
const snowColor = 'snow';
const grayColor = 'gray';
export let game;
export let dice;
export class DiceGame {
    constructor() {
        this.scoreItems = [];
        this.leftBonus = 0;
        this.fiveOkindBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        dice = Dice.init();
        this.rollButton = new RollButton();
        Possible.init();
        events.when(topic.PopupResetGame, () => {
            this.resetGame();
        });
        events.when(topic.ScoreElementResetTurn, () => {
            if (this.isGameComplete()) {
                this.clearPossibleScores();
                this.setLeftScores();
                this.setRightScores();
                this.showFinalScore(this.getWinner());
            }
            else if (!this.isGameComplete()) {
                this.resetTurn();
            }
        });
        events.when(topic.ViewWasAdded, (view) => {
            if (view.type === 'ScoreButton') {
                this.scoreItems.push(new ScoreElement(view.index, view.name));
            }
        });
    }
    static init() {
        if (!DiceGame._instance) {
            DiceGame._instance = new DiceGame();
            game = DiceGame._instance;
        }
    }
    getWinner() {
        return thisPlayer;
    }
    clearPossibleScores() {
        this.scoreItems.forEach((thisElement) => {
            thisElement.clearPossible();
        });
    }
    evaluatePossibleScores() {
        this.scoreItems.forEach((thisElement) => {
            thisElement.setPossible();
        });
    }
    resetTurn() {
        this.rollButton.state.color = thisPlayer.color;
        this.rollButton.state.enabled = true;
        this.rollButton.state.text = 'Roll Dice';
        this.rollButton.update();
        dice.resetTurn();
        this.clearPossibleScores();
        this.setLeftScores();
        this.setRightScores();
    }
    resetGame() {
        document.title = thisPlayer.playerName;
        events.broadcast(topic.HidePopup, {});
        dice.resetGame();
        this.scoreItems.forEach((thisElement) => {
            thisElement.reset();
        });
        this.updatePlayer(thisPlayer, '');
        this.leftBonus = 0;
        this.fiveOkindBonus = 0;
        this.leftTotal = 0;
        this.rightTotal = 0;
        events.broadcast(topic.UpdateLabel + 'leftscore', { state: 0, color: 'gray', textColor: snowColor, text: '^ total = 0' });
        this.rollButton.state.color = thisPlayer.color;
        this.rollButton.state.text = 'Roll Dice';
        this.rollButton.state.enabled = true;
        this.rollButton.update();
    }
    showFinalScore(winner) {
        let winMsg;
        if (winner.id !== thisPlayer.id) {
            PlaySound.Nooo();
            winMsg = winner.playerName + ' wins!';
        }
        else {
            PlaySound.Woohoo();
            winMsg = 'You won!';
        }
        this.rollButton.state.color = 'black';
        this.rollButton.state.text = winMsg;
        this.rollButton.update();
        events.broadcast(topic.UpdateLabel + 'infolabel', { state: 0, color: 'snow', textColor: 'black', text: winMsg + ' ' + winner.score });
        events.broadcast(topic.ShowPopup, { message: winMsg + ' ' + winner.score });
    }
    isGameComplete() {
        let result = true;
        this.scoreItems.forEach((thisComponent) => {
            if (!thisComponent.owned) {
                result = false;
            }
        });
        return result;
    }
    setLeftScores() {
        this.leftTotal = 0;
        thisPlayer.score = 0;
        let val;
        for (let i = 0; i < 6; i++) {
            val = this.scoreItems[i].finalValue;
            if (val > 0) {
                this.leftTotal += val;
                if (this.scoreItems[i].owned) {
                    this.addScore(val);
                    if (this.scoreItems[i].hasFiveOfaKind && (dice.fiveOfaKindCount > 1)) {
                        this.addScore(100);
                    }
                }
            }
        }
        if (this.leftTotal > 62) {
            let bonusWinner = thisPlayer;
            let highleft = 0;
            if (thisPlayer.score > highleft) {
                highleft = thisPlayer.score;
                bonusWinner = thisPlayer;
            }
            this.addScore(35);
            events.broadcast(topic.UpdateLabel + 'leftscore', {
                state: 0,
                color: bonusWinner.color,
                textColor: snowColor,
                text: `^ total = ${this.leftTotal.toString()} + 35`
            });
        }
        else {
            events.broadcast(topic.UpdateLabel + 'leftscore', {
                state: 0,
                color: grayColor,
                textColor: snowColor,
                text: '^ total = ' + this.leftTotal.toString()
            });
        }
        if (this.leftTotal === 0) {
            events.broadcast(topic.UpdateLabel + 'leftscore', {
                state: 0,
                color: grayColor,
                textColor: snowColor,
                text: '^ total = 0'
            });
        }
    }
    setRightScores() {
        let val;
        let len = this.scoreItems.length;
        for (let i = 6; i < len; i++) {
            val = this.scoreItems[i].finalValue;
            if (val > 0) {
                if (this.scoreItems[i].owned) {
                    this.addScore(val);
                    if (this.scoreItems[i].hasFiveOfaKind
                        && (dice.fiveOfaKindCount > 1)
                        && (i !== Possible.FiveOfaKindIndex)) {
                        this.addScore(100);
                    }
                }
            }
        }
    }
    addScore(value) {
        thisPlayer.score += value;
        this.updatePlayer(thisPlayer, (thisPlayer.score === 0) ? thisPlayer.playerName : thisPlayer.playerName + ' = ' + thisPlayer.score);
    }
    updatePlayer(player, text) {
        events.broadcast(topic.UpdateLabel + 'player' + player.idx, { state: 0, color: 'snow', textColor: player.color, text: text });
    }
}
