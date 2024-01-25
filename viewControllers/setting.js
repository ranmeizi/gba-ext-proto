// 使用react 控制dom
const e = React.createElement;

const gbaStorage = new GbaController();

/**
 * setting 页面用于
 * 1.在 localstorage 中创建用户 (先不做)
 * 2.在 indexeddb 中 插入 rom
 */
class SettingView extends React.Component {
  state = {
    current: 'rom-editor'
  };

  render() {
    const e = React.createElement;
    const { current } = this.state
    return e("div", {}, [
      //  nav
      e(
        "nav",
        { className: "navbar navbar-expand-lg bg-body-tertiary" },
        e("div", { className: "container-fluid" }, [
          e(
            "div",
            { key: '1', className: "navbar-brand mb-0 h1" },
            "GBA Extension Setting"
          ),
          e(
            "div",
            { key: '2', className: 'collapse navbar-collapse' },
            e(
              "ul",
              { className: "navbar-nav me-auto mb-2 mb-lg-0" },
              [
                e('li', { key: 'rom-editor', className: 'nav-item', onClick: () => { this.setState({ current: 'rom-editor' }) } },
                  e('a', { className: `nav-link pointer ${current === 'rom-editor' ? 'active' : ''}` }, 'Rom设置')
                ),
                e('li', { key: 'key-editor', className: 'nav-item', onClick: () => { this.setState({ current: 'key-editor' }) } },
                  e('a', { className: `nav-link pointer ${current === 'key-editor' ? 'active' : ''}` }, '键盘设置')
                )
              ]
            )
          ),
          e(
            "a",
            {
              key:'3',
              className: "navbar-brand pointer",
              href: "https://github.com/ranmeizi/gba-ext-proto",
              target:'blank',
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
              key:'4',
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
      e("div", { className: "container" }, [
        this.state.current === 'rom-editor' && e(RomEditor,{key:'rom'}),
        this.state.current === 'key-editor' && e(KeyMapEditor,{key:'key'}),
      ]),
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
