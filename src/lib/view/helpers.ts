import { DisplayObject } from "@pixi/display";
import { Graphics } from "@pixi/graphics";

const circleCollides = (c1: Graphics, c2: DisplayObject) => {
  const thisCenter = {x: c1.position.x, y: c1.position.y};
  const center = {x: c2.x, y: c2.y};
  const x = center.x - thisCenter.x;
  const y = center.y - thisCenter.y;
  const radii = 15 + 15;

  return x * x + y * y <= radii * radii;
};

const measure = (fn: Function) => {
  const start = performance.now();
  const fnResult = fn();
  const end = performance.now();
  const diff = end - start;
  console.log(fn.name,diff + " milliseconds");

  return fnResult;
}

export default {
  circleCollides,
  measure
}
