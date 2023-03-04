class RoomEditor extends React.Component {
  input = React.createRef();

  state = {
    list: [],
    currentRom: "",
  };

  componentDidMount() {
    this.getData();

    // 当前rom
    chrome.storage.local.get(ROM_STORAGE_KEY).then((res) => {
      this.setState({
        currentRom: res[ROM_STORAGE_KEY],
      });
    });
  }

  async getData() {
    const list = await gbaStorage.queryRomByName();

    this.setState({ list });
  }

  onUploadBtnClick() {
    this.input.current.click();
  }

  async onInputChange(e) {
    try {
      await gbaStorage.addRom(e.target.files[0]);
      alert("添加成功");

      // 重新获取列表
      this.getData();
    } catch (e) {
      alert("添加失败");
      console.warn("add rom", e);
    }
  }

  onSearch() { }

  /**
   * 传递 rom md5 值至 记忆卡管理
   */
  openMemoManager(rKey) { }

  /**
   * 插入 rom 卡
   * 1. 在 storage.local 中存储 rKey
   * 2. 通知 background 加载 rom
   */
  async putRomInGba(rKey) {
    this.setState({ currentRom: rKey });

    await chrome.storage.local.set({ [ROM_STORAGE_KEY]: rKey });

    chrome.runtime.sendMessage({
      type: "RomChange",
    });
  }

  /**
   * 删除 rom 存储
   */
  async delRom(rKey) {
    if (confirm("确定删除 rom 吗？")) {
      console.log("QUEDING", gbaStorage.delRom);
      await gbaStorage.delRom(rKey);
      this.getData();
    }
  }

  /**
   * 按照当前用户存储当前rom记忆卡
   * 1. 获取当前用户
   * 2. 通知 background 也
   */
  updateMemoCard() {
    chrome.runtime.sendMessage(
      {
        type: "SaveMemo",
      },
      function () {
        alert("保存成功");
      }
    );
  }

  render() {
    const e = React.createElement;
    const { list, currentRom } = this.state;
    return e("div", { className: "mt-3" }, [
      e("div", { className: "input-group mb-3" }, [
        e(
          "button",
          {
            className: "btn btn-outline-secondary",
            onClick: this.onUploadBtnClick.bind(this),
          },
          "上传 Rom"
        ),
        e("input", { className: "form-control", type: "text" }),
        e("input", {
          ref: this.input,
          type: "file",
          style: { display: "none" },
          onChange: this.onInputChange.bind(this),
        }),
        e(
          "button",
          {
            className: "btn btn-outline-secondary",
            onClick: this.onSearch.bind(this),
          },
          "搜索"
        ),
      ]),
      e(
        "small",
        { className: "text-muted" },
        "注意！！ 切换 rom 会丢失当前存档，请确保切换 rom 之前保存您的记忆卡 (程序不会自动帮您保存，起码这版本不会)"
      ),
      e(
        "div",
        { className: "list-group" },
        list.map((item) => {
          return e(
            "a",
            {
              className: `list-group-item list-group-item-action ${currentRom === item.md5 ? "bg-primary-subtle" : ""
                }`,
            },
            [
              e("div", { className: "d-flex w-100 justify-content-between" }, [
                e("h5", { className: "mb-1" }, item.name),
                e("small", { className: "mb-1" }, "3 days ago"),
              ]),
              e("div", { className: "mb-1" }, [
                e(
                  "button",
                  { className: "btn btn-primary btn-sm me-2", disabled: true },
                  "查看记忆卡"
                ),
                // 当前rom 才可以保存记忆卡
                ...(currentRom === item.md5
                  ? [
                    e(
                      "button",
                      {
                        className: "btn btn-primary btn-sm me-2",
                        onClick: this.updateMemoCard.bind(this),
                      },
                      "保存记忆卡"
                    ),
                    e(
                      "button",
                      {
                        className: "btn btn-warning btn-sm me-2",
                        onClick: () => this.putRomInGba(""),
                      },
                      "弹出Rom"
                    ),
                  ]
                  : [
                    e(
                      "button",
                      {
                        className: "btn btn-danger btn-sm me-2",
                        onClick: () => this.delRom(item.md5),
                      },
                      "删除Rom"
                    ),
                    e(
                      "button",
                      {
                        className: "btn btn-success btn-sm me-2",
                        onClick: () => this.putRomInGba(item.md5),
                      },
                      "选择Rom"
                    ),
                  ]),
              ]),
            ]
          );
        })
      ),
    ]);
  }
}

function readFileAsArrayBuffer(file) {
  var reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
