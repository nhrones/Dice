
import { thisPlayer, events, topic} from '../globals.js'
import { dice } from './diceGame.js'

/** RollButton viewModel class */
export default class RollButton {

    kind = 'rollbutton'
    state = { text: '', color: '', enabled: true }


    /** Called from DiceGame consrtuctor
     * @param dice {Dice} Dice dependency injection
     */
    constructor() {

        ///////////////////////////////////////////////
        //               bind events                 //
        ///////////////////////////////////////////////

        // when this instance rolls dice
        events.when(topic.ButtonTouched + this.kind, () => {
            dice.roll(null)
            this.updateRollState()
        })

    }

    /** state management for the roll button */
    updateRollState() {
        switch (dice.rollCount) {
            case 1:
                this.state.text = 'Roll Again'
                break
            case 2:
                this.state.text = 'Last Roll'
                break
            case 3:
                this.state.enabled = false
                this.state.text = 'Select Score'
                break
            default:
                this.state.text = 'Roll Dice'
                dice.rollCount = 0
        }
        this.update()
    }

    /** broadcasts an update event with the current state */
    update() {
        events.broadcast(
            topic.UpdateButton + this.kind,
            this.state
        )
    }
}
