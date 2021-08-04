

import { dice } from './diceGame.js'
import PlaySound from '../framework/model/sounds.js'


///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
//         local const for faster resolution        \\
///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Binary masks used to evaluate die sequences
const smallLow = 15 // binary mask that represents a lower valued small-straight (1234)
const smallMid = 30 // binary mask that represents a mid valued small-straight (2345)
const smallHigh = 60 // binary mask that represents a high valued small-straight (3456)
const largeLow = 31 // binary mask that represents a low valued large-straight (12345)
const largeHigh = 62 // binary mask that represents a high valued large-straight (23456)
const binaryFaceValue = [0, 1, 2, 4, 8, 16, 32] // (0=0, 1=1, 2=2, 3=4, 4=8, 5=16, 6=32)
const value = 0     // the index for a die tuple value
const frozen = 1    // the index for a die tuple frozen

/** Singleton DiceEvaluator class ...
 * Evaluates a set of 5 die for the existence of simple 'poker' sets / values. */
export default class DiceEvaluator {

    /** an array that represents the count of the   
     * ocuurance of each possible value of die faces */
    countOfDieFaceValue: number[]

    /** holds the sum of all five die face values */
    sumOfAllDie: number

    /** holds a value that represents the current   
     * sum of all die-face binary values   
     * where the face value(spots) 5 = binary value 16   
     * 1=1, 2=2, 3=4, 4=8, 5=16, 6=32   
     * (used to detect possible poker-straights) */
    straightsMask: number

    // flags ... when set true, indicate a poker value has been detected
    hasPair: boolean
    hasTwoPair: boolean
    hasTrips: boolean
    hasQuads: boolean
    hasFiveOfaKind: boolean
    hasTripsOrBetter: boolean
    hasFullHouse: boolean
    hasSmallStr: boolean
    hasLargeStr: boolean
    hasFullStr: boolean

    /** a private instance of the DiceEvaluator class.   
     * Exposed only by the static DiceEvaluator.init() method */
    private static _instance: DiceEvaluator

    /** private singleton constructor method  
     * called only once, from the static init() method
     * @param dice */
    private constructor() {

        this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0]
        this.sumOfAllDie = 0
        this.straightsMask = 0
        this.hasPair = false
        this.hasTwoPair = false
        this.hasTrips = false
        this.hasQuads = false
        this.hasFiveOfaKind = false
        this.hasTripsOrBetter = false
        this.hasFullHouse = false
        this.hasSmallStr = false
        this.hasLargeStr = false
        this.hasFullStr = false
    }

    /** DiceEvaluator singleton initialization.   
     * Called only once, from the Dice class constructor.
     * @param dice {Dice} Dice dependency injection */
    static init() {
        if (!DiceEvaluator._instance) {
            DiceEvaluator._instance = new DiceEvaluator()
        }
        return DiceEvaluator._instance
    }

    /** Called from Dice.Roll()    
     * Evaluates the values of the die-set,   
     * records the 'count' of Face Values of the 5 die.       
     * sets dice.isFiveOfaKind if FiveOkind is detected */
    evaluateDieValues() {
        this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0]
        this.sumOfAllDie = 0 // set in the loop below
        // get the value of each die and increment the
        // counter that represents that value
        let dieSet = dice.die
        for (let i = 0; i < 5; i++) {
            // get the value of this die
            let val = dieSet[i].value
            // add this value to the sum
            this.sumOfAllDie += val
            if (val > 0) {
                // increment the counter where (array index = value)
                this.countOfDieFaceValue[val] += 1
            }
        }
        // now, we set our binary-mask based on the current die values
        this.setTheStraightsMask()
        // set all scoring flags based on the current values of the die-set
        this.setScoringFlags()
        // if all five die have the same value, set a flag on the dice object 
        dice.isFiveOfaKind = this.testForFiveOfaKind()
    }

    /** Sets all scoring flags based on the current values of the die-set. */
    setScoringFlags() {

        // first we reset all flags
        this.hasPair = false
        this.hasTwoPair = false
        this.hasTrips = false
        this.hasQuads = false
        this.hasFiveOfaKind = false
        this.hasTripsOrBetter = false
        this.hasFullHouse = false
        this.hasSmallStr = false
        this.hasLargeStr = false
        this.hasFullStr = false

        for (let i = 0; i < 7; i++) {
            if (this.countOfDieFaceValue[i] === 5) {
                this.hasFiveOfaKind = true
                this.hasTripsOrBetter = true
            }
            if (this.countOfDieFaceValue[i] === 4) {
                this.hasQuads = true
                this.hasTripsOrBetter = true
            }
            if (this.countOfDieFaceValue[i] === 3) {
                this.hasTrips = true
                this.hasTripsOrBetter = true
            }
            if (this.countOfDieFaceValue[i] === 2) {
                if (this.hasPair) {
                    this.hasTwoPair = true
                }
                this.hasPair = true
            }
        }

        // after evaluating sets of numbers, we use logical AND (&&)   
        // on flags for both 3-O-kind and a pair (a poker full-house)
        this.hasFullHouse = (this.hasTrips && this.hasPair)

        // set a shortened reference to our mask      
        let mask = this.straightsMask

        // Now, we use binary AND (&) to detect value sequences.   
        // We 'and' the dice binary value with a known binary mask, 
        // and then compare the resulting value to that masks value.

        // first, any large straights?
        this.hasLargeStr = ((mask & largeLow) === largeLow ||
            (mask & largeHigh) === largeHigh)

        // again, binary masking to discover any small straights    
        this.hasSmallStr = ((mask & smallLow) === smallLow ||
            (mask & smallMid) === smallMid ||
            (mask & smallHigh) === smallHigh)
    }

    /** Tests if all 5 die values are the same. */
    testForFiveOfaKind() {
        // did we see 5 of the same?
        if (this.hasFiveOfaKind) {
            // has fiveOkind been sacrificed by any user?
            if (dice.fiveOfaKindWasSacrificed) {
                // Homer Simpsons says 'Dohh'
                PlaySound.Dohh()
            }
            else {
                // Homer Simpsons says 'Woo Hoo'
                PlaySound.Woohoo()
            }
            return true
        }
        return false
    }

    /** Sets a binary mask for evaluating for straights sequences. */
    setTheStraightsMask() {

        // get the current die values
        let die = dice.die

        // reset our mask
        this.straightsMask = 0

        // for each posible die value ( 1 thru 6 )   
        // if any of the 5 die has this value, 
        // add the binary-weight of this value to our mask
        for (let thisValue = 1; thisValue <= 6; thisValue++) {
            if (die[0].value === thisValue ||
                die[1].value === thisValue ||
                die[2].value === thisValue ||
                die[3].value === thisValue ||
                die[4].value === thisValue) {
                this.straightsMask += binaryFaceValue[thisValue]
            }
        }
    }

    /** Tests for pairs, triplets, ...   
     * thisManySets parameter is used to evaluate for two-pair
     * @param multipleSize {number} how many of each number
     * @param thisManySets {number} how many sets of above
     */
    testForMultiples(multipleSize: number, thisManySets: number) {
        let count = 0
        let hits = 0
        let sum = 0
        for (let dieValue = 6; dieValue >= 1; dieValue--) {
            count = this.countOfDieFaceValue[dieValue]
            if (count >= multipleSize) {
                hits += 1
                sum += (multipleSize * dieValue)
                if (hits === thisManySets) {
                    return sum
                }
            }
        }
        return 0
    }
}
