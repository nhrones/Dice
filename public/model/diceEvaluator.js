import { dice } from './diceGame.js';
import PlaySound from '../framework/model/sounds.js';
const smallLow = 15;
const smallMid = 30;
const smallHigh = 60;
const largeLow = 31;
const largeHigh = 62;
const binaryFaceValue = [0, 1, 2, 4, 8, 16, 32];
const value = 0;
const frozen = 1;
export default class DiceEvaluator {
    constructor() {
        this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0];
        this.sumOfAllDie = 0;
        this.straightsMask = 0;
        this.hasPair = false;
        this.hasTwoPair = false;
        this.hasTrips = false;
        this.hasQuads = false;
        this.hasFiveOfaKind = false;
        this.hasTripsOrBetter = false;
        this.hasFullHouse = false;
        this.hasSmallStr = false;
        this.hasLargeStr = false;
        this.hasFullStr = false;
    }
    static init() {
        if (!DiceEvaluator._instance) {
            DiceEvaluator._instance = new DiceEvaluator();
        }
        return DiceEvaluator._instance;
    }
    evaluateDieValues() {
        this.countOfDieFaceValue = [0, 0, 0, 0, 0, 0, 0];
        this.sumOfAllDie = 0;
        let dieSet = dice.die;
        for (let i = 0; i < 5; i++) {
            let val = dieSet[i].value;
            this.sumOfAllDie += val;
            if (val > 0) {
                this.countOfDieFaceValue[val] += 1;
            }
        }
        this.setTheStraightsMask();
        this.setScoringFlags();
        dice.isFiveOfaKind = this.testForFiveOfaKind();
    }
    setScoringFlags() {
        this.hasPair = false;
        this.hasTwoPair = false;
        this.hasTrips = false;
        this.hasQuads = false;
        this.hasFiveOfaKind = false;
        this.hasTripsOrBetter = false;
        this.hasFullHouse = false;
        this.hasSmallStr = false;
        this.hasLargeStr = false;
        this.hasFullStr = false;
        for (let i = 0; i < 7; i++) {
            if (this.countOfDieFaceValue[i] === 5) {
                this.hasFiveOfaKind = true;
                this.hasTripsOrBetter = true;
            }
            if (this.countOfDieFaceValue[i] === 4) {
                this.hasQuads = true;
                this.hasTripsOrBetter = true;
            }
            if (this.countOfDieFaceValue[i] === 3) {
                this.hasTrips = true;
                this.hasTripsOrBetter = true;
            }
            if (this.countOfDieFaceValue[i] === 2) {
                if (this.hasPair) {
                    this.hasTwoPair = true;
                }
                this.hasPair = true;
            }
        }
        this.hasFullHouse = (this.hasTrips && this.hasPair);
        let mask = this.straightsMask;
        this.hasLargeStr = ((mask & largeLow) === largeLow ||
            (mask & largeHigh) === largeHigh);
        this.hasSmallStr = ((mask & smallLow) === smallLow ||
            (mask & smallMid) === smallMid ||
            (mask & smallHigh) === smallHigh);
    }
    testForFiveOfaKind() {
        if (this.hasFiveOfaKind) {
            if (dice.fiveOfaKindWasSacrificed) {
                PlaySound.Dohh();
            }
            else {
                PlaySound.Woohoo();
            }
            return true;
        }
        return false;
    }
    setTheStraightsMask() {
        let die = dice.die;
        this.straightsMask = 0;
        for (let thisValue = 1; thisValue <= 6; thisValue++) {
            if (die[0].value === thisValue ||
                die[1].value === thisValue ||
                die[2].value === thisValue ||
                die[3].value === thisValue ||
                die[4].value === thisValue) {
                this.straightsMask += binaryFaceValue[thisValue];
            }
        }
    }
    testForMultiples(multipleSize, thisManySets) {
        let count = 0;
        let hits = 0;
        let sum = 0;
        for (let dieValue = 6; dieValue >= 1; dieValue--) {
            count = this.countOfDieFaceValue[dieValue];
            if (count >= multipleSize) {
                hits += 1;
                sum += (multipleSize * dieValue);
                if (hits === thisManySets) {
                    return sum;
                }
            }
        }
        return 0;
    }
}
