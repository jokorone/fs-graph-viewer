
import { Application } from "@pixi/app"
import { Container } from "@pixi/display";
import { Viewport } from "pixi-viewport";
import { Cull } from "@pixi-essentials/cull";
import { Point } from "@pixi/math";
import createPixiItems, { PixiNode } from "../pixi/items";
import { updateNodeVisibility } from "../pixi/node";
import { updateLinkVisibility } from "../pixi/link";
import { Graphics } from "@pixi/graphics";


const WORLD_PADDING = 75 as const;
const WORLD_WIDTH = window.innerWidth;
const WORLD_HEIGHT = window.innerHeight;

function createViewport(
  app: Application,
  { clientWidth, clientHeight }: HTMLCanvasElement
) {
const viewport = new Viewport({
    // screenWidth: WORLD_WIDTH,
    // screenHeight: WORLD_HEIGHT,
    screenWidth: clientWidth,
    screenHeight: clientHeight,
    passiveWheel: false,
    interaction: app.renderer.plugins.interaction
  })
  .drag()
  .pinch()
  .wheel()
  .decelerate()
  .setZoom(1)
  .zoom(1000, true)
  // .fit(true, clientWidth, clientHeight)
  .fit(true)
  .fitWorld(true)
  .clampZoom({
    maxScale: 3,
    minScale: 0.1,
  });

  app.stage.addChild(viewport);

  // draw initial viewport in red
  const border = new Graphics();
  border.name = 'world_border';
  border.lineStyle(14, 0xff0000, 1.0);
  border.drawRect(0, 0, clientWidth, clientHeight);
  // border.drawRect(
  //   -(clientWidth / 2),
  //   -(clientHeight / 2),
  //   clientWidth, clientHeight
  // );
  viewport.addChild(border);

  // draw (0,0)
  const zero = new Graphics();
  zero.name = 'zero';
  zero.beginFill(0xff0000, 1.0);
  zero.drawCircle(0, 0, 3);
  viewport.addChild(zero);


  const reset = (data: PixiNode[]) => resetView(data, viewport, { clientWidth, clientHeight });

  const registerResizeObserver = (items: ReturnType<typeof createPixiItems>) => {
    const observer = new ResizeObserver(() => {
      app.resize();
      viewport.resize(clientWidth, clientHeight);
    });

    return observer;
  }

  return {
    viewport,
    registerResizeObserver,
    reset,
    mouse: zero
  };
}

export function resetView(
  data: PixiNode[],
  viewport: Viewport,
  { clientWidth, clientHeight }: Pick<HTMLCanvasElement, 'clientWidth' | 'clientHeight'>
) {
  console.log('resetView');

  const
    nodesX      = data.map(node => Math.floor((node.x || 0) + clientWidth  / 2)),
    nodesY      = data.map(node => Math.floor((node.y || 0) + clientHeight / 2)),
    minX        = Math.min(...nodesX),
    maxX        = Math.max(...nodesX),
    minY        = Math.min(...nodesY),
    maxY        = Math.max(...nodesY),
    graphWidth  = Math.abs(maxX - minX),
    graphHeight = Math.abs(maxY - minY),
    // graphCenter = new Point(minX + graphWidth / 2, minY + graphHeight / 2),
    worldWidth  = graphWidth + WORLD_PADDING * 2,
    worldHeight = graphHeight + WORLD_PADDING * 2;

  // console.table({minX, maxX, minY, maxY, graphWidth, graphHeight});
  // TODO: update worldWidth/worldHeight when graph is updated?
  viewport.resize(clientWidth, clientHeight, worldWidth, worldHeight);
  // viewport.resize(window.innerWidth, window.innerHeight);
  // viewport.resize(clientWidth, clientHeight);
  viewport.setZoom(1); // otherwise scale is 0 when initialized in React useEffect
  viewport.center = new Point(0,0);//graphCenter;
  viewport.fit(true);
}

export const updateGraphVisibility = (
  viewport: Viewport,
  app: Application,
  items: ReturnType<typeof createPixiItems>
) => {
  // console.log('updateGraphVisibility');

  const pixiItems = (viewport.children as Container[])
    .map(layer => layer.children)
    .flat();

  new Cull()
    .addAll(pixiItems)
    .cull(app.renderer.screen);

  const scale = viewport.scale.x;
  const steps = [0.1, 0.2, 1, 3];
  const zoomStep = steps.findIndex(step => scale <= step);

  // console.log(scale, '<=', steps[steps.findIndex(step => scale <= step)]);


  // // Determine which screen dimension is most constrained

  // const ratio = Math.min(
  //   window.innerWidth / WORLD_WIDTH,
  //   window.innerHeight / WORLD_HEIGHT
  // );

  // // // Update the renderer dimensions
  // app.renderer.resize(
  //   Math.ceil(WORLD_WIDTH * ratio),
  //   Math.ceil(WORLD_HEIGHT * ratio)
  // );

//   console.log(
// `scale: ${scale}`);
//   console.log(
// `zoomStep: ${ zoomStep.toString()}`);
//   console.log(
// `  show > ${Array.from((cull as any)._targetList as Set<DisplayObject>).filter(x => x.visible === true).length}`);
//   console.log(
// `  hide > ${Array.from((cull as any)._targetList as Set<DisplayObject>).filter(x => x.visible === false).length}`);

for (const [, node] of items.nodes) {
  updateNodeVisibility(node, zoomStep);
}

for (const [, linksOfNode] of items.links) {
  linksOfNode.map(({ item }) => updateLinkVisibility(item, zoomStep))
}
}

export default createViewport;
