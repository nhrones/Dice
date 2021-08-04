import { dice } from './diceGame.js';
const ThreeOfaKind = 6;
const FourOfaKind = 7;
const SmallStraight = 8;
const LargeStraight = 9;
const House = 10;
const FiveOfaKind = 11;
const Chance = 12;
let evaluator;
export default class Possible {
    constructor() {
    }
    static init() {
        if (!Possible._instance) {
            Possible._instance = new Possible();
            evaluator = dice.evaluator;
        }
        return Possible._instance;
    }
    static Instance() {
        if (Possible._instance) {
            return Possible._instance;
        }
        else {
            throw new Error('must always init first!');
        }
    }
    evaluate(id) {
        return (id < 6) ? this.evaluateNumbers(id) : this.evaluateCommon(id);
    }
    evaluateCommon(id) {
        if (id === FiveOfaKind) {
            return (evaluator.hasFiveOfaKind) ? 50 : 0;
        }
        else if (id === SmallStraight) {
            return (evaluator.hasSmallStr) ? 30 : 0;
        }
        else if (id === LargeStraight) {
            return (evaluator.hasLargeStr) ? 40 : 0;
        }
        else if (id === House) {
            return (evaluator.hasFullHouse) ? 25 : 0;
        }
        else if (id === FourOfaKind) {
            return (evaluator.hasQuads || evaluator.hasFiveOfaKind) ?
                evaluator.sumOfAllDie : 0;
        }
        else if (id === ThreeOfaKind) {
            return (evaluator.hasTrips || evaluator.hasQuads || evaluator.hasFiveOfaKind) ?
                evaluator.sumOfAllDie : 0;
        }
        else if (id === Chance) {
            return evaluator.sumOfAllDie;
        }
        else {
            return 0;
        }
    }
    evaluateNumbers(id) {
        let hits = 0;
        let target = id + 1;
        for (let i = 0; i < 5; i++) {
            let val = (dice.die[i]).value;
            if (val === target) {
                hits += 1;
            }
        }
        return target * hits;
    }
}
Possible.FiveOfaKindIndex = FiveOfaKind;
