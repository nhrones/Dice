
export let DEV = true // true = compile; false = compile if storage not found

export { events, topic } from './framework/model/events.js'

export const $ = (id: string) => document.getElementById(id)

export let thisPlayer = {
    id: "0",
    idx: 0,
    playerName: 'Nick',
    color: 'brown',
    score: 0,
    lastScore: ''
}

export let currentPlayer = {
    id: "0",
    idx: 0,
    playerName: 'Nick',
    color: 'brown',
    score: 0,
    lastScore: ''
}
