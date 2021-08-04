import { events, topic } from '../globals.js';
import { dice } from './diceGame.js';
export default class RollButton {
    constructor() {
        this.kind = 'rollbutton';
        this.state = { text: '', color: '', enabled: true };
        events.when(topic.ButtonTouched + this.kind, () => {
            dice.roll(null);
            this.updateRollState();
        });
    }
    updateRollState() {
        switch (dice.rollCount) {
            case 1:
                this.state.text = 'Roll Again';
                break;
            case 2:
                this.state.text = 'Last Roll';
                break;
            case 3:
                this.state.enabled = false;
                this.state.text = 'Select Score';
                break;
            default:
                this.state.text = 'Roll Dice';
                dice.rollCount = 0;
        }
        this.update();
    }
    update() {
        events.broadcast(topic.UpdateButton + this.kind, this.state);
    }
}
