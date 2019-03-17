



/**
 * Basic Algorithm Template
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function ALGORITHM_basic(canvas, ctx) {

    var time = 0;

    // determine the algorithm is still performing
    this.alive = true;
    var count = Math.random() * 3 + 4
    var seperate = 8;
    // draw visual to canvas
    this.draw = function () {

        if (time > 10) seperate += (time - 10) / 50
        else seperate *= 0.98
        ctx.fillStyle = 'rgba(0,0,0,0.06)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (var c = 1; c < count; c++) {
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(255,255,255,' + c / count + ')'
            ctx.lineWidth = c + 2
            for (var i = 0; i < canvas.width; i += 10) {
                var f = (c % 2 == 0 ? 1 : -1) * seperate
                for (var j = -5; j < 5; j++) {
                    if (j != 0)
                        f += Math.sin(c
                            + i * Math.abs(j) * Math.PI * 3 / (c + 1) / canvas.width
                            + time * j / (c + 1)) / j / c
                }
                var y = (f / 5 + 0.5) * canvas.height
                ctx.lineTo(i, y)
            }
            ctx.stroke();
        }
    }



    // update and calculate algorithm
    this.update = function (delta) {
        time += delta
        if (time > 10) this.alive = false
    }
}











