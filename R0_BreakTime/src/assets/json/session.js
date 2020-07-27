import session from './session.json'

function TimeProcess(date) {
    let d = new Date(date)
    let h = d.getHours().toString()
    let m = d.getMinutes().toString()
    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m
    return `${h}:${m}`
}


var data = { session: {} , TimeProcess}




function setSession() {
    data.session.speakers.map(x => {
        x.zh.bio = x.zh.bio.split("\n")
    })

    data.rooms = data.session.rooms.map(room => {
        room.sessions = data.session.sessions
            .filter(s => s.room == room.id)
            .map(s => {
                s.startTime = TimeProcess(s.start)
                s.endTime = TimeProcess(s.end)
                s.start = new Date(s.start).getTime()
                s.end = new Date(s.end).getTime()
                s.speakers = s.speakers
                    .map(p => {
                        return data.session.speakers.filter(x => x.id == p)[0]
                    })
                    .filter(x => x != null)

                s.description = s.zh.description.split("\n")
                return s
            })
            .sort((a, b) => {
                return a.start - b.start
            })
        return room
    })
}


data.session = session
setSession()


var xhr = new XMLHttpRequest()


xhr.open('get', 'https://sitcon.org/2020/json/session.json')

xhr.onload = function () {
    data.session = JSON.parse(xhr.response)
    setSession()
}

xhr.send()
export default data