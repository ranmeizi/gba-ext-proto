// 使用react 控制dom
const e = React.createElement;

// 与 background 建立连接
const port = chrome.runtime.connect(chrome.runtime.id);

class PopupView extends React.Component {
  state = {
    currentGame: "",
  };
  componentDidMount() {
    // 向 localstorage 查询插入的 rom
  }

  onButtonClick() {
    // 跳转 setting 页面
    window.open(chrome.runtime.getURL("setting.html"));
  }

  render() {
    const e = React.createElement;
    const { currentGame } = this.state;
    return e("div", {}, [
      // list
      e(
        "div",
        { key: "a" },
        e("button", { onClick: this.onButtonClick }, "插入rom")
      ),
      e("div", { key: "b" }, e("div", {}, "您在玩？")),
      // 看background有没有正在运行的游戏
      currentGame ? e(Game, { key: "game" }) : null,
    ]);
  }
}

const domContainer = document.querySelector("#root");
const root = ReactDOM.createRoot(domContainer);
root.render(e(PopupView));
