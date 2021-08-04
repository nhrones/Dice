import { $ } from '../../globals.js';
import { getStyles } from './styles.js';
export let components = [];
let component = null;
export const compileUI = () => {
    let surfaceElement = $('surface');
    let nodes = surfaceElement.childNodes;
    for (let index = 0; index < nodes.length; index++) {
        let node = nodes[index];
        if (node.tagName) {
            hydrateElement(node);
        }
    }
    localStorage.setItem('elementDescriptors', JSON.stringify(components));
};
function hydrateElement(thisElement) {
    let tagName = thisElement.tagName.toLowerCase();
    let styles = getStyles(thisElement);
    component = {
        kind: tagName,
        id: getStringAttribute(thisElement, 'id'),
        idx: getNumbericAttribute(thisElement, 'idx', 0),
        pathGeometry: getPathGeometry(thisElement, styles),
        renderAttributes: getAttributes(thisElement, styles)
    };
    components.push(component);
    return component;
}
function getPathGeometry(thisElement, styles) {
    let l = getNumbericAttribute(thisElement, 'left');
    let t = getNumbericAttribute(thisElement, 'top');
    let w = getNumbericAttribute(thisElement, 'width');
    let h = getNumbericAttribute(thisElement, 'height');
    let r = getNumbericAttribute(thisElement, 'radius');
    return {
        left: (l > 0) ? l : (styles.left) ? parseInt(styles.left) : 10,
        top: (t > 0) ? t : (styles.top) ? parseInt(styles.top) : 10,
        width: (w > 0) ? w : (styles.width) ? parseInt(styles.width) : 10,
        height: (h > 0) ? h : (styles.height) ? parseInt(styles.height) : 10,
        radius: (r > 0) ? r : (styles['border-radius']) ? parseInt(styles['border-radius']) : 15
    };
}
function getAttributes(thisElement, styles) {
    let strokeClr = getStringAttribute(thisElement, 'strokeColor');
    let fillClr = getStringAttribute(thisElement, 'fillColor');
    let fntSize = getStringAttribute(thisElement, 'font-size');
    return {
        strokeColor: (strokeClr) ? strokeClr : (styles.stroke) ? styles.stroke : 'black',
        fillColor: (fillClr) ? fillClr : (styles.fill) ? styles.fill : 'red',
        fontColor: getStringAttribute(thisElement, 'fontColor') || 'black',
        fontSize: (fntSize) ? fntSize : (styles['font-size']) ? styles['font-size'] : '14px',
        borderWidth: getNumbericAttribute(thisElement, 'borderWidth', 2),
        text: thisElement.textContent,
        isLeft: getBooleanAttribute(thisElement, 'isLeft')
    };
}
function getBooleanAttribute(thisElement, name) {
    let boolResult = thisElement.getAttribute(name);
    return (boolResult === "false" || boolResult === null) ? false : true;
}
function getNumbericAttribute(thisElement, name, defaultNumber = 0) {
    let val = thisElement.getAttribute(name);
    return (val) ? parseInt(val) : defaultNumber;
}
function getStringAttribute(thisElement, name) {
    return thisElement.getAttribute(name);
}
