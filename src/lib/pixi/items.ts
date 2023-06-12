import { GraphModel, ID } from "../d3/model";
import createInteractionHandlers from "../interaction/interaction";
import createLayers from "./layers";
import createLink from "./link";
import createNode from "./node";

export type PixiNode = ReturnType<typeof createNode>;
export type PixiLink = {
  source: ID,
  target: ID,
  item: ReturnType<typeof createLink>
};

const DELIMITER = "::";

function createPixiItems(
  data: GraphModel,
  layers: ReturnType<typeof createLayers>,
  handlers: ReturnType<typeof createInteractionHandlers>['handlers']
) {
  const nodes = new Map<ID, PixiNode>(),
        links = new Map<ID, PixiLink[]>();

  for (const [id, ] of data.nodes) {
    const pixiNode = createNode(id);
    pixiNode.name = id.toString();
    layers.nodeLayer.addChild(pixiNode);

    nodes.set(id, pixiNode)

    pixiNode.on('mousedown', handlers.onNodeMouseDown);
    pixiNode.on('mouseup', handlers.onNodeMouseUp);
    pixiNode.on('mouseover', handlers.onNodeHoverStart);
    pixiNode.on('mouseout', handlers.onNodeHoverEnd);
  }

  for (const [source, linksOfNode] of data.links) {
    const _links = linksOfNode.sourceFor.map(target => {
      const pixiLink = createLink();
      pixiLink.name = `${source}${DELIMITER}${target}`
      layers.linkLayer.addChild(pixiLink);

      return {
        source,
        target,
        item: pixiLink
      } as PixiLink;
    })

    links.set(source, _links);
  }

  return {
    nodes,
    links
  }
}

export const getLinkSource = (link: PixiLink) => {
  return link.item.name.split(DELIMITER)[0];
}

export const getLinkTarget = (link: PixiLink) => {
  return link.item.name.split(DELIMITER)[1];
}

export default createPixiItems;
