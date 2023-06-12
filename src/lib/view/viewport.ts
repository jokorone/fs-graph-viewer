
import { Application } from "@pixi/app"
import { Container, DisplayObject } from "@pixi/display";
import { Viewport } from "pixi-viewport";
import { D3Node } from "../d3/simulation";
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
  canvasEl: HTMLCanvasElement
) {
const viewport = new Viewport({
    screenWidth: WORLD_WIDTH,
    screenHeight: WORLD_HEIGHT,
    passiveWheel: false,
    interaction: app.renderer.plugins.interaction
  })
  .drag()
  .pinch()
  .wheel()
  .decelerate()
  .setZoom(1)
  .zoom(1000, true)
  .fit(true)
  .fitWorld(true)
  .clampZoom({
    maxScale: 3,
    minScale: 0.1,
  });

  app.stage.addChild(viewport);

  const border = new Graphics();
  border.name = 'world_border';
  border.lineStyle(10, 0xff0000, 1.0)
  border.drawRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
  viewport.addChild(border);

  const reset = (data: PixiNode[]) => resetView(data, viewport, canvasEl);

  const registerResizeObserver = (items: ReturnType<typeof createPixiItems>) => {
    const observer = new ResizeObserver(() => {
      app.resize();
      viewport.resize(canvasEl.clientWidth, canvasEl.clientHeight);
    });


    return observer;
  }

  return {
    viewport,
    registerResizeObserver,
    reset
  };
}

export function resetView(
  data: PixiNode[],
  viewport: Viewport,
  { clientWidth, clientHeight }: HTMLCanvasElement
) {
  const
    nodesX      = data.map(node => Math.floor((node.x || 0) + WORLD_WIDTH/2)),
    nodesY      = data.map(node => Math.floor((node.y || 0) + WORLD_HEIGHT/2)),
    minX        = Math.min(...nodesX),
    maxX        = Math.max(...nodesX),
    minY        = Math.min(...nodesY),
    maxY        = Math.max(...nodesY),
    graphWidth  = Math.abs(maxX - minX),
    graphHeight = Math.abs(maxY - minY),
    graphCenter = new Point(minX + graphWidth / 2, minY + graphHeight / 2),
    worldWidth  = graphWidth + WORLD_PADDING * 2,
    worldHeight = graphHeight + WORLD_PADDING * 2;

  // console.table({minX, maxX, minY, maxY, graphWidth, graphHeight});
  // TODO: update worldWidth/worldHeight when graph is updated?
  viewport.resize(clientWidth, clientHeight, worldWidth, worldHeight);
  viewport.setZoom(1); // otherwise scale is 0 when initialized in React useEffect
  viewport.center = new Point(0, 0) //graphCenter;
  viewport.fit(true);
}

export const updateGraphVisibility =(
  viewport: Viewport,
  app: Application,
  items: ReturnType<typeof createPixiItems>
) => {
  const cull = new Cull();
  const pixiItems = (viewport.children as Container[]).map(layer => layer.children).flat();

  cull.addAll(pixiItems);
  cull.cull(app.renderer.screen);

  const scale = viewport.scale.x;
  const steps = [0.1, 0.2, 1, Infinity];
  const zoomStep = steps.findIndex(step => scale <= step);
  // console.log(scale, '<=', steps[steps.findIndex(step => scale <= step)]);


  // // Determine which screen dimension is most constrained
  // const ratio = Math.min(
  //   window.innerWidth / WORLD_WIDTH,
  //   window.innerHeight / WORLD_HEIGHT
  // );

  // // Update the renderer dimensions
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
