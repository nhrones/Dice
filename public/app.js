import { DiceGame } from './model/diceGame.js';
import { Container, container } from './view/container.js';
import { $, thisPlayer, events, topic } from './globals.js';
thisPlayer.id = '0';
window.addEventListener('DOMContentLoaded', (e) => {
    navigator.serviceWorker.register('/public/sw.js').then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
        console.log('ServiceWorker registration failed: ', err);
    });
    Container.init($('canvas'), 'snow');
    DiceGame.init();
    container.hydrateUI();
    events.broadcast(topic.PopupResetGame, {});
});
