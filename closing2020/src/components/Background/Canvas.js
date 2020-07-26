import GridLogic from './GridLogic'
// import GridSetup from './GridSetup'
import FontDatabase from './FontDatabase'

const buildString = FontDatabase.buildString
const SKEW = -0.17823


let keyframes = [
    "#DEFINE",
    "speakers",
    "",
    "staffs",
    "Coordinator",
    "Administration",
    "Agenda",
    "CREW",
    "FINANCE",
    "Marketing",
    "editor",
    "design",
    "photography",
    "Production",
    "developer",
    "network",
    "",
    "HOST",
    "CO-HOST",
    "CO-organizer",
    "",
    "",
    "",
    "thanks",
    "media",
    "",
    "special",
    "",
    "#define yourself",
]

let lerps = []

for (let i = 0; i < keyframes.length - 1; i++) {
    lerps.push(GridLogic.lerp(buildString(keyframes[i]), buildString(keyframes[i + 1])))
}



function getGrid(t) {
    if (t < 0) t = 0

    let i = Math.floor(t)
    let f = t - i

    if (i >= lerps.length) {
        i = lerps.length - 1
        f = 1
    }

    return lerps[i](f)

}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function update(canvas, ctx, t, p) {
    var drawer = new GridLogic.GridDrawer(canvas, ctx)

    ctx.clearRect(0, 0, canvas.width, canvas.height)




    // GRID

    let grid = [[]]



    let wseg = 10
    let hseg = 10


    let offsetY = p / window.innerHeight * hseg
    let offsetYI = Math.round(offsetY)
    offsetY -= offsetYI

    for (let i = 0; i < hseg + 3; i++) {
        for (let j = 0; j < wseg + 4; j++) {

            let pi = i - offsetYI - 1
            let pj = j - 1

            let py = (i + offsetY - 1) / hseg * window.innerHeight
            let px = (j - 1) / wseg * window.innerWidth + py * SKEW
            let pz = Math.sin(p * 0.01 + pi * 4 + pj * 4) * 20
            pz += Math.cos(p * 0.005 + pi * 2 - pj * 2) * 20
            pz *= (Math.cos(p * 0.001 + pi * 0.2 - pj * 0.5 + 20) + 1)


            py -= pz
            px += pz * SKEW


            let fill = Math.abs(Math.sin(pi + pj * pi + pj * 5.7 + Math.round(p / 200 + pj * 0.732))) % 1 < 0.05

            grid[grid.length - 1].push([px, py, fill])
        }
        grid.push([])
    }
    ctx.fillStyle = '#1A1A1A'
    ctx.strokeStyle = '#444'
    for (let i = 0; i < grid.length - 2; i++) {
        for (let j = 0; j < grid[i].length - 1; j++) {
            ctx.beginPath()
            ctx.moveTo(...grid[i][j])
            ctx.lineTo(...grid[i + 1][j])
            ctx.lineTo(...grid[i + 1][j + 1])
            ctx.lineTo(...grid[i][j + 1])
            ctx.closePath()

            if (grid[i][j][2])
                ctx.fill()

            ctx.stroke()

        }
    }

    // text
    ctx.save()
    ctx.transform(1, 0, SKEW, 1, canvas.width / 2, canvas.height * 0.42)


    drawer.draw(getGrid(t))
    ctx.restore()
}




export default {
    update
}