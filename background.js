const scripts = [
    'js/util.js',
    'js/core.js',
    'js/arm.js',
    'js/thumb.js',
    'js/mmu.js',
    'js/io.js',
    'js/audio.js',
    'js/video.js',
    'js/video/proxy.js',
    'js/video/software.js',
    'js/irq.js',
    'js/keypad.js',
    'js/sio.js',
    'js/savedata.js',
    'js/gpio.js',
    'js/gba.js',
    'resources/xhr.js'
]

importScripts(...scripts)

let connection = null

chrome.runtime.onConnect.addListener(function (port) {
    port.onDisconnect.addListener(function () {
        connection = null
        gba.pause();
    })

    port.onMessage.addListener(function({type}){
        if (type === 'reqFrame') {
            connection && connection.postMessage({
                type: 'screen',
                data: gba.video.renderPath.pixelData.data
            })
        }
    })
    connection = port
    gba.keypad.registerHandlers();
    gba.runStable();
})

var gba;
var runCommands = [];
var debug = null;

try {
    gba = new GameBoyAdvance();
    gba.keypad.eatInput = true;
    gba.setLogger(function (level, error) {
        console.log(error);
        gba.pause();
    });

} catch (exception) {
    console.log('exceptionz', exception)
    gba = null;
}

if (gba && FileReader) {
    var canvas = new OffscreenCanvas(240, 160)
    gba.setCanvas(canvas);

    gba.logLevel = gba.LOG_ERROR;

    loadRom('resources/bios.bin', function (bios) {
        gba.setBios(bios);
    });

    // 加载rom

    testLoad()
}

function testLoad() {
    loadRom('rom/emerald.gba', function (file) {
        gba.loadRomFromFile(file, function (result) {
            if (result) {
                for (var i = 0; i < runCommands.length; ++i) {
                    runCommands[i]();
                }
                runCommands = [];
            } else {
                console.log('testLoad fail')
            }
        });
    })
}
