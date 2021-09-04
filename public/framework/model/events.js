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
