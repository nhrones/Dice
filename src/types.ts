
/** IView interface
 */
export interface IView {

    id: number
    activeView: boolean
    index: number
    zOrder: number
    name: string
    geometry: IGeometry
    enabled: boolean
    hovered: boolean
    selected: boolean
    path: Path2D

    update(): void
    render(state?: any): void
    touched(broadcast: boolean, x: number, y: number): void

}

/** an interface used to contain the values    
 * required to build an IActiveView object 
 */
export interface IElementDescriptor {
    kind: string
    id: string
    idx: number | null
    pathGeometry: IGeometry
    renderAttributes: IRenderAttributes
}

/** an interface used to contain a set of optional attributes   
 * that are used to configure a rendering context   
 * strokeColor, fillColor, fontColor, fontSize, borderWidth, text
 */
export interface IRenderAttributes {
    strokeColor?: string
    color?: string
    fontColor?: string
    fontSize?: string
    borderWidth?: number
    text?: string
    isLeft?: boolean
}

/** an interface that prescribes the geometry used   
 * to locate and size a Path2D object      
 * (used to render a unique shape on a canvas)
 */
export interface IGeometry {
    left: number
    top: number
    width: number
    height: number
    radius?: number
}
