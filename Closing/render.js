const electron = require('electron')
const fs = require('fs')
var frameCount = 0
var ready = false
var cp = require('child_process')
var path = require('path')
var stream = require('stream')

// electron.app.disableHardwareAcceleration()
electron.app.on('ready', () => {
    let win = new electron.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            offscreen: true
        },

        enableLargerThanScreen: true
    })
    // win.webContents.openDevTools()
    // win.webContents.setFrameRate(12)


    // win.webContents.debugger.on('message', (e, m, p) => {
    //     console.log(e, m, p)
    // })

    // win.webContents.debugger.on('detach', (event, reason) => {
    //     console.log('Debugger detached due to : ', reason)
    // })
    var ffmpeg = cp.spawn('ffmpeg', ['-y',
        '-f', 'image2pipe',
        '-s', '960x540',
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
        ffmpeg.stdin.end()
    })

    electron.ipcMain.on('ready', function () {
        console.log(':ready to render')
        ready = true
        win.webContents.send('render')
    })

    electron.ipcMain.on('e_render', function () {
        // console.log(':ready to render next')
        ready = true
    })

    win.webContents.on('paint', (e, d, img) => {
        if (ready) {
            ready = false
            console.log(frameCount)
            // fs.writeFileSync('./render/' + frameCount.toString().padStart(5, '0') + '.jpg', img.toJPEG(80))
            ffmpeg.stdin.write(img.toJPEG(100), 'utf8')
            // console.log(img.toPNG())
            frameCount++
            win.webContents.send('render')
            // console.log('begin next frame')
        } else {
            console.log('wait for ready')
        }
    })



    win.loadFile(__dirname + './index.html')
    // win.webContents.debugger.attach()
})