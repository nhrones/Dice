

import { dice } from './diceGame.js'
import DiceEvauator from './diceEvaluator.js'

const ThreeOfaKind: number = 6
const FourOfaKind: number = 7
const SmallStraight: number = 8
const LargeStraight: number = 9
const House: number = 10
const FiveOfaKind: number = 11
const Chance: number = 12

///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//          aliases for faster resolution           \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

let evaluator: DiceEvauator


/** A class that produces a singleton object that    
 * evaluates a possible score for each ScoreElement    
 * based on the current values of the dice set */
export default class Possible {

    /** a private instance of the Possible class.
     * Exposed only by the Possible.init() method */
    private static _instance: Possible

    /** the index value of the Five of a kind scoreElement */
    public static FiveOfaKindIndex: number = FiveOfaKind

    /** private singleton constructor ... called only from init() */
    private constructor() {
    }

    /** singleton initialization called from DiceGame constructor */
    static init() {
        if (!Possible._instance) {
            Possible._instance = new Possible()
            evaluator = dice.evaluator
        }
        return Possible._instance
    }

    /** Singleton instance access. Shared by all ScoreElements.setPossible() methods */
    public static Instance() {
        if (Possible._instance) {
            return Possible._instance
        } else {
            throw new Error('must always init first!')
        }
    }

    /** evaluates the possible value of a scoreElement */
    evaluate(id: number) {
        return (id < 6) ? this.evaluateNumbers(id) : this.evaluateCommon(id)
    }

    /** evaluate for common poker scores */
    evaluateCommon(id: number) {
        if (id === FiveOfaKind) {
            return (evaluator.hasFiveOfaKind) ? 50 : 0
        }
        else if (id === SmallStraight) {
            return (evaluator.hasSmallStr) ? 30 : 0
        }
        else if (id === LargeStraight) {
            return (evaluator.hasLargeStr) ? 40 : 0
        }
        else if (id === House) {
            return (evaluator.hasFullHouse) ? 25 : 0
        }
        else if (id === FourOfaKind) {
            return (evaluator.hasQuads || evaluator.hasFiveOfaKind) ? 
            evaluator.sumOfAllDie : 0
        }
        else if (id === ThreeOfaKind) {
            return (evaluator.hasTrips || evaluator.hasQuads || evaluator.hasFiveOfaKind) ?
            evaluator.sumOfAllDie : 0
        }
        else if (id === Chance) {
            return evaluator.sumOfAllDie
        }
        else {
            return 0
        }
    }

    /** evaluates for the number of dice with this face value */
    evaluateNumbers(id: number) {
        let hits = 0
        let target = id + 1
        for (let i = 0; i < 5; i++) {
            let val = (dice.die[i]).value
            if (val === target) {
                hits += 1
            }
        }
        return target * hits
    }
}
