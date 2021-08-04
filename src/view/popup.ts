
import { events, topic} from '../globals.js'
import { IGeometry, IView } from '../types.js'
import { container, ctx } from './container.js'


let left = 1
let top = 1

/** A virtual Popup view class */
export default class Popup implements IView {

    id: number = 0 // assigned by activeViews.add() 
    index: number = -1
    activeView = true
    zOrder: number = 100 // assigned by activeViews.add()
    name: string = ""
    enabled: boolean = true
    hovered: boolean = false
    selected: boolean = false
    path: Path2D
    shownPath: Path2D
    hiddenPath: Path2D
    geometry: IGeometry
    color: string = "black"
    text: string = ""
    visible: boolean = true
    buffer: ImageData | null = null

    /** ctor that instantiates a new vitual Popup view */
    constructor(geometry: IGeometry, path: Path2D) {

        this.enabled = true
        this.color = 'white'

        this.shownPath = path
        this.hiddenPath = new Path2D()
        this.hiddenPath.rect(1, 1, 1, 1)

        this.geometry = geometry
        this.path = this.hiddenPath


        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        //                         bind events                     \\
        ////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        // Our model broadcasts this ShowPopup event at the end of a game
        events.when(topic.ShowPopup, (data: { message: string }) => {
            this.show(data.message)
        })

        events.when(topic.HidePopup, () => {
            this.hide()
        })
    }

    /** show the virtual Popup view */
    show(msg: string) {
        this.text = msg
        left = this.geometry.left
        top = this.geometry.top
        this.path = this.shownPath
        this.visible = true
        this.saveScreenToBuffer()
        this.render()
        container.hasVisiblePopup = true
    }

    /** hide the virtual Popup view */
    hide() {
        if (this.visible) {
            left = 1
            top = 1
            this.path = this.hiddenPath
            this.restoreScreenFromBuffer()
            this.visible = false
            container.hasVisiblePopup = false
        }
    }

    /** takes a snapshot of our current canvas bitmap */
    saveScreenToBuffer() {
        this.buffer = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    /** paint the canvas with our current snapshot */
    restoreScreenFromBuffer() {
        if (this.buffer) {
            return ctx.putImageData(this.buffer, 0, 0)
        }
    }

    /**
     * called by the view container when this element has been touched
     * @param broadcast {boolean} if true, broadcast an event to any interested objects
     * @param x {number} the horizontal location that was touched
     * @param y {number} the vertical location that was touched
     */
    touched(broadcast: boolean, x: number, y: number) {
        this.hide()
        events.broadcast(topic.PopupResetGame, {})
    }

    /** update this virtual Popups view (render it) */
    update() {
        if (this.visible) this.render()
    }

    /** render this virtual Popup view */
    render() {
        ctx.save()
        ctx.shadowColor = '#404040'
        ctx.shadowBlur = 45
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5
        ctx.fillStyle = container.color
        ctx.fill(this.path)
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.lineWidth = 1
        ctx.strokeStyle = container.textColor
        ctx.stroke(this.path)
        ctx.strokeText(this.text, left + 150, top + 100)
        ctx.restore()
        this.visible = true
    }
}
