const puppeteer = require('puppeteer');
const path = require('path');
const cp = require('child_process');

(async () => {
    // Use Puppeteer to launch a browser and open a page.
    const browser = await puppeteer.launch({ headless: true , args:[
        '--disable-gpu'
    ]});
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


    await page.goto(__dirname + '/index.html');

    page.exposeFunction('pup_render', async frame => {
        return new Promise(async done => {
            ffmpeg.stdin.write(await page.screenshot({
                type: 'jpeg',
                quality: 100
            }))
            frameCount++
            console.log('rendered', frameCount)
            done()
        })
    })

    page.exposeFunction('pup_end', () => {
        ffmpeg.stdin.end()
        terminate = true
    })





    // page.evaluate('update(true)')

    // Check it out! Fast animations on the "loading..." screen!

    await page.evaluate('puppeteer=true')
})();