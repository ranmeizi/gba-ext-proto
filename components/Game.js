let lastFrameTs = Date.now();

class Game extends React.Component {
  el = React.createRef();
  componentDidMount() {
    const canvas = this.el.current;
    const ctx = canvas.getContext("2d");

    port.onMessage.addListener(function (data) {
      if (data.type === "screen") {
        const id = new ImageData(
          Uint8ClampedArray.from(data.data),
          240,
          160,
          { colorSpace: "srgb" }
        );
        ctx.putImageData(id, 0, 0);
      }
    });

    function postKeyEvent(e) {
      port.postMessage({
        type: "keyEvent",
        data: {
          type: e.type,
          keyCode: e.keyCode,
        },
      });
      e.preventDefault();
    }

    window.addEventListener("keydown", postKeyEvent, true);
    window.addEventListener("keyup", postKeyEvent, true);

    function reqFrame() {
      try{
        port.postMessage({ type: "reqFrame" });
      }catch{}
      
      requestAnimationFrame(reqFrame)
    }

    reqFrame()

  }
  render() {
    return e("canvas", { className: 'gba-canvas', ref: this.el, width: 240, height: 160 });
  }
}
