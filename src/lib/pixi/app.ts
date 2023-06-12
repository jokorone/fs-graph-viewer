import { Application, IApplicationOptions} from '@pixi/app'

type PixiAppOptions = {
  canvasEl: HTMLCanvasElement,
}

function createPixiApp(options: PixiAppOptions) {
  const settings: IApplicationOptions = {
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    backgroundColor: 0x353535,
    autoDensity: true,
    view: options.canvasEl,
    antialias: window.devicePixelRatio >= 1,
    resolution: window.devicePixelRatio || 1,
  }

  return new Application(settings);
}

export default createPixiApp;
