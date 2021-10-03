
import { DiceGame } from './model/diceGame.js';
import { Container, container } from './view/container.js'
import { $, thisPlayer, events, topic } from './globals.js';

thisPlayer.id = '0'

// wait for it ...
window.addEventListener('DOMContentLoaded', (e) => {
    navigator.serviceWorker.register('/public/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    // build our view container
    Container.init($('canvas') as HTMLCanvasElement, 'snow')

    // build the main view-model for a dice game
    DiceGame.init();

    // build the UI from elementDescriptors in localStore   
    container.hydrateUI()
    
    // cleanup and start fresh
    events.broadcast(topic.PopupResetGame, {})
})