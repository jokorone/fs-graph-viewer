export type ID = string | number;

export type RawGraphNode = {
  id: ID,
  group?: number,
  payload?: {},
}

export type RawGraphLink = {
  source: ID,
  target: ID,
  value?: number,
  meta?: {},
}

export type RawGraphModel = {
  nodes: Array<RawGraphNode>,
  links: Array<RawGraphLink>,
}

export type GraphNode = RawGraphNode;

type Links = {
  sourceFor: ID[],
  targetOf: ID[],
  links: RawGraphLink[]
}

export type GraphModel = {
  nodes: Map<ID, GraphNode>
  links: Map<ID, Links>
};

const createGraphModel = (data: RawGraphModel): GraphModel => {
  const nodes = new Map<ID, GraphNode>();
  const links = new Map<ID, Links>();
  const model = { nodes, links };

  const getLinks = (id?: ID) => {
    return id && links.get(id) || {
      sourceFor: new Array<ID>(),
      targetOf: new Array<ID>(),
      links: new Array<RawGraphLink>()
    };
  };

  for (const node of data.nodes) {
    nodes.set(node.id, node);
    links.set(node.id, getLinks());
  }

  for (const link of data.links) {
    const sourceNodeLinks = getLinks(link.source);
    const targetNodeLinks = getLinks(link.target);

    sourceNodeLinks.sourceFor.push(link.target);
    targetNodeLinks.targetOf.push(link.source);

    sourceNodeLinks.links.push(link);

    links.set(link.source, sourceNodeLinks);
    links.set(link.target, targetNodeLinks);
  }

  return model;
}

export default createGraphModel;
