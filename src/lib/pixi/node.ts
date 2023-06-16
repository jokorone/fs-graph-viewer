import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import { InteractionEvent } from "@pixi/interaction";
import { Circle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { ID } from "../d3/model";
import { D3Node } from "../d3/simulation";
import createTextureCache from "./texture-cache";

const DELIMITER = '::';
const WHITE = 0xffffff;

const NODE = 'NODE';
const NODE_BORDER = 'NODE_BORDER';
const NODE_ICON = 'NODE_ICON';


function createNode(id: ID) {
  const node = new Container();
  node.name = `${id}`;
  node.interactive = true;
  node.buttonMode = true;

  node.hitArea = new Circle();
  const nodeCircle = new Sprite();
  nodeCircle.name = NODE;
  nodeCircle.anchor.set(0.5);
  node.addChild(nodeCircle);

  const nodeCircleBorder = new Sprite();
  nodeCircleBorder.name = NODE_BORDER;
  nodeCircleBorder.anchor.set(0.5);
  node.addChild(nodeCircleBorder);

  // const nodeIcon = new Sprite();
  // nodeIcon.name = NODE_ICON;
  // nodeIcon.anchor.set(0.5);
  // nodeGfx.addChild(nodeIcon);

  return node;
}

const defaultStyle = {
  size: 3,
  border: 1,
  hitBoxSize: 3,
  alpha: 0.8,
}

const highlightStyle: typeof defaultStyle = {
  size: 5,
  border: 2,
  hitBoxSize: 3,
  alpha: 1
};

export const updateNodeStyle = (
  node: ReturnType<typeof createNode>,
  cache: ReturnType<typeof createTextureCache>,
  data: D3Node,
  highlight: boolean
) => {
  const style = highlight ? highlightStyle : defaultStyle;

  const
    position = { x: data.x || 0, y: data.y || 0 },
    nodeOuterSize = style.size + style.border + style.hitBoxSize,
    nodeTextureId = [NODE, style.size].join(DELIMITER),
    borderTextureId = [NODE_BORDER, style.size, style.border].join(DELIMITER);

  (node.hitArea as Circle).radius = nodeOuterSize;

  const nodeCircle = node.getChildByName(NODE) as Sprite;
  nodeCircle.texture = cache.get(nodeTextureId, () => {
    return new Graphics()
      .beginFill(WHITE, 1.0)
      .drawCircle(0, 0, style.size);
  });

  const nodeCircleBorder = node.getChildByName(NODE_BORDER) as Sprite;
  nodeCircleBorder.texture = cache.get(borderTextureId, () => {
    return new Graphics()
      .lineStyle(style.border, WHITE)
      .drawCircle(nodeOuterSize, nodeOuterSize, style.size);
  });

  // [nodeCircle.tint, nodeCircle.alpha] = colorToPixi(nodeStyle.color);
  // [nodeCircleBorder.tint, nodeCircleBorder.alpha] = colorToPixi(nodeStyle.border.color);

  node.position.copyFrom(position);

  return node;
}


export const updateNodeVisibility = (
  node: ReturnType<typeof createNode>,
  zoom: number
) => {
  const sprite = node.getChildByName(NODE) as Sprite;
  const border = node.getChildByName(NODE_BORDER) as Sprite;
  sprite.visible = border.visible = sprite.visible && zoom >= 1;
}

export default createNode;
