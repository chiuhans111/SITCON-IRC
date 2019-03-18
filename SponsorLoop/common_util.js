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