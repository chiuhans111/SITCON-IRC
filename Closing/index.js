const puppeteer = require('puppeteer');
const path = require('path');
const cp = require('child_process');

(async () => {
    // Use Puppeteer to launch a browser and open a page.
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.setViewport({
        width: 1920,
        height: 1080
    })
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
    var frameCount = 0
    var terminate = false
    await page.on('console', async msg => {
        // console.log(msg.text())
        if (!terminate)
            if (msg.text() == 'hey puppeteer! I am ready to render!') {
                setTimeout(async () => {
                    var buffer = await page.screenshot({
                        type: 'jpeg',
                        quality: 100
                    })
                    ffmpeg.stdin.write(buffer)
                    frameCount++
                    console.log('rendered', frameCount)
                    page.evaluate('update(true)')
                }, 0);
            } else if (msg.text() == 'hey puppeteer! I am Done!') {
                ffmpeg.stdin.end()
                terminate = true
            }
    })



    // page.evaluate('update(true)')

    // Check it out! Fast animations on the "loading..." screen!
    await page.goto(__dirname + '/index.html');
    await page.evaluate('puppeteer=true')
})();