
import {thisPlayer, events, topic  } from '../globals.js'
import PlaySound from '../framework/model/sounds.js'
import DiceEvaluator from './diceEvaluator.js'
import { game } from './diceGame.js'

/** Singleton Dice viewModel class.    
 * Represents a set of Die.    
 * A diceGame can have only a single set of dice. */
export default class Dice {

    rollCount: number
    dieSize: number
    isFiveOfaKind: boolean
    fiveOfaKindCount: number
    fiveOfaKindBonusAllowed: boolean
    fiveOfaKindWasSacrificed: boolean
    evaluator: DiceEvaluator
    die: iDie[]
    sum: number
    
    /** a private instance of the Dice class.
     * Exposed only by the Dice.init() method */
    private static _instance: Dice

    /** private singleton constructor ... called only from init() */
    private constructor() {
        this.rollCount = 0
        this.dieSize = 72
        this.isFiveOfaKind = false
        this.fiveOfaKindCount = 0
        this.fiveOfaKindBonusAllowed = false
        this.fiveOfaKindWasSacrificed = false
        this.evaluator = DiceEvaluator.init()

        //the 5 iDie objects
        this.die = [
            {value: 0, frozen: false},
            {value: 0, frozen: false},
            {value: 0, frozen: false},
            {value: 0, frozen: false},
            {value: 0, frozen: false}
        ]
        this.sum = 0
        ///////////////////////////////////////////////
        //               bind events                 //
        ///////////////////////////////////////////////

        // registers a callback function for the DieTouched event
        events.when(topic.DieTouched, (payload: { index: number }) => {
            let thisDie = this.die[payload.index]
            if (thisDie.value > 0) {
                thisDie.frozen = !thisDie.frozen
                this.updateView(payload.index, thisDie.value, thisDie.frozen)
                PlaySound.Select()
            }
        })
    }

    /** Dice singleton initialization.  Called from DiceGame constructor */
    static init() {
        if (!Dice._instance) {
            Dice._instance = new Dice()
        }
        return Dice._instance
    }

    /** Resets Dice at the end of a players turn. */
    resetTurn() {
        this.die.forEach((thisDie: iDie, index: number) => {
            thisDie.frozen = false
            thisDie.value = 0
            this.updateView(index, 0, false)
        })
        this.rollCount = 0
        this.sum = 0
    }

    /** Resets this viewModel for a new game-play */
    resetGame() {
        this.resetTurn()
        this.isFiveOfaKind = false
        this.fiveOfaKindCount = 0
        this.fiveOfaKindBonusAllowed = false
        this.fiveOfaKindWasSacrificed = false
    }

    /** roll the dice ...
     * @param dieValues {number[] | null} 
     *      If 'local-roll', dieValues parameter will be null.
     *      Otherwise, dieValues parameter will be the values
     *      from another players roll.
     */
    roll(dieValues: number[] | null) {
        PlaySound.Roll()
        this.sum = 0
        this.die.forEach((thisDie: iDie, index: number) => {
            if (dieValues === null) {
                if (!thisDie.frozen) {
                    thisDie.value = Math.floor(Math.random() * 6) + 1
                    this.updateView(index, thisDie.value, thisDie.frozen)
                }
            }
            else {
                if (!thisDie.frozen) {
                    thisDie.value = dieValues[index]
                    this.updateView(index, thisDie.value, thisDie.frozen)
                }
            }
            this.sum += thisDie.value
        })
        this.rollCount += 1
        this.evaluator.evaluateDieValues() 
        game.evaluatePossibleScores()

    }

    /** broadcasts an event to trigger a 'view' update
     * @param index {number} the index of the Die view to update
     * @param value {number} the die value to show in the view
     * @param frozen {boolean} the frozen state of this die
     */
    updateView(index: number, value: number, frozen: boolean) {
        events.broadcast(topic.UpdateDie + index, { value: value, frozen: frozen })
    }

    /** returns the set of die values as a formatted string */
    toString() {
        let str = '['
        this.die.forEach((thisDie: iDie, index: number) => {
            str += thisDie.value
            if (index < 4) {
                str += ','
            }
        })
        return str + ']'
    }
}

interface iDie {
    value: number
    frozen: boolean
}
