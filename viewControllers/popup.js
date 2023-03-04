// 使用react 控制dom
const e = React.createElement;

// 与 background 建立连接
const port = chrome.runtime.connect(chrome.runtime.id);

class PopupView extends React.Component {
  state = {
    currentGame: undefined,
  };
  componentDidMount() {
    // 向 localstorage 查询插入的 rom
    chrome.storage.local.get(ROM_STORAGE_KEY).then((res) => {
      this.setState({ currentGame: res?.[ROM_STORAGE_KEY] });
    });
  }

  onButtonClick() {
    // 跳转 setting 页面
    window.open(chrome.runtime.getURL("setting.html"));
  }

  render() {
    const e = React.createElement;
    const { currentGame } = this.state;
    return e("div", {
      className: 'popup-root'
    }, [
      // list
      e(
        "div",
        { key: "a" },
        e("div", { className: 'setting-btn', onClick: this.onButtonClick }, "Setting")
      ),
      e("div", { className: "game-view" }, currentGame ? e(Game, { key: "game" }) : null,),
    ]);
  }
}

const domContainer = document.querySelector("#root");
const root = ReactDOM.createRoot(domContainer);
root.render(e(PopupView));
