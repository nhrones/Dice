import { currentPlayer, thisPlayer, events, topic } from '../globals.js';
import PlaySound from '../framework/model/sounds.js';
import { dice } from './diceGame.js';
import Possible from './possible.js';
const SmallStraight = 8;
const LargeStraight = 9;
const FullHouse = 10;
const emptyString = '';
const black = 'black';
const infolabel = 'infolabel';
const snow = 'snow';
export default class ScoreElement {
    constructor(index, name) {
        this.hasFiveOfaKind = false;
        this.available = false;
        this.owned = false;
        this.index = index;
        this.name = name;
        this.finalValue = 0;
        this.possibleValue = 0;
        this.scoringDieset = [0, 0, 0, 0, 0];
        events.when(topic.ScoreButtonTouched + this.index, () => {
            this.clicked();
            events.broadcast(topic.ScoreElementResetTurn, {});
        });
        events.when(topic.UpdateTooltip + this.index, (data) => {
            let msg = '';
            let thisState = 0;
            if (data.hovered) {
                if (this.owned) {
                    thisState = 2;
                    msg = `${thisPlayer.playerName} owns ${this.name} with ${this.scoringDieset.toString()}`;
                }
                else {
                    thisState = 1;
                    msg = `${this.name}`;
                }
            }
            else {
                thisState = 3;
                msg = '';
            }
            events.broadcast(topic.UpdateLabel + infolabel, { state: thisState,
                color: snow,
                textColor: black,
                text: msg
            });
        });
    }
    updateInfo(text) {
        events.broadcast(topic.UpdateLabel + infolabel, { state: 0, color: snow, textColor: black, text: text });
    }
    setOwned(value) {
        this.owned = value;
        if (this.owned) {
            this.updateScoreElement(thisPlayer.color, this.possibleValue.toString());
        }
        else {
            this.updateScoreElement(black, emptyString);
        }
    }
    renderValue(value) {
        events.broadcast(topic.UpdateScoreElement + this.index, {
            renderAll: false,
            color: '',
            valueString: value,
            available: this.available
        });
    }
    updateScoreElement(color, value) {
        events.broadcast(topic.UpdateScoreElement + this.index, {
            renderAll: true,
            color: color,
            valueString: value,
            available: this.available
        });
    }
    setAvailable(value) {
        this.available = value;
        if (this.available) {
            if (this.possibleValue > 0) {
                this.renderValue(this.possibleValue.toString());
            }
        }
        else {
            if (this.owned) {
                this.renderValue(this.possibleValue.toString());
            }
            this.renderValue(this.possibleValue.toString());
        }
    }
    clicked() {
        if (dice.toString() === '[0,0,0,0,0]')
            return false;
        let scoreTaken = false;
        if (!this.owned) {
            if (this.possibleValue === 0) {
                currentPlayer.lastScore = `sacrificed ${this.name} ${dice.toString()}`;
                this.updateInfo(`${currentPlayer.playerName} ${currentPlayer.lastScore}`);
            }
            else {
                let wasItYou = currentPlayer.id === thisPlayer.id;
                let wasTaken = (wasItYou) ? 'choose' : 'took';
                currentPlayer.lastScore = `${wasTaken} ${this.name} ${dice.toString()}`;
                this.updateInfo(`${(wasItYou) ? 'You' : currentPlayer.playerName} ${currentPlayer.lastScore}`);
            }
            if (this.index === Possible.FiveOfaKindIndex) {
                if (dice.isFiveOfaKind) {
                    dice.fiveOfaKindBonusAllowed = true;
                    PlaySound.Heehee();
                }
                else {
                    dice.fiveOfaKindWasSacrificed = true;
                    PlaySound.Dohh();
                }
            }
            this.setValue();
            scoreTaken = true;
        }
        else if (this.available) {
            currentPlayer.lastScore = `stole ${this.name} ${dice.toString()} was: ${this.scoringDieset.toString()}`;
            this.updateInfo(`${currentPlayer.playerName} ${currentPlayer.lastScore}`);
            this.setOwned(false);
            PlaySound.Heehee();
            this.setValue();
            scoreTaken = true;
        }
        return scoreTaken;
    }
    setValue() {
        this.setOwned(true);
        let thisValue = this.possibleValue;
        this.finalValue = thisValue;
        this.scoringDiesetSum = 0;
        this.scoringDieset.forEach((die, index) => {
            this.scoringDieset[index] = dice.die[index].value;
            this.scoringDiesetSum += dice.die[index].value;
        });
        if (dice.isFiveOfaKind) {
            if (dice.fiveOfaKindBonusAllowed) {
                dice.fiveOfaKindCount += 1;
                if (this.index !== Possible.FiveOfaKindIndex) {
                    this.finalValue += 100;
                }
                this.hasFiveOfaKind = true;
                PlaySound.Heehee();
            }
            else {
                this.hasFiveOfaKind = false;
                PlaySound.Cluck();
            }
        }
        else {
            this.hasFiveOfaKind = false;
            if (thisValue === 0) {
                PlaySound.Dohh();
            }
            else {
                PlaySound.Cluck();
            }
        }
    }
    setPossible() {
        this.possibleValue = Possible.Instance().evaluate(this.index);
        if (!this.owned) {
            if (this.possibleValue === 0) {
                this.renderValue(emptyString);
            }
            else {
                this.renderValue(this.possibleValue.toString());
            }
            this.setAvailable(true);
        }
        else if (currentPlayer === thisPlayer) {
            if (this.possibleValue > this.finalValue) {
                if (!this.hasFiveOfaKind) {
                    this.setAvailable(true);
                    this.renderValue(this.possibleValue.toString());
                }
            }
            else if ((this.index === SmallStraight || this.index === LargeStraight) &&
                (this.possibleValue === this.finalValue) &&
                (this.scoringDiesetSum < dice.sum)) {
                this.setAvailable(true);
                this.renderValue(this.possibleValue.toString());
            }
            else if ((this.index === FullHouse) &&
                (this.possibleValue === this.finalValue) &&
                (this.scoringDiesetSum < dice.sum)) {
                this.setAvailable(true);
                this.renderValue(this.possibleValue.toString());
            }
        }
    }
    reset() {
        this.setOwned(false);
        this.finalValue = 0;
        this.possibleValue = 0;
        this.updateScoreElement(black, emptyString);
        this.hasFiveOfaKind = false;
    }
    clearPossible() {
        this.possibleValue = 0;
        this.setAvailable(false);
        if (!this.owned) {
            this.finalValue = 0;
            this.renderValue(emptyString);
        }
        else {
            this.renderValue(this.finalValue.toString());
        }
    }
}
