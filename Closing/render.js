const electron = require('electron')
const fs = require('fs')
var frameCount = 0
var ready = false
// electron.app.disableHardwareAcceleration()
electron.app.on('ready', () => {
    let win = new electron.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            offscreen: true
        },

        enableLargerThanScreen: true
    })
    win.webContents.openDevTools()
    // win.webContents.setFrameRate(12)


    // win.webContents.debugger.on('message', (e, m, p) => {
    //     console.log(e, m, p)
    // })

    // win.webContents.debugger.on('detach', (event, reason) => {
    //     console.log('Debugger detached due to : ', reason)
    // })

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
            fs.writeFileSync('./render/' + frameCount.toString().padStart(5, '0') + '.jpg', img.toJPEG(80))
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