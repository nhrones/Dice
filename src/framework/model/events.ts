
////////////////////////////////////////////////////////
//              Singleton Events Class                //
////////////////////////////////////////////////////////

type subscriptionObject = {
    callback: Function,
    onlyOnce: boolean
}

/** A singleton Events class */
class EventsSingleton {

    private topicSubscriptions: Map<string, subscriptionObject[]> = new Map()
    private static _instance: EventsSingleton
    private constructor() { }

    // singleton construction and accessor
    static getInstance() {
        if (!EventsSingleton._instance) {
            EventsSingleton._instance = new EventsSingleton()
        }
        return EventsSingleton._instance
    }

    /** registers a callback function to be executed when a topic is published
     *	e.g.: Events.when(topic.GameOver, Game.resetGame)
     *   .. returns an object containing a 'remove' function
     *	@param topic {string} the topic of interest
     *	@param callback {function} a callback function
     *	@returns remove {object} returns an object containing a 'remove' function
     */
    when(topic: string, callback: Function): { remove: any } {
        return this._registerListener(topic, callback, false)
    }

    /** Events.once
     *  registers a callback function to be executed only 'once', when a topic is published
     *	e.g.: Events.once(topic.GameOver, Game.resetGame)
     *   ... returns an object containing a 'remove' function
     *	@param topic {string} the topic of interest
     *	@param callback {function} a callback function
     *	@return remove {object} returns an object containing a remove function
     */
    once(topic: string, callback: Function): { remove: any } {
        return this._registerListener(topic, callback, true)
    }

    /** _registerListener
     *	private internal function ...
     *  registers a callback function to be executed when a topic is published
     *	@param topic {string} the topic of interest
     *	@param callback {function} a callback function
     *	@param once {boolean} if true ... fire once then unregister
     *	@return remove {object} returns an object containing a 'remove' function
     */
    _registerListener(topic: string, callback: Function, once: boolean) {

        if (!this.topicSubscriptions.has(topic)) {
            this.topicSubscriptions.set(topic, [])
        }
        let subscriptions = this.topicSubscriptions.get(topic)!

        let index = subscriptions.length
        subscriptions.push({
            callback: callback,
            onlyOnce: once
        })


        // return an anonomous object with a 'remove' function
        return {
            remove: () => {
                delete subscriptions[index]
                if (subscriptions.length < 1) {
                    this.topicSubscriptions.delete(topic)
                }
            }
        }
    }

    /** broadcasts a topic with optional data (payload)
     *	e.g.: Events.broadcast("GameOver", winner)
     *	@param {string} topic - the topic of interest
     *	@param {object} payload - optional data to report to subscribers
     */
    broadcast(topic: string, payload: {}) {   //string | object) {
        if (this.topicSubscriptions.has(topic)) {
            this._dispatch(this.topicSubscriptions.get(topic)!, payload)
        }
    }

    /** private method _dispatch ... executes all registered callback functions */
    _dispatch(subscriptions: subscriptionObject[], payload: string | object) {
        if (subscriptions) {
            subscriptions.forEach((subscription: subscriptionObject, index: number) => {
                subscription.callback((payload != undefined) ? payload : {})
                if (subscription.onlyOnce) {
                    delete subscriptions[index]
                }
            })
        }
    }

    /** removes all registered topics and all of their listeners
     *	e.g.: Events.reset()
     */
    reset() {
        this.topicSubscriptions.clear()
    }

    /** removes a topic and all of its listeners
     * @param {string} topic
     */
    removeTopic(topic: string) {
        this.topicSubscriptions.delete(topic)
    }
}

/** the exported 'events' singlton object */
export const events = EventsSingleton.getInstance()


/** exported event topics list */
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
}
