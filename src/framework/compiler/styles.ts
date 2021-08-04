
/**   
 * A list of style names that are of interest to us
 * */
const styleNames = [
    'left',
    'top',
    'width',
    'height',
    'border-radius',
    'color',
    'border',
    'border-color',
    'border-style',
    'stroke',
    'background-color',
    'font-name',
    'font-size',
    'isleft'
]

/**
 * Returns the string value parsed to a number.    
 * If parse returns NaN, returns the original value
 */
function fixNums(value: string) {
    const valNum = parseInt(value)
    return (isNaN(valNum)) ? value : valNum
}

/**
 * returns all attributes and styles for an element
 * @param element {HTMLElement} the element of interest
 * @returns {object} a styles object (name/value pairs)
 */
export function getStyles(element: HTMLElement){
    
    // create an empty object to hold any found values
    let styles = Object.create(null)
    
    // get all computed styles for this element
    let computedStyles = window.getComputedStyle(element)
    
    // loop through our style names of interest
    styleNames.forEach( (name: string) => {
        
        // first check for an attribute
        if (element.hasAttribute(name)) {
            let val = element.getAttribute(name)
            if (val) {
                styles[name] = fixNums(val)
            } else {
                styles[name] = true
            }
            
        } else { // no attribute, check for a computed style
            //@ts-ignore
            if (computedStyles[name]) {
                //@ts-ignore
                styles[name] = fixNums(computedStyles[name])
            }
        }
    })
    
    // return what was found
    return styles
}