import { Viewport } from "pixi-viewport";
import { AbstractRenderer } from "@pixi/core";
import { InteractionEvent } from "@pixi/interaction";
import { DisplayObject } from "@pixi/display";
import { Simulation } from "../d3/simulation";
import { GraphNode, ID } from "../d3/model";
import { D3DragEvent, drag } from "d3-drag";
import { SimulationNodeDatum } from "d3-force";
import { select } from "d3";

type DragEvent = D3DragEvent<HTMLCanvasElement, GraphNode, SimulationNodeDatum>;
export type Interaction = 'hover' | 'drag' | 'click';

function createInteraction(
  viewport: Viewport,
  renderer: AbstractRenderer,
  simulation: Simulation,
  renderGroup: (id: ID) => void,
  interactionCallback: (id: string | null, type: Interaction) => void
) {
  let draggedNode: DisplayObject | null = null;
  let hoveredNode: DisplayObject | null = null;
  let dragMode: 'free' | 'd3' = 'd3';

  const setDragMode = (mode: typeof dragMode) => {
    dragMode = mode;
  }

  const selectTarget = (event: DragEvent) => {
    const
      { x, y } = viewport.toWorld(event.x, event.y),
      global = viewport.toGlobal({ x: event.x, y: event.y }),
      selectionDistance = 25;

    console.log('-- viewport', event.x, event.y, simulation.find(event.x, event.y, selectionDistance));
    console.log('-- world', x, y, simulation.find(x, y, selectionDistance));
    console.log('-- global', global.x, global.y, simulation.find(global.x, global.y, selectionDistance));

    return simulation.find(x, y, selectionDistance);
  }

  const dragstarted = (event: DragEvent) => {
    console.log('dragstarted', event.x, event.y);

    if (!event.active) simulation.alphaTarget(0.3).restart();
    interactionCallback((event.subject as any).id, 'drag')
    viewport.pause = true;
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  const dragged = (event: DragEvent) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  const dragended = (event: DragEvent) => {
    interactionCallback(draggedNode = null, 'drag')
    if (!event.active) simulation.alphaTarget(0.1);
    viewport.pause = false;
    event.subject.fx = null;
    event.subject.fy = null;
  }

  select(renderer.view).call(drag()
    .subject(selectTarget)
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended) as any);


  const onPanOrDrag = (event: InteractionEvent) => {
    if (!draggedNode) return;
    // draggedNode.position = viewport.toWorld(event.data.global);
    renderGroup(draggedNode.name);
  };

  const onNodeMouseDown = (event: InteractionEvent) => {
    console.log('onNodeMouseDown:', event.currentTarget.name);
    console.log('             at:', event.data.global.x, event.data.global.y);

    draggedNode = event.currentTarget;
    renderer.plugins.interaction.on('mousemove', onPanOrDrag);
    viewport.pause = true;
  };

  const onNodeMouseUp = () => {
    console.log('onNodeMouseUp', draggedNode?.name);

    draggedNode = null;
    renderer.plugins.interaction.off('mousemove', onPanOrDrag);
    viewport.pause = false;
  };

  const onNodeHoverStart = (event: InteractionEvent) => {
    if (draggedNode) return;
    hoveredNode = event.currentTarget;
    if (hoveredNode && hoveredNode.name) {
      interactionCallback(hoveredNode.name, 'hover');
    }
  }

  const onNodeHoverEnd = () => {
    hoveredNode = null;
    if (draggedNode) return;
    interactionCallback(hoveredNode, 'hover');
  }

  const
    isHovered = (id: ID) => id === hoveredNode?.name,
    isDragged = (id: ID) => id === draggedNode?.name;

  return {
    test: {
      isHovered,
      isDragged,
      isHighlighted(id: ID) {
        return isHovered(id) || isDragged(id)
      }
    },
    get: {
      hoveredNode() { return hoveredNode }
    },
    handlers: {
      onNodeHoverStart,
      onNodeHoverEnd,
      onNodeMouseDown,
      onNodeMouseUp
    }
  }
}

export default createInteraction;
