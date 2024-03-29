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

const GBA_KEYS = {
  KEYCODE_LEFT: 37,
  KEYCODE_UP: 38,
  KEYCODE_RIGHT: 39,
  KEYCODE_DOWN: 40,
  KEYCODE_START: 13,
  KEYCODE_SELECT: 220,
  KEYCODE_A: 90,
  KEYCODE_B: 88,
  KEYCODE_L: 65,
  KEYCODE_R: 83,
}

var MY_KEYBOARD_MAP = {
  37: 37,
  38: 38,
  39: 39,
  40: 40,
  13: 13,
  220: 220,
  90: 90,
  88: 88,
  65: 65,
  83: 83,
}

async function updateKeyBoard() {
  keys = (await chrome.storage.local.get('gba_key_map'))['gba_key_map'] || GBA_KEYS

  MY_KEYBOARD_MAP = getMapKey(keys)
}

function getMapKey(map) {
  const obj = {}

  Object.entries(map).forEach(([key, value]) => {
    obj[value] = GBA_KEYS[key]
  })

  return obj
}

// 读取
updateKeyBoard()

importScripts(...scripts);

let connection = null;

let currentRom = null;

const gbaStorage = new GbaController();

// connection handler
chrome.runtime.onConnect.addListener(function (port) {
  port.onDisconnect.addListener(function () {
    connection = null;
    gba.pause();

    gbaStorage.updateMemo(
      currentRom.md5,
      GbaController.DEFAULT_ROM_UNAME,
      gba.mmu.save.buffer
    );
  });

  port.onMessage.addListener(async function ({ type }) {
    if (type === "reqFrame") {
      currentRom && connection &&
        connection.postMessage({
          type: "screen",
          data: Array.from(gba.video.renderPath.pixelData.data)
        });
    }
  });
  connection = port;
  if (currentRom) {
    gba.keypad.registerHandlers();
    gba.runStable();
  }

});

// message handler
chrome.runtime.onMessage.addListener(async function (
  { type },
  sender,
  sendResponse
) {
  // 插rom卡
  if (type === "RomChange") {
    await getCurrentRom();

    if (currentRom) {
      const memo = await getMemoCard(currentRom.md5);

      // 加载 memo
      memo.arrayBuffer &&
        runCommands.push(() => {
          gba.setSavedata(memo.arrayBuffer);
        });
    }
    gba.pause();
    gba.reset();
    loadRomFromArrayBuffer(currentRom.arrayBuffer);
  } else if (type === "SaveMemo") {
    // cun
    await gbaStorage.updateMemo(
      currentRom.md5,
      GbaController.DEFAULT_ROM_UNAME,
      gba.mmu.save.buffer
    );
    sendResponse();
  } else if (type === "UpdateKeyBoard") {
    // 按键映射更新
    updateKeyBoard()
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
    await getCurrentRom();

    if (currentRom) {
      const memo = await getMemoCard(currentRom.md5);
      // 加载 memo
      memo.arrayBuffer &&
        runCommands.push(() => {
          gba.setSavedata(memo.arrayBuffer);
        });
      loadRomFromArrayBuffer(currentRom.arrayBuffer);
    }
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

/**
 * 获取当前rom
 */
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

  currentRom = rom;

  return rom;
}

async function getMemoCard(rKey, uName = GbaController.DEFAULT_ROM_UNAME) {
  return await gbaStorage.queryMemoByRomUser(rKey, uName);
}

main();
