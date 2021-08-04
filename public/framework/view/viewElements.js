import { events, topic } from '../model/events.js';
import { container } from '../../view/container.js';
export default class ViewElements {
    constructor() {
        this.idSet = new Map();
        this.idCounter = 0;
        this.nodes = new Map();
        this.activeNodes = new Map();
        this.selectedId = null;
    }
    add(view) {
        let id = this.getNextID();
        view.id = id;
        this.nodes.set(id, view);
        if (!("undefined" === typeof (view["hovered"]))) {
            this.activeNodes.set(id, view);
        }
        events.broadcast(topic.ViewWasAdded, {
            type: view.constructor.name,
            index: view.index,
            name: view.name
        });
    }
    remove(element) {
        let id = (this.selectedId) ? this.selectedId : null;
        if (element !== null) {
            let view = this.activeNodes.get(element.id);
            if (view) {
                id = view.id;
            }
        }
        if (id !== null) {
            this.removeId(id);
            this.activeNodes.delete(id);
            this.render();
            this.selectedId = null;
        }
    }
    resetState() {
        this.activeNodes.forEach((element) => {
            element.hovered = false;
            element.selected = false;
        });
        this.selectedId = null;
        this.render();
    }
    moveUp() {
        if (this.selectedId === null)
            return;
        let el = this.activeNodes.get(this.selectedId);
        let originalzOrder = el.zOrder;
        if (originalzOrder < this.activeNodes.size) {
            el.zOrder = originalzOrder + 1;
            this.fixOrder(el.id, el.zOrder, originalzOrder);
            this.sort();
        }
    }
    moveDown() {
        if (this.selectedId !== null) {
            let el = this.activeNodes.get(this.selectedId);
            let originalzOrder = el.zOrder;
            if (originalzOrder > 0) {
                el.zOrder = originalzOrder - 1;
                this.fixOrder(el.id, el.zOrder, originalzOrder);
                this.sort();
            }
        }
    }
    moveToTop() {
        if (this.selectedId !== null) {
            let aNode = this.activeNodes.get(this.selectedId);
            aNode.zOrder = this.activeNodes.size + 10000;
            this.sort();
        }
    }
    moveToBottom() {
        if (this.selectedId !== null) {
            let aNode = this.activeNodes.get(this.selectedId);
            aNode.zOrder = -1;
            this.sort();
        }
    }
    fixOrder(skipThisId, oldzOrder, newzOrder) {
        for (let [key, value] of this.activeNodes) {
            if (value.id !== skipThisId && value.zOrder === oldzOrder) {
                value.zOrder = newzOrder;
                break;
            }
        }
    }
    sort() {
        this.activeNodes = new Map(Array.from(this.activeNodes).sort((a, b) => {
            return a[1].zOrder - b[1].zOrder;
        }));
        this.reOrder();
    }
    reOrder() {
        let i = 0;
        for (let [key, value] of this.activeNodes) {
            i++;
            value.zOrder = i;
        }
        this.render();
    }
    render() {
        container.clearCanvas();
        this.nodes.forEach((element) => {
            element.update();
        });
    }
    getNextID() {
        let nextNum = this.getUnusedOrNextId();
        this.idSet.set(nextNum, nextNum);
        return nextNum;
    }
    getUnusedOrNextId() {
        for (let i = 0; i < this.idSet.size; i++) {
            if (!this.idSet.has(i)) {
                return i;
            }
        }
        return this.idCounter++;
    }
    removeId(id) {
        this.idSet.delete(id);
    }
}
