
import { DiceGame } from './model/diceGame.js';
import { Container, container } from './view/container.js'
import { $, thisPlayer, events, topic } from './globals.js';

thisPlayer.id = '0'

// wait for it ...
window.addEventListener('DOMContentLoaded', (e) => {
    
    // build our view container
    Container.init($('canvas') as HTMLCanvasElement, 'snow')

    // build the main view-model for a dice game
    DiceGame.init();

    // build the UI from elementDescriptors in localStore   
    container.hydrateUI()
    
    // cleanup and start fresh
    events.broadcast(topic.PopupResetGame, {})
})