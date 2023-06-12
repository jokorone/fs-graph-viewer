import { AbstractRenderer, Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { SCALE_MODES } from '@pixi/constants';
import { ID } from "../d3/model";

function createTextureCache(renderer: AbstractRenderer) {
  const cache = new Map<ID, Texture>();

  const get = (key: ID, create: () => Container) => {
    const cached = cache.get(key);

    if (!cached) {
      const container = create();
      const region = container.getLocalBounds(undefined, true);
      const roundedRegion = new Rectangle(Math.floor(region.x), Math.floor(region.y), Math.ceil(region.width), Math.ceil(region.height));
      const texture = renderer.generateTexture(container, {
        scaleMode: SCALE_MODES.LINEAR,
        resolution: renderer.resolution,
        region: roundedRegion
      });
      cache.set(key, texture);

      return texture;
    }

    return cached;
  }

  const remove = (key: ID) => {
    const texture = cache.get(key);
    if (!texture) {
      return;
    }

    texture.destroy();
    cache.delete(key);
  }

  const clear = () => Array.from(cache.keys()).map(remove);

  return {
    get,
    remove,
    clear,
    all: () => Object.fromEntries(Array.from(cache))
  };
}

export default createTextureCache;
