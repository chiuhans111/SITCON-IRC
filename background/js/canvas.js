
//
// SETUP CANVAS
//

/**
 * @type {HTMLCanvasElement}
 */
var canvas = document.getElementById('main-canvas')

var ctx = canvas.getContext('2d')

function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

resizeCanvas();
addEventListener('resize', resizeCanvas)




