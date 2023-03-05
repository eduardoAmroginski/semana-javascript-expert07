export default class Controller {
  #view;
  #camera;
  #worker;
  #blinkCounter = 0;
  constructor({ view, worker, camera, videoUrl }) {
    this.#view = view;
    this.#camera = camera;
    this.#worker = this.#configureWorker(worker);

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
    this.#view.setVideoSrc(videoUrl);
  }

  #configureWorker(worker) {
    let ready = false;
    worker.onmessage = ({ data }) => {
      if ("READY" === data) {
        console.log("worker is ready!");
        this.#view.enableButton();
        ready = true;
        return;
      }

      const blinked = data.blinked;
      this.#blinkCounter += blinked;
      this.#view.togglePlayVideo();
      console.log("blinked", blinked);
    };

    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg);
      },
    };
  }

  loop() {
    const video = this.#camera.video;
    const img = this.#view.getVideoFrame(video);
    this.#worker.send(img);
    this.log("Detecting eye blink...");
    setTimeout(() => this.loop(), 100);
  }

  log(text) {
    const times = `          - blinked times: ${this.#blinkCounter}`;
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""));
  }

  onBtnStart() {
    this.log("Initializing detection...");
    this.#blinkCounter = 0;
    this.loop();
  }

  async init() {
    console.log("Init!");
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log("Not yet detecting eye blink! click in the button to start");
    return controller.init();
  }
}
