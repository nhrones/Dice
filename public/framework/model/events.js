class EventsSingleton {
    constructor() {
        this.topicSubscriptions = new Map();
    }
    static getInstance() {
        if (!EventsSingleton._instance) {
            EventsSingleton._instance = new EventsSingleton();
        }
        return EventsSingleton._instance;
    }
    when(topic, callback) {
        return this._registerListener(topic, callback, false);
    }
    once(topic, callback) {
        return this._registerListener(topic, callback, true);
    }
    _registerListener(topic, callback, once) {
        if (!this.topicSubscriptions.has(topic)) {
            this.topicSubscriptions.set(topic, []);
        }
        let subscriptions = this.topicSubscriptions.get(topic);
        let index = subscriptions.length;
        subscriptions.push({
            callback: callback,
            onlyOnce: once
        });
        return {
            remove: () => {
                delete subscriptions[index];
                if (subscriptions.length < 1) {
                    this.topicSubscriptions.delete(topic);
                }
            }
        };
    }
    broadcast(topic, payload) {
        if (this.topicSubscriptions.has(topic)) {
            this._dispatch(this.topicSubscriptions.get(topic), payload);
        }
    }
    _dispatch(subscriptions, payload) {
        if (subscriptions) {
            subscriptions.forEach((subscription, index) => {
                subscription.callback((payload != undefined) ? payload : {});
                if (subscription.onlyOnce) {
                    delete subscriptions[index];
                }
            });
        }
    }
    reset() {
        this.topicSubscriptions.clear();
    }
    removeTopic(topic) {
        this.topicSubscriptions.delete(topic);
    }
}
export const events = EventsSingleton.getInstance();
export const topic = {
    ButtonTouched: 'ButtonTouched',
    CancelEdits: 'CancelEdits',
    DieTouched: 'DieTouched',
    HidePopup: 'HidePopup',
    PlayerNameUpdate: 'PlayerNameUpdate',
    PopupResetGame: 'PopupResetGame',
    ScoreButtonTouched: 'ScoreButtonTouched',
    ScoreElementResetTurn: 'ScoreElementResetTurn',
    ShowPopup: 'ShowPopup',
    UpdateButton: 'UpdateButton',
    UpdateDie: 'UpdateDie',
    UpdateLabel: 'UpdateLabel',
    UpdateScoreElement: 'UpdateScoreElement',
    UpdateTooltip: 'UpdateTooltip',
    ViewWasAdded: 'ViewWasAdded'
};
const TopicBindings = {
    ButtonTouched: {
        topic: topic.ButtonTouched + 'this.name',
        broadcast: {
            file: 'button.ts',
            calledAt: 'Button.touched()',
            line: 71
        },
        payload: {},
        when: {
            file: 'rollbutton.ts',
            subscribedAt: 'RollButton.ctor',
            line: 22
        }
    },
    CancelEdits: {
        topic: topic.CancelEdits,
        broadcast: {
            file: 'domEventHandlers.ts',
            calledAt: 'handleClickOrTouch',
            line: 133
        },
        payload: {},
        when: {
            file: 'textInput.ts',
            subscribedAt: 'TextInput.ctor',
            line: 42
        }
    },
    DieTouched: {
        topic: topic.DieTouched,
        broadcast: { file: 'die.ts', line: 52 },
        payload: { index: 0 },
        when: { file: 'dice.ts', line: 51 }
    },
    HidePopup: {
        topic: topic.HidePopup,
        broadcast: { file: 'diceGame.ts', line: 152 },
        payload: {},
        when: { file: 'popup.ts', line: 57 }
    },
    PopupResetGame: {
        topic: topic.PopupResetGame,
        broadcast: { file: 'popup.ts', line: 106 },
        payload: {},
        when: { file: 'diceGame.ts', line: 76 }
    },
    ScoreButtonTouched: {
        topic: topic.ScoreButtonTouched + 'index',
        broadcast: { file: 'scoreButton.ts', line: 81 },
        payload: {},
        when: { file: 'scoreElement.ts', line: 50 }
    },
    ScoreElementResetTurn: {
        topic: topic.ScoreElementResetTurn,
        broadcast: { file: 'scoreElement.ts', line: 55 },
        payload: {},
        when: { file: 'diceGame.ts', line: 80 }
    },
    ShowPopup: {
        topic: topic.ShowPopup,
        broadcast: { file: 'diceGame.ts', line: 193 },
        payload: { message: 'string' },
        when: { file: 'popup.ts', line: 48 }
    },
    UpdateButton: {
        topic: topic.UpdateButton + 'this.id',
        broadcast: { file: 'rollbutton.ts', line: 61 },
        payload: { text: 'string', color: 'string', enabled: true },
        when: { file: 'button.ts', line: 54 }
    },
    UpdateDie: {
        topic: topic.UpdateDie + 'this.index',
        broadcast: { file: 'dice.ts', line: 135 },
        payload: { color: 'string', textColor: 'string', text: 'string' },
        when: { file: 'die.ts', line: 43 }
    },
    UpdateLabel: {
        topic: topic.UpdateLabel + 'this.id',
        broadcast: [
            { file: 'diceGame.ts', line: 166 },
            { file: 'diceGame.ts', line: 190 },
            { file: 'diceGame.ts', line: 243 },
            { file: 'diceGame.ts', line: 253 },
            { file: 'diceGame.ts', line: 263 },
            { file: 'players.ts', line: 161 },
            { file: 'scoreElement.ts', line: 68 }
        ],
        payload: { color: 'black', textColor: 'white', text: 'string' },
        when: { file: 'label.ts', line: 44 }
    },
    UpdateScoreElement: {
        topic: topic.UpdateScoreElement + 'this.index',
        broadcast: [
            { file: 'scoreElement.ts', line: 89 },
            { file: 'scoreElement.ts', line: 102 }
        ],
        payload: { renderAll: true, color: 'black', valueString: '25', available: true },
        when: { file: 'scoreButton.ts', line: 57 }
    },
};
