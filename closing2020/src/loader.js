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


Promise.all([
    get('https://sitcon.org/2020/json/staff.json'),
    get('https://sitcon.org/2020/json/session.json'),
    get('https://sitcon.org/2020/json/sponsor.json')
]).then(([staff, session, sponsor]) => {

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
    data.sponsor = Object.keys(sponsorGroups).map(key=>({
        level: key,
        sponsors: sponsorGroups[key]
    }))
})



export default data

