const puppeteer = require('puppeteer');

(async () => {
    // Use Puppeteer to launch a browser and open a page.
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Create a raw DevTools protocol session to talk to the page.
    // Use CDP to set the animation playback rate.
    const session = await page.target().createCDPSession();
    await session.send('Animation.enable');
    var animationIDs = []
    session.on('Animation.animationCreated', async (data) => {
        console.log('Animation created!', data.id);
        animationIDs.push(data.id)
        await session.send('Animation.setPaused', {
            animations: [data.id],
            paused: true
        });

    });
    session.on('Animation.animationCanceled', (data) => {
        console.log('Animation canceled!', data.id);

        animationIDs = animationIDs.filter(x => x == data.id)
    });

    var frame = 0

    setInterval(async () => {

        await session.send('Animation.seekAnimations', {
            animations: animationIDs,
            currentTime: frame++
        });
    }, 50);



    // Check it out! Fast animations on the "loading..." screen!
    await page.goto(__dirname + '/index.html');
})();