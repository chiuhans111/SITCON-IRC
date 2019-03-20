var electron, webcontent, fs
var frameCount = 0
var frameRate = 24
var timeScale = 1


var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}


try {
    electron = require('electron')
    webcontent = electron.remote.getCurrentWebContents()
    fs = require('fs')
    electron.remote.getCurrentWindow().setContentSize(1920 / 1, 1080 / 1)
} catch (e) {
    console.log('you are not using electron')
    timeScale = 1
}



function get(url) {
    console.log('get', url)
    let xhr = new XMLHttpRequest()
    xhr.open('get', url)
    return new Promise(done => {
        console.log('done', url)
        xhr.onload = function () {
            done(xhr.response)
        }
        xhr.send()
    })
}



var app = new Vue({
    el: '#app',
    data: {
        sponsors: [],
        staff: [],
        individual: [],
    },
    methods: {
        level2name(level) {
            return {
                'holder': "主辦單位",
                'co-holder': "共同主辦",
                'co-organizer': '協辦單位',
                'level-1': '深耕級合作夥伴',
                'level-2': '前瞻級合作夥伴',
                'level-3': '新芽級合作夥伴',
                'thank': '特別感謝',

            }[level]
        }
    }
})

Promise.all([
    get('https://raw.githubusercontent.com/sitcon-tw/2019/master/static/json/sponsor.json'),
    get('https://raw.githubusercontent.com/sitcon-tw/2019/master/static/json/staff.json'),
    get('https://raw.githubusercontent.com/sitcon-tw/2019/master/static/json/individual-sponsor.json')
]).then(function (data) {
    var [sponsors, staff, individual] = data.map(x => JSON.parse(x))

    console.log(sponsors)

    //
    // SPONSORS
    //
    // 標記每種類別的贊助中的第一位 firstInClass = true
    var lastClass = null
    sponsors.map(x => {
        if (x.level != lastClass) x.firstInClass = true
        else x.firstInClass = false
        lastClass = x.level
    })
    app.$data.sponsors = sponsors

    //
    // STAFF
    //
    app.$data.staff = staff

    //
    // INDIVIDUAL
    //
    app.$data.individual = individual


    //
    // DISTROY VUE AFTER RENDER
    //
    setTimeout(() => {
        app.$destroy()
        setup()
    }, 0)
})

var max_pixel_per_second = 3;
if (electron == null) max_pixel_per_second = 0;
var pixel_per_second = 0;
var container = document.querySelector('.container')
var past = null
var scrollTop = 0


var i, j,
    tags, lastOutTag, nextOutTag,
    images, delayshows, rollings


function setup() {
    appelement = document.querySelector('#app')


    // tags = Array.from(document.querySelectorAll('.tag')).map(tag => {
    //     tag.anchor = tag.querySelector('.anchor')
    //     tag.text = tag.querySelector('.text')
    //     tag.rect = tag.anchor.getBoundingClientRect()
    //     tag.text.style.top = tag.rect.y + 'px'
    //     return tag
    // })



    //
    // register delay show
    //
    delayshows = Array.from(document.querySelectorAll('.delay-show'))

    //
    // fill rolling text with enough text
    //
    Array.from(document.querySelectorAll('.rolling-group *')).map(x => {
        x.textContent = x.textContent.repeat(Math.ceil(200 / (x.textContent.length + 1)))
    })

    rollings = Array.from(document.querySelectorAll('.rolling-container'))


    if (electron != null)
        Array.from(document.querySelectorAll('*')).map(element => {
            element.style.transitionDuration = parseInt(getComputedStyle(element).transitionDuration) * timeScale + 's'
            element.style.animationDuration = parseInt(getComputedStyle(element).animationDuration) * timeScale + 's'
        })
    //
    // Wait for images to load
    //
    images = Array.from(document.querySelectorAll('img'))
    images = images.map(target => {
        let obj = { src: target.src }
        let img = document.createElement('img')
        img.src = target.src
        img.addEventListener('load', () => {
            obj.done = true
            // console.log('loaded', img.src, images.filter(x => !x.done))
            if (images.every(x => x.done)) {
                setTimeout(() => {
                    loaded()
                }, 0);
            }
        })
        return obj;
    })

}


function loaded() {
    appelement.scrollTop = 0

    // delay show anchor
    delayshows.map(x => {
        x.x = x.getBoundingClientRect().x
        x.y = x.getBoundingClientRect().y + appelement.scrollTop
        x.h = x.getBoundingClientRect().height
        x.delaysequence = x.classList.contains('delay-sequence')
    })

    // rollings anchor
    rollings.map(x => {
        x.y = x.getBoundingClientRect().y + appelement.scrollTop
    })


    // basic setup and start
    container.classList.add('done')
    if (electron != null) {
        electron.ipcRenderer.on('render', function () {
            requestAnimationFrame(update)
        })
        electron.ipcRenderer.send('ready')
    } else
        setTimeout(() => {
            update()
        }, 0);
}

