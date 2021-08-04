import { currentPlayer, setCurrentPlayer, events, topic } from '../globals.js';
export class Players {
    constructor(game, color) {
        this.game = game;
        this.color = color;
        this.players = new Map();
        this.players.clear();
        this.players.set(currentPlayer.id, {
            id: currentPlayer.id,
            idx: currentPlayer.idx,
            playerName: currentPlayer.playerName,
            color: '#800000',
            score: 0,
            lastScore: ''
        });
    }
    get length() {
        return this.players.size;
    }
    add(id, player) {
        this.players.set(id, player);
    }
    getFromIndex(idx) {
        let id = this.getIdFromIndex(idx);
        return this.players.get(id);
    }
    getIdFromIndex(idx) {
        let keys = Array.from(this.players.keys());
        return keys[idx];
    }
    resetScoreLabels() {
        this.players.forEach((player, index) => {
            this.updatePlayer(player, '');
        });
    }
    resetPlayers() {
        this.players.forEach((player) => {
            player.score = 0;
            this.updatePlayer(player, player.playerName);
        });
        setCurrentPlayer(currentPlayer);
    }
    addScore(player, value) {
        player.score += value;
        this.updatePlayer(player, (player.score === 0) ? player.playerName : player.playerName + ' = ' + player.score);
    }
    clearPlayers() {
        this.players.clear();
        for (let i = 0; i < 4; i++) {
            events.broadcast(topic.UpdateLabel + 'player' + i, { state: 0, color: this.color, textColor: this.color, text: "" });
        }
    }
    updatePlayer(player, text) {
        events.broadcast(topic.UpdateLabel + 'player' + player.idx, { state: 0, color: this.color, textColor: player.color, text: text });
    }
}
