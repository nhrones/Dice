
import { thisPlayer, events, topic } from '../globals.js'
import PlaySound from '../framework/model/sounds.js'
import Dice from './dice.js'
import Possible from './possible.js'
import ScoreElement from './scoreElement.js'
import RollButton from './rollButton.js'

///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//         local const for faster resolution        \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

const snowColor = 'snow'
const grayColor = 'gray'


///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//      exported aliases for faster resolution      \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

export let game: DiceGame
export let dice: Dice

/** Singleton DiceGame class 
 * This is the main view-model for this dice game */
export class DiceGame {

    scoreItems: ScoreElement[]
    leftBonus: number
    fiveOkindBonus: number
    leftTotal: number
    rightTotal: number
    rollButton: RollButton

    /** a private instance of the DiceGame class.
     * Exposed only by the DiceGame.init() method */
    private static _instance: DiceGame

    /** DiceGame singleton initialization.
     * Called from DOMContentLoaded event handler (app.ts)
     * @param canvas {HTMLCanvasElement} Canvas dependency injection
     */
    static init() {
        if (!DiceGame._instance) {
            DiceGame._instance = new DiceGame()
            game = DiceGame._instance
        }
    }

    /** private singleton constructor ... called only from init()
     * @param game
     */
    private constructor() {

        this.scoreItems = []
        this.leftBonus = 0
        this.fiveOkindBonus = 0
        this.leftTotal = 0
        this.rightTotal = 0
        dice = Dice.init()
        this.rollButton = new RollButton()
        Possible.init()

        ///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                       bind events                          \\
        ///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        events.when(topic.PopupResetGame, () => {
            this.resetGame()
        })

        events.when(topic.ScoreElementResetTurn, () => {
            if (this.isGameComplete()) {
                this.clearPossibleScores()
                this.setLeftScores()
                this.setRightScores()
                this.showFinalScore(this.getWinner())
            } else if (!this.isGameComplete()) {
                this.resetTurn()
            }
        })

        events.when(topic.ViewWasAdded, (view: { type: string, index: number, name: string }) => {
            if (view.type === 'ScoreButton') {
                this.scoreItems.push(new ScoreElement(view.index, view.name))
            }
        })
    }

    /** check score total and determin the winner of this game */
    getWinner() {
        return thisPlayer
    }

    /** clear all scoreElements possible score value */
    clearPossibleScores() {
        this.scoreItems.forEach((thisElement: any) => {
            thisElement.clearPossible()
        })
    }

    /** evaluates the dice and then sets a possible score value for each scoreelements */
    evaluatePossibleScores() {
        this.scoreItems.forEach((thisElement: ScoreElement) => {
            thisElement.setPossible()
        })
    }

    /** resets the turn by resetting values and state */
    resetTurn() {
        this.rollButton.state.color = thisPlayer.color
        this.rollButton.state.enabled = true
        this.rollButton.state.text = 'Roll Dice'
        this.rollButton.update()
        dice.resetTurn()
        this.clearPossibleScores()
        this.setLeftScores()
        this.setRightScores()
    }

    /** resets game state to start a new game */
    resetGame() {
        document.title = thisPlayer.playerName
        events.broadcast(topic.HidePopup, {})
        dice.resetGame()
        this.scoreItems.forEach((thisElement: ScoreElement) => {
            thisElement.reset()
        })
        // clear the view
        this.updatePlayer(thisPlayer, '');
        this.leftBonus = 0
        this.fiveOkindBonus = 0
        this.leftTotal = 0
        this.rightTotal = 0
        events.broadcast(
            topic.UpdateLabel + 'leftscore',
            { state: 0, color: 'gray', textColor: snowColor, text: '^ total = 0' }
        )

        this.rollButton.state.color = thisPlayer.color
        this.rollButton.state.text = 'Roll Dice'
        this.rollButton.state.enabled = true
        this.rollButton.update()
    }

    /** show a popup with winner and final score */
    showFinalScore(winner: any) {
        let winMsg
        if (winner.id !== thisPlayer.id) {
            PlaySound.Nooo()
            winMsg = winner.playerName + ' wins!'
        }
        else {
            PlaySound.Woohoo()
            winMsg = 'You won!'
        }
        this.rollButton.state.color = 'black'
        this.rollButton.state.text = winMsg
        this.rollButton.update()
        events.broadcast(topic.UpdateLabel + 'infolabel',
            { state: 0, color: 'snow', textColor: 'black', text: winMsg + ' ' + winner.score }
        )
        events.broadcast(topic.ShowPopup,
            { message: winMsg + ' ' + winner.score }
        )
        // webSocket.broadcast( socketTopic.ShowPopup,
        //     { message: winner.playerName + ' wins!' + ' ' + winner.score }
        // )
    }

    /** check all scoreElements to see if game is complete */
    isGameComplete() {
        let result = true
        this.scoreItems.forEach((thisComponent: any) => {
            if (!thisComponent.owned) {
                result = false
            }
        })
        return result
    }

    /** sum and show left scoreElements total value */
    setLeftScores() {
        this.leftTotal = 0
        thisPlayer.score = 0

        let val
        for (let i = 0; i < 6; i++) {
            val = this.scoreItems[i].finalValue
            if (val > 0) {
                this.leftTotal += val
                if (this.scoreItems[i].owned) {
                    this.addScore(val)
                    if (this.scoreItems[i].hasFiveOfaKind && (dice.fiveOfaKindCount > 1)) {
                        this.addScore(100)
                    }
                }
            }
        }
        if (this.leftTotal > 62) {
            let bonusWinner = thisPlayer
            let highleft = 0

            if (thisPlayer.score > highleft) {
                highleft = thisPlayer.score
                bonusWinner = thisPlayer
            }

            this.addScore(35)
            events.broadcast(
                topic.UpdateLabel + 'leftscore',
                {
                    state: 0,
                    color: bonusWinner.color,
                    textColor: snowColor,
                    text: `^ total = ${this.leftTotal.toString()} + 35`
                }
            )
        }
        else {
            events.broadcast(
                topic.UpdateLabel + 'leftscore',
                {
                    state: 0,
                    color: grayColor,
                    textColor: snowColor,
                    text: '^ total = ' + this.leftTotal.toString()
                }
            )
        }
        if (this.leftTotal === 0) {
            events.broadcast(
                topic.UpdateLabel + 'leftscore',
                {
                    state: 0,
                    color: grayColor,
                    textColor: snowColor,
                    text: '^ total = 0'
                }
            )
        }
    }

    /** sum the values of the right scoreElements */
    setRightScores() {
        let val
        let len = this.scoreItems.length
        for (let i = 6; i < len; i++) {
            val = this.scoreItems[i].finalValue
            if (val > 0) {
                if (this.scoreItems[i].owned) {
                    this.addScore(val)
                    if (this.scoreItems[i].hasFiveOfaKind
                        && (dice.fiveOfaKindCount > 1)
                        && (i !== Possible.FiveOfaKindIndex)
                    ) {
                        this.addScore(100)
                    }
                }
            }
        }
    }

    addScore(value: number) {
        thisPlayer.score += value;
        this.updatePlayer(thisPlayer, (thisPlayer.score === 0) ? thisPlayer.playerName : thisPlayer.playerName + ' = ' + thisPlayer.score);
    }
    updatePlayer(player: any, text: string) {
        events.broadcast(topic.UpdateLabel + 'player' + player.idx, { state: 0, color: 'snow', textColor: player.color, text: text });
    }
}
