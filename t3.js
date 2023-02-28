const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const port = chrome.runtime.connect(chrome.runtime.id)

const size = 153600

port.onMessage.addListener(function (data) {
    if (data.type === 'screen') {
        data.data.length = size
        const id = new ImageData(Uint8ClampedArray.from(data.data), 240, 160, { colorSpace: 'srgb' })
        ctx.putImageData(id, 0, 0)

        reqFrame()
    }
})

function postKeyEvent(e) {
    port.postMessage({
        type: 'keyEvent',
        data: {
            type: e.type,
            keyCode: e.keyCode
        }
    })
    e.preventDefault()
}

window.addEventListener("keydown", postKeyEvent, true);
window.addEventListener("keyup", postKeyEvent, true);

function reqFrame() {
    port.postMessage({ type: 'reqFrame' })
}

reqFrame()


