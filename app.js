import { DiceGame } from './public/model/diceGame.js';
import { Container, container } from './public/view/container.js';
import { $, thisPlayer, events, topic } from './public/globals.js';
thisPlayer.id = '0';
window.addEventListener('DOMContentLoaded', (e) => {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
    });
    Container.init($('canvas'), 'snow');
    DiceGame.init();
    container.hydrateUI();
    events.broadcast(topic.PopupResetGame, {});
});
