function get(url) {
    console.log('get', url)
    let xhr = new XMLHttpRequest()
    xhr.open('get', url)
    return new Promise(done => {
        console.log('done', url)
        xhr.onload = function () {
            done(JSON.parse(xhr.response))
        }
        xhr.send()
    })
}

function TimeProcess(date) {
    let d = new Date(date)
    let h = d.getHours().toString()
    let m = d.getMinutes().toString()
    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m
    return `${h}:${m}`
}




var app = new Vue({
    el: "#app",
    data: {
        name: "hi",
        session: {},
        title: "",
        desc: "",
        speakers: [],
        start: "",
        end: "",
        type: "",
        tags: []

    }
})


function md2html(md) {
    var lines = md.split('\n').filter(x => x.trim().length > 0)
    return lines.map(x => {
        var match_header = x.match(/^(#+)\s(.*)$/)
        console.log(match_header)
        if (match_header) {
            var header_num = match_header[1].length
            var header_content = match_header[2]
            return `<h${header_num}>${header_content}</h${header_num}>`
        }

        return `${x}`
    }).join('</br>')
}

get('https://sitcon.org/2020/json/session.json').then(function (data) {

    console.log(data)

    app.$data.session = data


    function set(i) {
        i = i % data.sessions.length
        var session = data.sessions[i]



        console.log("current session", session)

        app.$data.title = session.zh.title
        app.$data.desc = md2html(session.zh.description)


        var speakers = session.speakers

        var speakers_table = {}
        data.speakers.map(speaker => {
            speakers_table[speaker.id] = speaker
        })

        app.$data.speakers = speakers.map(speaker_id => {
            var speaker = speakers_table[speaker_id]
            var name = speaker.zh.name
            var bio = md2html(speaker.zh.bio)
            var avatar = speaker.avatar

            return {
                name, bio, avatar
            }
        })

        app.$data.start = TimeProcess(session.start)
        app.$data.end = TimeProcess(session.end)

        var types_table = {}
        data.session_types.map(type => {
            types_table[type.id] = type
        })

        app.$data.type = types_table[session.type].zh.name


        var tags_table = {}
        data.tags.map(tag => {
            tags_table[tag.id] = tag
        })


        app.$data.tags = session.tags.map(x => tags_table[x].zh.name)

        room = session.room
        start = app.$data.start.replace(":","")
        end = app.$data.end.replace(":","")

        setTimeout(() => {
            pup_render(room+"_"+start+"_"+end+"_"+app.$data.title.replace(/[？?\n\s]/g,'_')).then(function () {
                setTimeout(() => {
                    set(i + 1)
                }, 100)
            })
        }, 100)
    }

    set(0)


})
