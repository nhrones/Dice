import { DiceGame } from './model/diceGame.js';
import { Container, container } from './view/container.js';
import { $, thisPlayer, events, topic } from './globals.js';
thisPlayer.id = '0';
window.addEventListener('DOMContentLoaded', (e) => {
    Container.init($('canvas'), 'snow');
    DiceGame.init();
    container.hydrateUI();
    events.broadcast(topic.PopupResetGame, {});
});
