



/**
 * Sort Algorithm
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} ctx 
 */
function ALGORITHM_sort(canvas, ctx) {

    var time = 0;



    var history = []
    function record(data) {
        var pos = {}
        data.map((x, i) => pos[x] = i)
        history.push(pos)
    }


    var elements = []

    var count = Math.random() * 5 + 10
    for (var i = 1; i <= count; i++) {
        elements.splice(Math.floor(Math.random() * elements.length), 0, i)
    }
    console.log(elements)
    record(elements)


    //
    // MAIN ALGORITHM
    //
    var swap = function (data, i, j) {
        var tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
    };



    var quickSort = function (data, left, right) {
        if (left < right) {
            var i = left, j = right + 1;
            while (true) {
                // 向右找小於Pivot的數值的位置
                while (i + 1 < data.length && data[++i] < data[left]);

                // 向左找大於Pivot的數值的位置
                while (j - 1 > -1 && data[--j] > data[left]);

                // 若i,j的位置交叉
                //     代表範圍內，Pivot右邊已無比Pivot小的數值
                //     代表範圍內，Pivot左邊已無比Pivot大的數值            
                if (i >= j)
                    break;

                // 將比Pivot大的數值換到右邊，比Pivot小的數值換到左邊
                swap(data, i, j);
                record(data)

            }
            swap(data, left, j);    // 將Pivot移到中間
            record(data)



            quickSort(data, left, j - 1);    // 對左子串列進行快速排序
            quickSort(data, j + 1, right);   // 對右子串列進行快速排序
        }
    }

    quickSort(elements, 0, elements.length - 1)
    console.log(history)
    record(elements)
    record(elements)


    // determine the algorithm is still performing
    this.alive = true;


    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    var mx = 0;
    var distortAmount = 0;
    // draw visual to canvas
    this.draw = function () {


        ctx.fillStyle = 'black'
        ctx.lineJoin = 'round'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (var i = 1; i <= elements.length; i++) {
            ctx.beginPath();



            var current = history[Math.floor(Math.min(mx + 1, history.length - 1))][i] + 1
            var pcurrent = history[Math.floor(Math.max(0, Math.min(mx, history.length - 1)))][i] + 1
            current = pcurrent + (current - pcurrent) * (1 - Math.floor(mx + 1) + mx)

            var closeness = 1 - Math.max(0, 1 - Math.abs(current - i))
            var lightness = i / count * 0.8 + 0.2

            ctx.strokeStyle =
                'rgb(' + (255 / 4 + 255 / 4 * 3 * closeness) * lightness
                + ',' + (255) * lightness
                + ',' + (255 / 2 + 255 / 2 * closeness) * lightness + ') '

            ctx.lineWidth = i / count * 20 + 4;

            for (var x = 0; x < mx + 1; x++) {

                var distort = Math.sin(x / 5 + time + i) * distortAmount

                var px = Math.max(0, x - 1)


                var y = history[Math.floor(Math.min(x, history.length - 1))][i]
                var py = history[Math.floor(Math.min(px, history.length - 1))][i]


                var f = 1;

                if (x > mx) {
                    f = 1 - x + mx;
                    x = mx
                }

                y = py + (y - py) * f


                var dx = x / history.length * canvas.width
                var dpx = px / history.length * canvas.width
                var dy = (y + 0.5 + distort) / elements.length * canvas.height
                var dpy = (py + 0.5) / elements.length * canvas.height
                ctx.lineTo(dx, dy)
            }
            ctx.stroke()

        }
    }

    // update and calculate algorithm
    this.update = function (delta) {
        time += delta
        mx += delta * history.length / 8
        if (mx > history.length) distortAmount += (mx - history.length) * 0.01
        if (mx > history.length * 1.1) this.alive = false;
    }
}











