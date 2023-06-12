import { Viewport } from "pixi-viewport";
import { Container } from "pixi.js";

function createLayers(viewport: Viewport) {
  const linkLayer = new Container();
  linkLayer.name = 'links';
  // const frontLinkLayer = new Container();
  const nodeLayer = new Container();
  nodeLayer.name = 'nodes';
  // const nodeLabelLayer = new Container();
  // const frontNodeLayer = new Container();
  // const frontNodeLabelLayer = new Container();
  viewport.addChild(linkLayer);
  // viewport.addChild(frontLinkLayer);
  viewport.addChild(nodeLayer);
  // viewport.addChild(nodeLabelLayer);
  // viewport.addChild(frontNodeLayer);
  // viewport.addChild(frontNodeLabelLayer);

  return {
    nodeLayer,
    linkLayer
  }
}

export default createLayers;
