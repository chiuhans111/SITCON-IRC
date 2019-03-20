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
    win.webContents.setFrameRate(24/3)


    // win.webContents.debugger.on('message', (e, m, p) => {
    //     console.log(e, m, p)
    // })

    // win.webContents.debugger.on('detach', (event, reason) => {
    //     console.log('Debugger detached due to : ', reason)
    // })

    electron.ipcMain.on('ready', function () {
        ready = true
    })
    win.webContents.on('paint', (e, d, img) => {
        if (ready) {
            console.log(frameCount)
            fs.writeFileSync('./render/' + frameCount.toString().padStart(5, '0') + '.jpg', img.toJPEG(80))
            frameCount++
        } else {
            console.log('wait for ready')
        }
    })

    win.loadFile(__dirname + './index.html')
    // win.webContents.debugger.attach()
})