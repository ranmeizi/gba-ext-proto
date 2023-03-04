// 使用react 控制dom
const e = React.createElement;

const gbaStorage = new GbaController();

/**
 * setting 页面用于
 * 1.在 localstorage 中创建用户 (先不做)
 * 2.在 indexeddb 中 插入 rom
 */
class SettingView extends React.Component {
  state = {};

  render() {
    const e = React.createElement;
    return e("div", {}, [
      //  nav
      e(
        "nav",
        { className: "navbar bg-body-tertiary" },
        e("div", { className: "container-fluid" }, [
          e(
            "div",
            { className: "navbar-brand mb-0 h1" },
            "GBA Extension Setting"
          ),
          e(
            "a",
            {
              className: "navbar-brand",
              href: "https://github.com/ranmeizi/gba-ext-proto",
              style: {
                background: "black",
                color: "#fff",
                borderRadius: "30px",
                overflow: "hidden",
                fontSize: "14px",
                padding: "0 12px 0 4px",
              },
            },
            e("img", {
              src: "/resources/github-icon.jpg",
              style: {
                height: "30px",
                width: "30px",
              },
            }),
            "github"
          ),
        ])
      ),
      //  container
      e("div", { className: "container" }, e(RoomEditor)),
    ]);
  }
}

const domContainer = document.querySelector("#root");
const root = ReactDOM.createRoot(domContainer);
root.render(e(SettingView));

/**
 * 
 * <a class="navbar-brand" href="#">
      <img src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Bootstrap" width="30" height="24">
    </a>
 */
// https://github.com/ranmeizi/gba-ext-proto
