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
                'level-2': '前瞻級合作夥伴'
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

var max_pixel_per_second = 150;
var pixel_per_second = 0;
var container = document.querySelector('.container')
var past = null
var scrollTop = 0


var i, j,
    tags, lastOutTag, nextOutTag

function setup() {
    tags = Array.from(document.querySelectorAll('.tag')).map(tag => {
        tag.anchor = tag.querySelector('.anchor')
        tag.text = tag.querySelector('.text')
        tag.rect = tag.anchor.getBoundingClientRect()
        tag.text.style.top = tag.rect.y + 'px'
        return tag
    })

    //
    // Wait for images to load
    //
    images = Array.from(document.querySelectorAll('img'))
    images.map(img => {
        img.addEventListener('load', () => {
            img.done = true

            if (images.every(x => x.done)) {
                update()
                container.classList.add('done')
            }
        })
    })
}

function update() {
    if (pixel_per_second < max_pixel_per_second) pixel_per_second++
    requestAnimationFrame(update)


    //
    // 讓標籤會卡在最上面
    //

    tags.map(tag => {
        tag.classList.remove('fixed')
        tag.rect = tag.anchor.getBoundingClientRect()
        tag.text.style.top = tag.rect.y + 'px'
        return tag
    })

    // tags.sort((a, b) => a.rect.y - b.rect.y)

    lastOutTag = null
    nextOutTag = null


    tags.map(tag => {
        if (tag.rect.y < 0) lastOutTag = tag
        else if (nextOutTag == null) nextOutTag = tag
    }).pop()

    if (lastOutTag) {
        lastOutTag.classList.add('fixed')
        lastOutTag.text.style.top = '0px'
    }


    if (nextOutTag && lastOutTag) {
        lastOutTag.text.style.top = Math.min(
            0, nextOutTag.rect.y - nextOutTag.rect.height
        ) + 'px'
    }

}