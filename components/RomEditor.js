class RoomEditor extends React.Component {
  input = React.createRef();
  componentDidMount() {}

  onUploadBtnClick() {
    this.input.current.click();
  }

  render() {
    const e = React.createElement;
    return e("div", {}, [
      e("div", {}, [
        e("button", { onClick: this.onUploadBtnClick.bind(this) }, "上传 Rom"),
        e("input", {
          ref: this.input,
          type: "file",
          style: { display: "none" },
        }),
      ]),
    ]);
  }
}
