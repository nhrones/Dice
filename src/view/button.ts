

import { events, topic} from '../framework/model/events.js'
import { IGeometry, IView } from '../types.js'
import { container, ctx } from './container.js'
import Label from './label.js'


/** A virtual Button view class */
export default class Button implements IView {

    id: number = 0 // assigned by activeViews.add() 
    activeView = true
    index: number = -1
    zOrder: number = 0 // assigned by activeViews.add()
    name: string = ''
    enabled: boolean = true
    hovered: boolean = false
    selected: boolean = false
    path: Path2D
    geometry: IGeometry
    firstPass: boolean = true
    color: string
    textColor: string
    textLabel: Label
    text: string = ""

    /** ctor that instantiates a new vitual Button view */
    constructor(name: string, text: string, geometry: IGeometry, path: Path2D) {

        this.name = name
        this.zOrder = 0
        this.geometry = geometry
        this.color = container.textColor
        this.textColor = container.color
        this.enabled = true

        this.textLabel = new Label(
            -1, this.name + 'Label', text, {
                left: geometry.left + 68,
                top: geometry.top + 30,
                width: geometry.width - 25,
                height: 40
            }, 'blue', true)

        this.path = path
        this.firstPass = true
        this.render()

        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                         bind events                       \\
        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        // the viewModel will emit this event whenever it needs to update this view
        events.when(
            topic.UpdateButton + this.name,
                (data: { text: string , color: string, enabled: boolean }) => {
                this.enabled = data.enabled
                this.color = data.color //_background
                this.text = data.text
                this.render()
            })
    }

    /** called by the view container when this element has been touched
     * @param broadcast {boolean} if true, broadcast an event to any interested objects
     * @param x {number} the horizontal location that was touched
     * @param y {number} the vertical location that was touched
     */
    touched(broadcast: boolean, x: number, y: number) {
        if (this.enabled) {
            if (broadcast) {
                events.broadcast(topic.ButtonTouched + this.name, {})
            }
        }
    }

    /** updates and renders the Button view */
    update() {
        this.render()
    }

    /** render this Buttons shape (path) onto the canvas */
    render() {
        ctx.save()
        if (this.firstPass) {
            // turn shadow on
            ctx.shadowColor = 'burlywood'
        }

        ctx.save()
        ctx.lineWidth = 2
        ctx.strokeStyle = (this.hovered) ? 'orange' : 'black'
        ctx.stroke(this.path)
        ctx.restore()

        ctx.fillStyle = this.color
        ctx.fill(this.path)
        ctx.fillStyle = container.color
        if (this.firstPass || this.hovered) {
            this.firstPass = false
            //CTX.shadowColor = 'transparent'
        }
        ctx.restore()
        this.textLabel.fillColor = this.color
        this.textLabel.fontColor = this.textColor
        this.textLabel.text = this.text
        this.textLabel.render()
    }
}