var now, past

//
// PREPARE FUNCTION
//

// DELAY SHOW
function delayShowing(x) {
    //rect = x.getBoundingClientRect()
    let rect = {
        x: x.x,
        y: x.y - scrollTop,
        height: x.h
    }

    let offset = 0;
    if (x.delaysequence) {
        offset = rect.x / innerWidth
    }
    if (rect.height < innerHeight / 6) rect.height = innerHeight / 6
    let max = innerHeight - rect.height * offset // less than this, start to showup
    let min = innerHeight - rect.height - rect.height * offset // less than this, fully shown
    let f = Math.max(0, Math.min(1, (rect.y - min) / (max - min)))
    f = EasingFunctions.easeInOutCubic(f)

    x.style.transform = `scale(${f + 1})`
    x.style.opacity = 1 - f

    // if (rect.y < innerHeight - rect.height / 2) {
    //     if (x.classList.contains('delay-sequence')) {
    //         x.style.transitionDelay = (rect.x / innerWidth * 0.5 + 0.1) * timeScale + 's'
    //     }
    //     x.classList.add('show')
    // }
}

var filterDelayShows = function (x) {
    return !x.classList.contains('show')
}

// ROLLING
function parallexEffect(x) {
    //rect = x.parentNode.getBoundingClientRect()
    rect = {
        y: x.y - scrollTop
    }
    x.style.transform = `translate(0, ${(innerHeight / 3 - rect.y) / 3}px )`
}

function rollingEffect(x) {
    rect = {
        y: x.y - scrollTop
    }


    var containers = Array.from(x.querySelectorAll('.rolling-group'))
    var f = rect.y / 30000 % 1
    while (f < 0) f += 1;
    containers.map((y, i) => {
        var offset = f * 50
        if (i % 2 == 0) offset = 50 - offset
        y.style.transform = `translate(${-offset}%,0)`

    })


}


//
// UPDATE
//


function update() {
    // console.log('update')
    // now = performance.now()


    if (pixel_per_second < max_pixel_per_second) pixel_per_second++
    else pixel_per_second = max_pixel_per_second

    appelement.scrollTop += max_pixel_per_second
    scrollTop = appelement.scrollTop

    if (scrollTop >= appelement.scrollHeight - innerHeight) {
        if (electron != null) window.close()
    }


    // console.log('update')

    //
    // 顯示延遲顯示的物件
    //
    // delayshows = delayshows.filter(filterDelayShows)

    delayshows.map(delayShowing)

    //
    // ROLLINGS
    // 
    rollings.map(parallexEffect)
    rollings.map(rollingEffect)


    //
    // 讓標籤會卡在最上面
    //

    // tags.map(tag => {
    //     tag.classList.remove('fixed')
    //     tag.rect = tag.anchor.getBoundingClientRect()
    //     tag.text.style.top = tag.rect.y + 'px'
    //     return tag
    // })

    // // tags.sort((a, b) => a.rect.y - b.rect.y)

    // lastOutTag = null
    // nextOutTag = null


    // tags.map(tag => {
    //     if (tag.rect.y < 0) lastOutTag = tag
    //     else if (nextOutTag == null) nextOutTag = tag
    // }).pop()

    // if (lastOutTag) {
    //     lastOutTag.classList.add('fixed')
    //     lastOutTag.text.style.top = '0px'
    // }


    // if (nextOutTag && lastOutTag) {
    //     lastOutTag.text.style.top = Math.min(
    //         0, nextOutTag.rect.y - nextOutTag.rect.height
    //     ) + 'px'
    // }

    //
    // capture screen
    //
    // if (past == null) past = now
    // if (webcontent != null) {
    //     console.log(frameCount / (now - past) * 1000 * timeScale)
    //     if (frameCount / (now - past) * 1000 * timeScale <= frameRate) {
    //         appelement.scrollTop += max_pixel_per_second

    //         // webcontent.capturePage(image => {
    //         //     fs.writeFileSync('./render/' + frameCount.toString().padStart(5, '0') + '.jpg', image.toJPEG(80))
    //         // })
    //         frameCount++
    //     }
    // } else {

    // }

    if (electron != null) {
        requestAnimationFrame(function(){
            setTimeout(() => {
                electron.ipcRenderer.send('e_render')
            }, 0);
        })
    } else requestAnimationFrame(update)
}

