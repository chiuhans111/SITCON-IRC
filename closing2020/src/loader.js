function get(url) {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url)
    return new Promise(done => {
        xhr.send()
        xhr.onload = function () {
            done(JSON.parse(xhr.response))
        }
    })
}

var data = {
    staff: {},
    speakers: {},
    sponsor: {}
}

var thanks = [
    "王X明", "王X明", "王X明", "王X明", "王X明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
    "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明", "王曉明",
]


Promise.all([
    get('https://sitcon.org/2020/json/staff.json'),
    get('https://sitcon.org/2020/json/session.json'),
    get('https://sitcon.org/2020/json/sponsor.json'),
    new Promise(done => done(thanks))

]).then(([staff, session, sponsor, thanks]) => {

    data.staff = staff
    data.speakers = session.speakers.sort((a, b) => {
        return a.zh.name.localeCompare(b.zh.name, "zh-Hant")
    }).map(x => {
        x.zh.name = x.zh.name.replace(/.+\s-\s/g, '')
        return x
    })

    let sponsorGroups = {}
    sponsor.map(x => {
        if (sponsorGroups[x.level] == null)
            sponsorGroups[x.level] = []
        sponsorGroups[x.level].push(x)
    })
    data.sponsor = Object.keys(sponsorGroups).map(key => ({
        level: key,
        sponsors: sponsorGroups[key]
    }))


    data.thanks = thanks
})



export default data

