import { Container, IPointData, Sprite, Texture } from "pixi.js";

const LINK = "LINK";

function createLink() {
  const link = new Container();
  link.interactive = true;

  const line = new Sprite(Texture.WHITE);
  line.name = LINK;
  line.anchor.set(0.5);
  link.addChild(line);
  line.width = 1;
  line.tint = 0xffffff;

  return link;
}

export const updateLinkStyle = (
  link: ReturnType<typeof createLink>,
  source: IPointData,
  target: IPointData,
  highlight: boolean
) => {
  const
    position = { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 },
    rotation = -Math.atan2(target.x - source.x, target.y - source.y),
    length = Math.hypot(target.x - source.x, target.y - source.y);

  link.position.copyFrom(position);
  link.rotation = rotation;
  link.height = length;
  link.alpha = highlight ? 1 : 0.5;
}


export const updateLinkVisibility = (
  link: ReturnType<typeof createLink>,
  zoom: number,
) => {
  const sprite = link.getChildByName(LINK) as Sprite;
  sprite.visible = sprite.visible && zoom >= 2;
}


export default createLink;
