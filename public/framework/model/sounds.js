import { $ } from '../../globals.js';
class SoundsSingleton {
    constructor() {
        this.cluck = null;
        this.dohh = null;
        this.heehee = null;
        this.roll = null;
        this.select = null;
        this.woohoo = null;
        this.nooo = null;
        this.loaded = false;
        this.Cluck = () => { if (this.loaded && this.cluck)
            this.cluck.play(); };
        this.Dohh = () => { if (this.loaded && this.dohh)
            this.dohh.play(); };
        this.Heehee = () => { if (this.loaded && this.heehee)
            this.heehee.play(); };
        this.Roll = () => { if (this.loaded && this.roll)
            this.roll.play(); };
        this.Select = () => { if (this.loaded && this.select)
            this.select.play(); };
        this.Woohoo = () => { if (this.loaded && this.woohoo)
            this.woohoo.play(); };
        this.Nooo = () => { if (this.loaded && this.nooo)
            this.nooo.play(); };
        this.Init();
    }
    static getInstance() {
        if (!SoundsSingleton._instance) {
            SoundsSingleton._instance = new SoundsSingleton();
        }
        return SoundsSingleton._instance;
    }
    Init() {
        this.cluck = $('cluckSound');
        this.dohh = $('dohhSound');
        this.heehee = $('heheSound');
        this.roll = $('rollSound');
        this.select = $('selectSound');
        this.woohoo = $('woohooSound');
        this.nooo = $('noooSound');
        this.loaded = true;
    }
}
export default SoundsSingleton.getInstance();
