const puppeteer = require('puppeteer')
puppeteer.launch({
    headless: false,

}).then(async browser => {
    var page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720 })


    var done = function () {

    }

    await page.exposeFunction('done', async () => {
        await page.screenshot({
            type: "jpeg",
            quality: 100,
            path: __dirname + "/output/" + await page.title() + ".png"
        })
        done()
    })

    for (var i = 1; i <= 40; i++) {
        await page.goto(__dirname + '/index.html?n=' + i)
        await new Promise(done2 => {
            done = done2
        })
    }
})