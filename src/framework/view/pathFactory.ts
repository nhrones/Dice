
import { IGeometry } from '../../types.js'
import Die from '../../view/die.js'

/** returns a Path2D object used to render a custom Right-Score */
export function buildRightScore(geometry: IGeometry) {
    const { left, right, top, bottom, width, height, radius } = getPathGeometry(geometry)
    let halfWidth = left + (width * 0.3)
    let halfHeight = top + (height * 0.5) + 5
    let p = new Path2D()
    p.moveTo(halfWidth + radius, top)
    p.arcTo(right, top, right, top + radius, radius)
    p.arcTo(right, bottom, right - radius, bottom, radius)
    p.arcTo(left, bottom, left, bottom - radius, radius)
    p.arcTo(left, halfHeight, left + radius, halfHeight, radius)
    p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight - radius, radius)
    p.arcTo(halfWidth, top, halfWidth + radius, top, radius)
    return p
}

/** returns a Path2D object used to render a custom Left-Score */
export function buildLeftScore(geometry: IGeometry) {
    const { left, right, top, bottom, width, height, radius } = getPathGeometry(geometry)
    let halfWidth = left + (width * 0.7)
    let halfHeight = top + (height * 0.5) - 5
    let p = new Path2D()
    p.moveTo(left + radius, top)
    p.arcTo(right, top, right, top + radius, radius)
    p.arcTo(right, halfHeight, right - radius, halfHeight, radius)
    p.arcTo(halfWidth, halfHeight, halfWidth, halfHeight + radius, radius)
    p.arcTo(halfWidth, bottom, halfWidth - radius, bottom, radius)
    p.arcTo(left, bottom, left, bottom - radius, radius)
    p.arcTo(left, top, left + radius, top, radius)
    return p
}

/** returns a Path2D object used to render a custom Rounded-Rectangle */
export function buildRoundedRectangle(geometry: IGeometry) {
    const { left, right, top, bottom, radius } = getPathGeometry(geometry)
    let path = new Path2D
    path.moveTo(left + radius, top)
    path.arcTo(right, top, right, top + radius, radius) // top
    path.arcTo(right, bottom, right - radius, bottom, radius) // right
    path.arcTo(left, bottom, left, bottom - radius, radius) // bottom
    path.arcTo(left, top, left + radius, top, radius) // left
    return path
}

/** adds calculated 'right and 'bottom' properties to an IGeometry */
const getPathGeometry = (geometry: IGeometry) => {
    const { left, top, width, height, radius } = geometry
    return {
        left: left,
        right: left + width,
        top: top,
        bottom: top + height,
        width: width,
        height: height,
        radius: radius || 10
    }
}


/////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//                                                              \\
//             Build Pre-Rendered Die Face Images               \\
//                                                              \\
/////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


const ctx = document.createElement('canvas').getContext('2d')!
let size = 0

/** A die-face builder class that renders and persists dice face images   */
export class DieBuilder {

    buildDieFaces(dieSize: number, color: string) {
        size = dieSize
        ctx.canvas.width = size
        ctx.canvas.height = size
        ctx.fillStyle = color
        ctx.fillRect(0, 0, size, size)
        for (let i = 0; i < 7; i++) {
            Die.faces[i] = this.drawDie(false, i, color)
            Die.frozenFaces[i] = this.drawDie(true, i, color)
        }
    }

    drawDie(frozen: boolean, value: number, color: string) {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, size, size)
        ctx.save()
        if (frozen) {
            ctx.strokeStyle = 'silver'
            ctx.fillStyle = 'WhiteSmoke'
        }
        else {
            ctx.strokeStyle = 'black'
            ctx.fillStyle = 'white'
        }
        this.drawDieFace()
        this.drawGlare()
        ctx.fillStyle = (frozen) ? 'silver' : 'black'
        this.drawDots(value)
        ctx.restore()
        return ctx.getImageData(0, 0, size, size)
    }

    drawDieFace() {
        let radius = size / 5
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.arcTo(size, 0, size, size, radius)
        ctx.arcTo(size, size, 0, size, radius)
        ctx.arcTo(0, size, 0, 0, radius)
        ctx.arcTo(0, 0, radius, 0, radius)
        ctx.closePath()
        ctx.fill()
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.lineWidth = 1
    }

    drawGlare() {
        let offset = 5
        let bottomLeftX = offset
        let bottomLeftY = size - offset
        let bottomRightX = size - offset
        let bottomRightY = size - offset
        let quarter = size * 0.25
        let threeQuarter = quarter * 3
        ctx.fillStyle = 'rgba(200, 200, 200, 0.4)'
        ctx.beginPath()
        ctx.moveTo(bottomLeftX, bottomLeftY)
        ctx.lineTo(bottomRightX, bottomRightY)
        ctx.bezierCurveTo(quarter, threeQuarter, quarter, threeQuarter, offset, offset)
        ctx.closePath()
        ctx.fill()
        ctx.save()
    }

    drawDots(dieValue: number) {
        let quarter = size / 4
        let center = quarter * 2
        let middle = quarter * 2
        let left = quarter
        let top = quarter
        let right = quarter * 3
        let bottom = quarter * 3
        let dotSize = size / 12
        let doDot = this.drawDot
        if (dieValue === 1) {
            doDot(middle, center, dotSize)
        }
        else if (dieValue === 2) {
            doDot(top, left, dotSize)
            doDot(bottom, right, dotSize)
        }
        else if (dieValue === 3) {
            this.drawDot(top, left, dotSize)
            this.drawDot(middle, center, dotSize)
            this.drawDot(bottom, right, dotSize)
        }
        else if (dieValue === 4) {
            this.drawDot(top, left, dotSize)
            this.drawDot(top, right, dotSize)
            this.drawDot(bottom, left, dotSize)
            this.drawDot(bottom, right, dotSize)
        }
        else if (dieValue === 5) {
            this.drawDot(top, left, dotSize)
            this.drawDot(top, right, dotSize)
            this.drawDot(middle, center, dotSize)
            this.drawDot(bottom, left, dotSize)
            this.drawDot(bottom, right, dotSize)
        }
        else if (dieValue === 6) {
            this.drawDot(top, left, dotSize)
            this.drawDot(top, right, dotSize)
            this.drawDot(middle, left, dotSize)
            this.drawDot(middle, right, dotSize)
            this.drawDot(bottom, left, dotSize)
            this.drawDot(bottom, right, dotSize)
        }
    }

    drawDot(y: number, x: number, dotSize: number) {
        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
    }

}
