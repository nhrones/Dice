
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

/** static object used for documentation and refactoring    
 * object per topic ...    
 *    topic:{    
 *        broadcast: {file, calledAt, line#}    
 *        payload: {???}    
 *        when: {file, subscribedAt, line#}     
 *    }    
 */
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
            { file: 'diceGame.ts', line: 166 },   // UpdateLabel + 'LeftScoreTotalLabel'
            { file: 'diceGame.ts', line: 190 },   // UpdateLabel + 'InfoLabel'
            { file: 'diceGame.ts', line: 243 },   // UpdateLabel + 'LeftScoreTotalLabel'
            { file: 'diceGame.ts', line: 253 },   // UpdateLabel + 'LeftScoreTotalLabel'
            { file: 'diceGame.ts', line: 263 },   // UpdateLabel + 'LeftScoreTotalLabel'
            { file: 'players.ts', line: 161 },    // UpdateLabel + 'player' + index
            { file: 'scoreElement.ts', line: 68 } // UpdateLabel + 'InfoLabel'
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
}