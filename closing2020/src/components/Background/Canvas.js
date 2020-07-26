import GridLogic from './GridLogic'
// import GridSetup from './GridSetup'
import FontDatabase from './FontDatabase'

const buildString = FontDatabase.buildString
const SKEW = -0.17823


let keyframes = [
    "#DEFINE",
    "speakers",
    "staffs",
    "Coordinator",
    "Administration",
    "Agenda",
    "SET",
    ""
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
function update(canvas, ctx, t) {
    var drawer = new GridLogic.GridDrawer(canvas, ctx)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.transform(1, 0, SKEW, 1, canvas.width/2, canvas.height/2)


    drawer.draw(getGrid(t))
    ctx.restore()
}




export default {
    update
}