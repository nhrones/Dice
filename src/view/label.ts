
import { events, topic } from '../framework/model/events.js'
import { IGeometry, IView } from '../types.js'
import { container, ctx } from './container.js'


/** A virtual Label view class */
export default class Label implements IView {

    id: number = 0 // assigned by activeViews.add()
    activeView = false
    enabled = false
    hovered = false
    selected = false
    path = new Path2D()
    index: number = 0
    zOrder: number = 0 // assigned by activeViews.add()
    name: string
    geometry: IGeometry
    textLeft: number
    textTop: number
    strokeColor: string = "black"
    fillColor: string
    fontColor: string
    text: string
    lastText: string
    
    /** ctor that instantiates a new vitual Label view */
    constructor(index: number, name: string, text: string, geometry: IGeometry,
        fillColor: string, bind: boolean) {
        this.name = name
        this.index = index
        this.text = text
        this.lastText = ''
        this.geometry = geometry
        this.fillColor = fillColor
        this.fontColor = container.color
        this.textLeft = this.geometry.left - (this.geometry.width * 0.5)
        this.textTop = this.geometry.top - (this.geometry.height * 0.7)

        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                         bind events                      \\
        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        /*
            0 = 'normal'
            1 = 'hovered' (not owned)
            2 = 'hovered' (has owner)
            3 = 'reset' from hovered 
        */
        if (bind) {
            events.when(
                topic.UpdateLabel + this.name,
                (data: {
                    state: number
                    color: string,
                    textColor: string,
                    text: string
                }
                ) => {
                    this.fillColor = data.color
                    this.fontColor = data.textColor
                    if (data.state === 3) { // reset from hovered
                        this.text = this.lastText 
                    } else if (data.state === 2) { // hovered with owner
                        this.lastText = this.text
                        this.text = data.text
                    } else if (data.state === 1) { // hovered no owner
                        this.text = data.text
                    } else {  // state = 0
                        this.lastText = data.text
                        this.text = data.text
                    }
                    this.render()
                })
        }
    }

    /** updates and renders the view */
    update() {
        this.render()
    }

    /** render this Label shape (path) onto the canvas */
    render() {
        ctx.fillStyle = this.fillColor
        ctx.fillRect(this.textLeft, this.textTop, this.geometry.width, this.geometry.height)
        ctx.fillStyle = this.fontColor
        ctx.strokeStyle = this.fontColor
        ctx.fillText(this.text, this.geometry.left, this.geometry.top)
        ctx.strokeText(this.text, this.geometry.left, this.geometry.top)
    }

    touched(broadcast: boolean, x: number, y: number) {
        // not implemented  
    }
}
