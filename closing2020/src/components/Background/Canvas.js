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
function update(canvas, ctx, t, p, b) {
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
            let pz = Math.sin((b * 0.1 + pi / 3 - pj / 2) * Math.PI) * 20
            pz += Math.cos((b * 0.1 + pi / 5 + pj / 4) * Math.PI) * 20
            pz *= (Math.cos((b * 0.05 + pi / 6 - pj / 7) * Math.PI + 34) + 1.5)

            pz += ((1 - (b % 1)) ** 2) * ((Math.sin((pi / 12 - pj / 8 + pi * pj) * Math.PI) * 222.5) % 1 * 100)

            py -= pz
            px += pz * SKEW


            let fill = Math.abs(Math.sin(pi + pj * pi + pj * 5.7 + Math.round(b + pj * 0.25))) % 1 < 0.1

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
    ctx.transform(1, 0, SKEW, 1, canvas.width / 2, canvas.height * 0.45)


    drawer.draw(getGrid(t))
    ctx.restore()
}




export default {
    update
}