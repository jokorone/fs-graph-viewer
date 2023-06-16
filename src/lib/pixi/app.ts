import { Application, IApplicationOptions} from '@pixi/app'
import * as utils from '@pixi/utils';
import { settings as PIXI } from '@pixi/settings';
import { ENV } from '@pixi/constants';

type PixiAppOptions = {
  element: HTMLCanvasElement,
}

function createPixiApp(options: PixiAppOptions) {
  // const {width, height} = options.canvasEl.getBoundingClientRect();
  // console.log('createPixiApp', width, height);

  const settings: IApplicationOptions = {
    // width: window.innerWidth,
    // height: window.innerHeight,
    // width, height,
    // resizeTo: options.element,
    backgroundColor: 0x353535,
    autoDensity: true,
    view: options.element,
    antialias: window.devicePixelRatio >= 1,
    resolution: window.devicePixelRatio || 1,
    // forceCanvas: !isWebGLSupported(),
  }

  // const isSafari = window.safari !== undefined;
  // if(isSafari){
  //     PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL;
  // }

  // PIXI.PREFER_ENV = ENV.WEBGL_LEGACY;
  PIXI.PREFER_ENV = ENV.WEBGL;
  // console.log('isWebGLSupported', utils.isWebGLSupported());


  return new Application(settings);
}

export default createPixiApp;
