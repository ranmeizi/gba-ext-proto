const KEY_CODES = {
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    32: 'SPACE',
    37: 'LEFT',
    13: 'ENTER',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    220: '|',
}

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

const DEFAULT_MAP = {
    [GBA_KEYS.KEYCODE_LEFT]: 37,
    [GBA_KEYS.KEYCODE_UP]: 38,
    [GBA_KEYS.KEYCODE_RIGHT]: 39,
    [GBA_KEYS.KEYCODE_DOWN]: 40,
    [GBA_KEYS.KEYCODE_START]: 13,
    [GBA_KEYS.KEYCODE_SELECT]: 220,
    [GBA_KEYS.KEYCODE_A]: 90,
    [GBA_KEYS.KEYCODE_B]: 88,
    [GBA_KEYS.KEYCODE_L]: 65,
    [GBA_KEYS.KEYCODE_R]: 83,
}

async function saveKeyMap(map) {
    await chrome.storage.local.set({ gba_key_map: map });
}

async function loadKeyMap() {
    return  await chrome.storage.local.get('gba_key_map')['gba_key_map'] || MY_KEYBOARD_MAP
}

class KeyMapEditor extends React.Component {

    state = {
        keyMapData: {
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
        },
        editKey: ''
    };

    componentDidMount() {
        this.getData();

        document.getElementById('keyboard-modal').addEventListener('hidden.bs.modal', event => {
            console.log('hide')
            this.setState({ editKey: '' })
        })
    }

    async getData() {
        this.setState({
            keyMapData: await loadKeyMap()
        })
    }

    setKey(key, value) {
        if (value in KEY_CODES) {
            return
        }
    }

    // 保存 keymap
    async updateData() {
        await saveKeyMap(this.state.keyMapData);
        // 发射更新事件
        chrome.runtime.sendMessage(
            {
                type: "UpdateKeyBoard",
                data: this.state.keyMapData
            },
        );
    }

    onSetKey = (v) => {
        console.log(this.state.editKey)
        if (!this.state.editKey) {
            return
        }

        this.setState({
            keyMapData: {
                ...this.state.keyMapData,
                [this.state.editKey]: v,
            }
        }, this.updateData)
    }

    render() {
        const e = React.createElement;
        const { keyMapData } = this.state;
        console.log(keyMapData)
        return e("div", { className: "mt-3" }, [
            e("div", { className: "mt-3" }, [
                Object.entries(keyMapData).map(([key, value]) => {
                    return e(FormInput, { label: key, value: value, onClick: () => this.setState({ editKey: key }) })
                })
            ]),
            e(KeyInputMask, { current: this.editKey, onChange: this.onSetKey }),
        ]);
    }
}

// FormInput 

class FormInput extends React.Component {

    render() {
        const e = React.createElement;
        const { label, value, onClick } = this.props;
        return e("div", { className: "form-group" }, [
            e("div", { className: "form-label" }, label),
            e("button", { onClick, className: "btn btn-primary", "data-bs-toggle": "modal", "data-bs-target": "#keyboard-modal" }, KEY_CODES[value] || '--')
        ]);
    }
}

class KeyInputMask extends React.Component {
    state = {
        keyName: ''
    }

    modal

    componentDidMount() {
        this.modal = new bootstrap.Modal('#keyboard-modal', {
            keyboard: false
        })

        document.getElementById('keyboard-modal').addEventListener('shown.bs.modal', event => {
            window.addEventListener('keydown', this.onKeyDown)
            window.addEventListener('keyup', this.onKeyUp)
        })

    }

    onKeyDown = (e) => {
        this.setState({ keyName: KEY_CODES[e.keyCode] })
    }
    onKeyUp = (e) => {
        this.modal.hide()
        this.setState({ keyName: '' })
        this.props.onChange && this.props.onChange(e.keyCode)
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
    }

    render() {
        const e = React.createElement;
        const { keyName } = this.state;
        return e("div", { className: "modal fade", id: 'keyboard-modal', tabindex: -1, "aria-labelledby": "keyboard-modal-label", "aria-hidden": "true" },
            e("div", { className: "modal-dialog f-c a-center" }, [
                e("div", { style: { fontSize: '50px', color: '#fff' } }, '请按下按键...'),
                e("div", { style: { fontSize: '24px', color: '#ccc', marginTop: '64px' } }, keyName || '请按下按键...')
            ])
        );
    }
}