function Brick(x, y, w, h, c = 128) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.c = c

    this.copy = function (x = 0, y = 0) {
        return new Brick(
            this.x + x,
            this.y + y,
            this.w, this.h,
            this.c
        )
    }
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array<Brick>} grid 
 */
function drawGrid(canvas, ctx, grid) {
    for (var brick of grid) {
        ctx.fillStyle = `rgb(${brick.c},${brick.c},${brick.c})`
        ctx.fillRect(brick.x, brick.y, brick.w+0.5, brick.h+0.5)
    }
}


function GridPainter(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.draw = function (grid) {
        drawGrid(this.canvas, this.ctx, grid)
    }
}


function buildTransition(brick1, brick2) {
    var dx = brick1.x - brick2.x
    var dy = brick1.y - brick2.y
    var dw = brick1.w - brick2.h
    var dh = brick1.h - brick2.h
    var dc = brick1.c - brick2.c

    var cost = Math.sqrt(dx ** 2 * 20 + dy ** 2 + (dw ** 2 + dh ** 2 + dc ** 2) * 0.1)

    cost -= (-brick1.x + brick2.x - brick1.y + brick2.y) * 0.1

    cost += Math.sin(brick1.x * 20.20) * Math.sin(brick2.y * 20.20)*0.1
    cost += Math.sin(brick1.y * 20.20) * Math.sin(brick2.x * 20.20)*0.1

    return [brick1, brick2, cost]
}


function lerp(a, b, t, power = 4) {
    let f = (t < 0.5) ? ((t / 0.5) ** power) * 0.5 : 1 - (((1 - t) / 0.5) ** power) * 0.5

    return a * (1 - f) + b * f
}
/**
 * 
 * @param {Array<Brick>} grid1 
 * @param {Array<Brick>} grid2 
 * @param {Number} t
 * @returns {lerpGrid~lerpTransition}
 */
function lerpGrid(grid1, grid2) {


    /**@type {Array<[Brick, Brick, Number]>} */
    let transitionCandidates = []

    for (let brick1 of grid1) {
        for (let brick2 of grid2) {
            let transition = buildTransition(brick1, brick2)
            transitionCandidates.push(transition)
        }
    }



    transitionCandidates = transitionCandidates.sort((a, b) => {
        return a[2] - b[2]
    }).slice(0, transitionCandidates.length*0.5)

    /**@type {Array<Brick>} */
    let assignedBricks = []

    /**@type {Array<[Brick, Brick, Number]>} */
    let transitions = []

    for (let transition of transitionCandidates) {
        if (assignedBricks.includes(transition[0])) continue
        if (assignedBricks.includes(transition[1])) continue
        transitions.push(transition)
        assignedBricks.push(transition[0])
        assignedBricks.push(transition[1])
    }

    for (let brick of grid1) {
        if (assignedBricks.includes(brick)) continue
        assignedBricks.push(brick)
        let targetBrick = new Brick(brick.x + brick.w / 2, -window.innerHeight*0.5, 0, 0, brick.c)
        let transition = buildTransition(brick, targetBrick)
        transitions.unshift(transition)
    }

    for (let brick of grid2) {
        if (assignedBricks.includes(brick)) continue
        assignedBricks.push(brick)
        let targetBrick = new Brick(brick.x + brick.w / 2, window.innerHeight*0.5, 0, 0, brick.c)
        let transition = buildTransition(targetBrick, brick)
        transitions.push(transition)
    }

    transitions = transitions.sort((a, b) => {
        return a[2] - b[2]
    })

    /** 
     * @param {number} t
     * @returns {Array<Brick>}
     */
    function lerpTransition(t) {
        let grid = []
        let i = 0

        for (let transition of transitions) {
            let offset = Math.abs(transition[2] / 200 % 1) * 0.1 + 0.15

            let k = (i / transitions.length*20.20)%1**0.25;

            let f = Math.max(0, Math.min(1, t / offset - k * (1 - offset)))

            let x = lerp(transition[0].x, transition[1].x, f)
            let y = lerp(transition[0].y, transition[1].y, f)
            let w = lerp(transition[0].w, transition[1].w, f)
            let h = lerp(transition[0].h, transition[1].h, f)
            let c = lerp(transition[0].c, transition[1].c, f)
            let brick = new Brick(x, y, w, h, c)
            i++
            grid.push(brick)
        }

        return grid
    }

    return lerpTransition
}


export default {
    Brick, GridPainter, lerp: lerpGrid
}




