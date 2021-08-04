
/////////////////////////////////    ViewElements    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//                                                                                    \\
//  ViewElements ... a collection of 'View' objects.                                  \\
//  ViewElement objects are used to persist renderable objects to the 'canvas'.       \\
//                                                                                    \\
//  ViewElements are held in an ES6 Map.                                              \\
//  This map maintains a sort-order based on an ViewElements zOrder number.           \\
//  This insures proper rendering order, as well as, ordered 'hit-testing'            \\
//  by using each elements Path2D path.                                               \\
//  We hit-test 'front-to-back' to insure that top-level elements are detected first. \\
//  When an element is added or moved, its zOrder value is mutated to indicate        \\
//  in which order(zOrder) it is rendered in.                                         \\
//                                                                                    \\
//////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

import { IView} from '../../types.js'
import { events, topic } from '../model/events.js'
import { container } from '../../view/container.js'


/** A class that contains and manages a set of View Element nodes
 */
export default class ViewElements {

    nodes: Map<number, IView>
    activeNodes: Map<number, IView>
    selectedId: number | null
    idSet: Map<number, number> = new Map()
    idCounter: number = 0

    constructor() {
        this.nodes = new Map()
        this.activeNodes = new Map()
        this.selectedId = null
    }

    /** adds a new view element to the nodes and/or activeNodes collections 
     */
    add(view: IView) {

        // assign a unique id number to each view
        let id = this.getNextID()

        // assign unique ID to all views
        view.id = id

        // add all views to nodes colection
        this.nodes.set(id, view as IView)

        // is this an 'active-view' (has a hovered property?)
        if (!("undefined" === typeof (view["hovered"]))) {
            // add all active-views(views that are clickable) to activeNodes collection
            this.activeNodes.set(id, view as IView)
        }

        // sends a message to diceGame to build an appropriate viewmodel
        events.broadcast(topic.ViewWasAdded,
            {
                type: view.constructor.name,
                index: view.index,
                name: view.name
            }
        )
    }

    /** removes a view element from the nodes and/or activeNodes collections 
    */
    remove(element: IView | null) {
        let id = (this.selectedId) ? this.selectedId : null

        if (element !== null) {
            let view = this.activeNodes.get(element.id)
            if (view) {
                id = view.id
            }
        }
        if (id !== null) {
            this.removeId(id)
            this.activeNodes.delete(id)
            this.render()
            this.selectedId = null
        }
    }

    /** reset the State of the activeNodes set */
    resetState() {
        this.activeNodes.forEach((element) => {
            element.hovered = false
            element.selected = false
        })
        this.selectedId = null
        this.render()
    }

    /** moves a node up in the zOrder */
    moveUp() {
        if (this.selectedId === null) return
        let el = this.activeNodes.get(this.selectedId)!
        let originalzOrder = el.zOrder
        // not at top already
        if (originalzOrder < this.activeNodes.size) {
            el.zOrder = originalzOrder + 1
            this.fixOrder(el.id, el.zOrder, originalzOrder)
            this.sort()
        }
    }

    /** moves a node down in the zOrder */
    moveDown() {
        if (this.selectedId !== null) {
            let el = this.activeNodes.get(this.selectedId)!
            let originalzOrder = el.zOrder
            // not already on bottom
            if (originalzOrder > 0) {
                el.zOrder = originalzOrder - 1
                this.fixOrder(el.id, el.zOrder, originalzOrder)
                this.sort()
            }
        }
    }

    /** moves a node to the top of the zOrder */
    moveToTop() {
        if (this.selectedId !== null) {
            let aNode = this.activeNodes.get(this.selectedId)!
            aNode.zOrder = this.activeNodes.size + 10000
            this.sort()
        }
    }

    /** moves a node to the bottom of the zOrder */
    moveToBottom() {
        if (this.selectedId !== null) {
            let aNode = this.activeNodes.get(this.selectedId)!
            aNode.zOrder = -1
            this.sort()
        }
    }

    /** flips the zOrder of two view elements */
    fixOrder(skipThisId: number, oldzOrder: number, newzOrder: number) {
        for (let [key, value] of this.activeNodes) {
            if (value.id !== skipThisId && value.zOrder === oldzOrder) {
                value.zOrder = newzOrder
                break
            }
        }
    }

    // sort elements in the set by their zOrder
    sort() {
        this.activeNodes = new Map(
            // array index 1 is the 'value' field of this map
            Array.from(this.activeNodes).sort((a, b) => {
                return a[1].zOrder - b[1].zOrder;
            })
        )
        this.reOrder()
    }

    /** reindex view-set zOrders to remove any unused indexes */
    reOrder() {
        let i = 0
        for (let [key, value] of this.activeNodes) {
            i++
            value.zOrder = i
        }
        this.render()
    }

    /** called from:     
     *      this.remove()   
     *      this.resetState()      
     *      this.reOrder()   
     */
    render() {
        container.clearCanvas()
        this.nodes.forEach((element: any) => {
            element.update()
        })
    }

    /** produce a unique ID, reusing any empty id numbers */
    getNextID() {
        let nextNum = this.getUnusedOrNextId()
        this.idSet.set(nextNum, nextNum)
        return nextNum
    }

    /** returns the first unused ID or a new ID number */
    getUnusedOrNextId() {
        // try to fill any holes left by deleted objects
        for (let i = 0; i < this.idSet.size; i++) {
            if (!this.idSet.has(i)) {
                return i // returns first unused key number found
            }
        }
        // or, if no unused id found, create a new one
        return this.idCounter++
    }

    /** remove an unused ID */
    removeId(id: number) {
        this.idSet.delete(id)
    }
}