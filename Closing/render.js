const electron = require('electron')
const fs = require('fs')
var frameCount = 0
var ready = false
var cp = require('child_process')
var path = require('path')
var stream = require('stream')

electron.app.disableHardwareAcceleration()

electron.app.on('ready', () => {

    let win = new electron.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            offscreen: true
        },

        enableLargerThanScreen: true
    })
    win.webContents.openDevTools()
    // win.webContents.setFrameRate(0)


    // win.webContents.debugger.on('message', (e, m, p) => {
    //     console.log(e, m, p)
    // })

    // win.webContents.debugger.on('detach', (event, reason) => {
    //     console.log('Debugger detached due to : ', reason)
    // })
    var ffmpeg = cp.spawn('ffmpeg', ['-y',
        '-f', 'image2pipe',
        '-s', '1920x1080',
        '-framerate', '60',
        // '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-i', '-',
        '-preset', 'slow',
        // '-vcodec', 'mpeg4',
        // '-shortest',
        path.resolve('./test4.mp4') // TODO create ffmpeg and pipe jpg into it 
    ])


    ffmpeg.stdout.on('data', data => console.log(data.toString()));
    ffmpeg.stderr.on('data', data => console.log(data.toString()));
    ffmpeg.on('close', () => console.log('done!'))
    // see this  : https://stackoverflow.com/questions/37957994/how-to-create-a-video-from-image-buffers-using-fluent-ffmpeg
    var imageStream = new stream.PassThrough()
    imageStream.pipe(ffmpeg.stdin)

    electron.ipcMain.on('end', function () {
        saveFrame = function () { }
        ffmpeg.stdin.end()
    })

    electron.ipcMain.on('ready', function () {
        console.log(':ready to render')
        ready = true
        win.webContents.send('render')
    })

    var invalidateTimes = 2

    var newestImg = null

    function saveFrame(img) {
        ffmpeg.stdin.write(img.toJPEG(100), 'utf8')
        console.log(frameCount)
        frameCount++
        win.webContents.send('render')
    }

    electron.ipcMain.on('e_render', function (e, data) {
        // console.log(':ready to render next', data)
        invalidateTimes = 2
        win.webContents.invalidate()
        win.webContents.invalidate()
        ready = true
    })


    win.webContents.on('paint', (e, d, img) => {
        invalidateTimes--
        // console.log('painting', d)
        if (ready && invalidateTimes == 0) {
            ready = false
            saveFrame(img)
        }
        newestImg = img
    })


    win.loadFile(__dirname + './index.html')
    // win.webContents.debugger.attach()
})