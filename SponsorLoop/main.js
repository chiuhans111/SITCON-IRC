
function get(url) {
    let xhr = new XMLHttpRequest()
    xhr.open('get', url)
    return new Promise(done => {
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
        groups: []
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
                'media': '媒體夥伴', 
            }[level]
        }
    }
})



get('https://sitcon.org/2020/json/sponsor.json')
    .then(data => {
        var sponsors = JSON.parse(data)
        var groups = {}
        // 標記每種類別的贊助中的第一位 firstInClass = true
        var lastClass = null
        sponsors.map(x => {
            if (x.level != lastClass) x.firstInClass = true
            else x.firstInClass = false
            lastClass = x.level

            if (groups[x.level] == null) {
                groups[x.level] = {
                    level: x.level,
                    sponsors: []
                }
            }
            groups[x.level].sponsors.push(x)
        })

        app.$data.sponsors = sponsors
        app.$data.groups = Object.keys(groups).map(x => groups[x]).filter(x=>x.sponsors.length>0)

        setTimeout(() => {
            app.$destroy()
            app = null
            setup()
        }, 0)
    })

var max_pixel_per_second = 100
var pixel_per_second = 0
var container = document.querySelector('.container')
var now, past = null
var scrollTop = 0


var i, j,
    delta, move, groups,
    origin, start, end,
    tags, lastOutTag, nextOutTag

function setup() {
    groups = document.querySelectorAll('.group')


    images = Array.from(document.querySelectorAll('img'))
    images.map(img => {
        img.addEventListener('load', () => {
            img.done = true

            if (images.every(x => x.done)) {
                setTimeout(() => {
                    loaded()
                }, 0)
            }
        })
    })
}


function loaded() {
    tags = Array.from(document.querySelectorAll('.tag')).map(tag => {
        tag.anchor = tag.querySelector('.anchor')
        tag.text = tag.querySelector('.text')
        // tag.text.style.top = tag.rect.y + 'px'
        return tag
    })
    reAnchor()
    update()
    container.classList.add('done')
}

function reAnchor() {
    origin = groups[0].getBoundingClientRect().y
    start = groups[1].getBoundingClientRect().y - origin
    end = groups[2].getBoundingClientRect().y - origin

    tags.map(tag => {
        tag.rect = tag.anchor.getBoundingClientRect()
        tag.rect.y += container.scrollTop
    })
}

window.addEventListener('resize', reAnchor)


//
// prepare function

function tag_follow_anchor(tag) {
    tag.classList.remove('fixed')
    tag.y = tag.rect.y - scrollTop
    tag.text.style.transform = `translate(0, ${tag.y}px)`
    return tag
}

function tag_find_last_tag(tag) {
    if (tag.y < 0) lastOutTag = tag
    else if (nextOutTag == null) nextOutTag = tag
}

function update() {
    if (pixel_per_second < max_pixel_per_second) pixel_per_second++
    requestAnimationFrame(update)


    now = Date.now()
    if (past != null) {

        delta = now - past
        delta = Math.max(1, delta)
        delta = Math.min(1000, delta)

        move = delta * pixel_per_second / 1000
        scrollTop += move

        //
        // Loop Back
        //


        if (scrollTop < start) {
            scrollTop = end - scrollTop + start
        }
        if (scrollTop > end) {
            scrollTop = start + scrollTop - end
        }
        //
        // Apply movement
        //

        container.scrollTop = Math.round(scrollTop)
    }
    past = now

    //
    // 讓標籤會卡在最上面
    //

    tags.map(tag_follow_anchor)

    // tags.sort((a, b) => a.rect.y - b.rect.y)

    lastOutTag = null
    nextOutTag = null


    tags.map(tag_find_last_tag)

    if (lastOutTag) {
        lastOutTag.classList.add('fixed')
        lastOutTag.text.style.transform = `translate(0,0)`
    }


    if (nextOutTag && lastOutTag) {
        lastOutTag.text.style.transform = `translate(0, ${
            Math.min(
                0, nextOutTag.y - nextOutTag.rect.height
            )}px`

    }
}