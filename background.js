const scripts = [
  "constants.js",
  "js/util.js",
  "js/core.js",
  "js/arm.js",
  "js/thumb.js",
  "js/mmu.js",
  "js/io.js",
  "js/audio.js",
  "js/video.js",
  "js/video/proxy.js",
  "js/video/software.js",
  "js/irq.js",
  "js/keypad.js",
  "js/sio.js",
  "js/savedata.js",
  "js/gpio.js",
  "js/gba.js",
  "resources/xhr.js",
  "indexeddb/Tools.js",
  "indexeddb/Migrate.js",
  "indexeddb/Controller.js",
];

importScripts(...scripts);

let connection = null;

let currentRom = null;

const gbaStorage = new GbaController();

// connection handler
chrome.runtime.onConnect.addListener(function (port) {
  port.onDisconnect.addListener(function () {
    connection = null;
    gba.pause();
  });

  port.onMessage.addListener(async function ({ type }) {
    if (type === "reqFrame") {
      connection &&
        connection.postMessage({
          type: "screen",
          data: gba.video.renderPath.pixelData.data.toString(),
        });
    }
  });
  connection = port;
  gba.keypad.registerHandlers();
  gba.runStable();
});

// message handler
chrome.runtime.onMessage.addListener(async function ({ type }) {
  if (type === "RomChange") {
    const rom = await getCurrentRom();

    // 加载游戏
    currentRom = rom;

    gba.reset();
    loadRomFromArrayBuffer(currentRom.arrayBuffer);
  }
});

var gba;
var runCommands = [];
var debug = null;

async function main() {
  try {
    gba = new GameBoyAdvance();
    gba.keypad.eatInput = true;
    gba.setLogger(function (level, error) {
      console.log(error);
      gba.pause();
    });
  } catch (exception) {
    console.log("exceptionz", exception);
    gba = null;
  }

  if (gba && FileReader) {
    var canvas = new OffscreenCanvas(240, 160);
    gba.setCanvas(canvas);

    gba.logLevel = gba.LOG_ERROR;

    loadRom("resources/bios.bin", function (bios) {
      gba.setBios(bios);
    });
    const rom = await getCurrentRom();
    loadRomFromArrayBuffer(rom.arrayBuffer);
  }
}

function loadRomFromArrayBuffer(buf) {
  gba.loadRomFromFile(buf, function (result) {
    if (result) {
      for (var i = 0; i < runCommands.length; ++i) {
        runCommands[i]();
      }
      runCommands = [];
    } else {
      console.log("testLoad fail");
    }
  });
}

async function getCurrentRom() {
  const rKey = (await chrome.storage.local.get(ROM_STORAGE_KEY))[
    ROM_STORAGE_KEY
  ];

  if (!rKey) {
    currentRom = null;
    gba.reset();
    return;
  }

  // 从 indexeddb 中读取 rom 的 arrayBuffer
  const rom = await gbaStorage.queryRomByMd5(rKey);

  return rom;
}

main();
