


var transitionCoolDownTime = 100;
var transitionCoolDownTime_Wait = 50;
var transitionCoolDown = 0;

var algorithm = null
var algorithms = [
    ALGORITHM_basic,
    ALGORITHM_sort
]

function newAlgorithm() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    algorithm = new algorithms
    [Math.floor(algorithms.length * Math.random())]
        (canvas, ctx)
}

var past = Date.now()
function update() {
    var now = Date.now()

    canvas.style.opacity = Math.max(0, Math.min(1,
        (transitionCoolDown - transitionCoolDownTime_Wait) /
        (transitionCoolDownTime - transitionCoolDownTime_Wait) * .8))


    if (algorithm != null) {

        algorithm.draw()
        algorithm.update((now - past) / 1000)

        if (!algorithm.alive) {
            transitionCoolDown--
            if (transitionCoolDown <= 0) algorithm = null
        } else {
            if (transitionCoolDown < transitionCoolDownTime) transitionCoolDown++
            else transitionCoolDown = transitionCoolDownTime
        }



    } else newAlgorithm()

    past = now

    setTimeout(() => {
        update()
    }, 16)

}
update();








