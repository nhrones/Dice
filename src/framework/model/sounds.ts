
import {$} from '../../globals.js'

/** A singleton Sounds class */
class SoundsSingleton {

    private static _instance: SoundsSingleton

    private constructor() {
        this.Init()
    }

    // singleton construction and accessor
    static getInstance() {
        if (!SoundsSingleton._instance) {
            SoundsSingleton._instance = new SoundsSingleton()
        }
        return SoundsSingleton._instance
    }

    cluck: HTMLAudioElement | null = null
    dohh: HTMLAudioElement | null = null
    heehee: HTMLAudioElement | null = null
    roll: HTMLAudioElement | null = null
    select: HTMLAudioElement | null = null
    woohoo: HTMLAudioElement | null = null
    nooo: HTMLAudioElement | null = null

    loaded = false

    /** Initializes the Sounds services.
     *  Called from the DiceGame constructor */
    Init() {
        this.cluck = $('cluckSound') as HTMLAudioElement
        this.dohh = $('dohhSound') as HTMLAudioElement
        this.heehee = $('heheSound') as HTMLAudioElement
        this.roll = $('rollSound') as HTMLAudioElement
        this.select = $('selectSound') as HTMLAudioElement
        this.woohoo = $('woohooSound') as HTMLAudioElement
        this.nooo = $('noooSound') as HTMLAudioElement
        this.loaded = true
    }

    Cluck = () => { if (this.loaded && this.cluck) this.cluck.play() }
    Dohh = () => { if (this.loaded && this.dohh) this.dohh.play() }
    Heehee = () => { if (this.loaded && this.heehee) this.heehee.play() }
    Roll = () => { if (this.loaded && this.roll) this.roll.play() }
    Select = () => { if (this.loaded && this.select) this.select.play() }
    Woohoo = () => { if (this.loaded && this.woohoo) this.woohoo.play() }
    Nooo = () => { if (this.loaded && this.nooo) this.nooo.play() }
}

/** the exported Sounds singlton object */
export default SoundsSingleton.getInstance()
