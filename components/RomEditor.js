class RoomEditor extends React.Component {
  input = React.createRef();
  componentDidMount() {
    this.getData()

  }

  async getData() {
    const list = await gbaStorage.queryRomByName()
    console.log(list, '??')
  }

  onUploadBtnClick() {
    this.input.current.click();
  }

  async onInputChange(e) {
    console.log(e.target.files[0])
    const name = e.target.files[0].name
    const arrayBuffer = await readFileAsArrayBuffer(e.target.files[0])
    const wa = CryptoJS.lib.WordArray.create(arrayBuffer)
    // console.log(name, arrayBuffer, CryptoJS.MD5.encrypt(arrayBuffer).toString())
    console.log(CryptoJS.MD5(wa).toString())
  }

  onSearch() {

  }

  render() {
    const e = React.createElement;
    return e("div", {}, [
      e("div", { className: 'input-group mb-3' }, [
        e("button", { className: 'btn btn-outline-secondary', onClick: this.onUploadBtnClick.bind(this) }, "上传 Rom"),
        e("input", { className: 'form-control', type: 'text' }),
        e("input", {
          ref: this.input,
          type: "file",
          style: { display: "none" },
          onChange: this.onInputChange.bind(this)
        }),
        e("button", { className: 'btn btn-outline-secondary', onClick: this.onSearch.bind(this) }, "搜索")
      ]),
    ]);
  }
}

function readFileAsArrayBuffer(file) {
  var reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function (e) {
      resolve(e.target.result);
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file);
  })
}

/**
 * <div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2">
  <button class="btn btn-outline-secondary" type="button" id="button-addon2">Button</button>
</div>
 */