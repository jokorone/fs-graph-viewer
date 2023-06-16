import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCollide,
  forceX,
  forceY,
  forceCenter,
} from 'd3';
import { GraphModel, GraphNode, RawGraphLink } from './model';

import { DefaultSimulationSettings } from './settings';

export type D3Node = d3.SimulationNodeDatum & GraphNode;
export type D3Link = d3.SimulationLinkDatum<GraphNode & D3Node>;
export type Simulation = d3.Simulation<D3Node, D3Link>;
export type Forces = ReturnType<typeof createForces>;

function createSimulation(
  data: GraphModel,
  settings = DefaultSimulationSettings,
)  {
  const simulation = forceSimulation<D3Node, RawGraphLink>();
  const forces = createForces();

  const attachForces = (settings: typeof DefaultSimulationSettings) => {
    simulation.alphaTarget(0.3).restart();
    attachForcesToSimulation(simulation, forces, settings);
  }

  const attachData = (data: GraphModel) => {
    simulation.alphaTarget(0.3).restart();
    attachDataToSimulation(simulation, forces, data);
  }

  attachForces(settings);
  attachData(data);

  return {simulation, attachForces, attachData};
}

function attachForcesToSimulation(
  simulation: Simulation,
  forces: Forces,
  options = DefaultSimulationSettings,
) {
  const settings = {
    DefaultSimulationSettings,
    ...options
  }

  if (forces.forceLink) {
    // console.log('-- forceLink');

    simulation.force('link', forces.forceLink
      .distance(settings.linkDistance)
      .iterations(1)
      .id(({ id }: any) => id));
  }

  if (forces.forceCharge) {
    // console.log('-- forceCharge');

    simulation.force('charge', forces.forceCharge
      .strength(settings.chargeForceStrength)
      .distanceMin(settings.chargeDistanceMin)
      .distanceMax(settings.chargeDistanceMax));
  }

  if (forces.forceCollide) {
    // console.log('-- forceCollide');

    simulation.force('collide', forces.forceCollide
      .strength(settings?.collideStrength)
      .radius(settings.collideRadius)
      .iterations(1));
  }

  if (forces.forceCenter) {
    // console.log('-- forceCenter');

    simulation.force('center', forces.forceCenter
      .x(settings.forceX)
      .y(settings.forceY));
  }

  if (forces.forceX) {
    // console.log('-- forceX');

    simulation.force('forceX', forces.forceX
    .x(settings.forceX))//window.innerWidth / 4)))
  }

  if (forces.forceY) {
    // console.log('-- forceY');

    simulation.force('forceY', forces.forceY
    .y(settings.forceY))//window.innerHeight / 4)));
  }


    // .force('center', forces.forceCenter
    //   .x(settings.forceX)
    //   .y(settings.forceY))
    // if node has no links, maybe give other x/y force
    // .force('forceX', forces.forceX
    //   .x(settings.forceX))//window.innerWidth / 4)))
    // .force('forceY', forces.forceY
    //   .y(settings.forceY))//window.innerHeight / 4)));
    ;
}

function attachDataToSimulation(
  simulation: Simulation,
  forces: Forces,
  data: GraphModel
) {
  const
    nodes = Object.values(Object.fromEntries(data.nodes)),
    links = Object.values(Object.fromEntries(data.links))
                  .flatMap(link => link.links);

  simulation.nodes(nodes as D3Node[]);
  forces.forceLink.links(links);
}

function createForces() {
  return {
    forceCharge: forceManyBody(),
    forceLink: forceLink(),
    forceCollide: forceCollide(),
    forceX: forceX(),
    forceY: forceY(),
    forceCenter: forceCenter()
  }
}

export default createSimulation;
