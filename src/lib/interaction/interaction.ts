import { Viewport } from "pixi-viewport";
import { AbstractRenderer } from "@pixi/core";
import { InteractionEvent } from "@pixi/interaction";
import { DisplayObject } from "@pixi/display";
import { Simulation } from "../d3/simulation";
import { GraphModel, GraphNode, ID } from "../d3/model";
import { D3DragEvent, drag } from "d3-drag";
import { SimulationNodeDatum } from "d3-force";
import { select } from "d3";

type DragEvent = D3DragEvent<HTMLCanvasElement, GraphNode, SimulationNodeDatum>;
export type Interaction = 'hover' | 'drag' | 'click';

function createInteraction(
  model: GraphModel,
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
      selectionDistance = 25 - (viewport.scale.x * 10);

    return simulation.find(x, y, selectionDistance);
  }

  const dragstarted = (event: DragEvent) => {
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
    draggedNode = null;
    interactionCallback(draggedNode, 'drag')
    if (!event.active) simulation.alphaTarget(0);
    viewport.pause = false;
    event.subject.fx = null;
    event.subject.fy = null;
  }

  select(renderer.view).call(drag()
    .subject(selectTarget)
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended) as any);


  const onPanOrDrag =(event: InteractionEvent) => {
    if (!draggedNode) return;
    // draggedNode.position = viewport.toWorld(event.data.global);
    renderGroup(draggedNode.name);
  };
  const onNodeMouseDown = (event: InteractionEvent) => {
    draggedNode = event.currentTarget;
    renderer.plugins.interaction.on('mousemove', onPanOrDrag);
    viewport.pause = true;
  };

  const onNodeMouseUp = () => {
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
