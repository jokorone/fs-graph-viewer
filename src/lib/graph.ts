import createViewport, { updateGraphVisibility } from './view/viewport';
import createPixiApp from './pixi/app';
import createGraphModel, {  ID, RawGraphModel, RawGraphNode } from './d3/model';
import createSimulation from './d3/simulation';
import createLayers from './pixi/layers';
import createTextureCache from './pixi/texture-cache';
import createPixiItems, { PixiLink } from './pixi/items';
import { updateNodeStyle } from './pixi/node';
import { updateLinkStyle } from './pixi/link';
import { LINE_SCALE_MODE, settings } from '@pixi/graphics-smooth';
import createInteraction, { Interaction } from './interaction/interaction';
import { DefaultSimulationSettings } from './d3/settings';

type PixiGraphOptions = {
  element: HTMLCanvasElement,
  data: RawGraphModel,
  callbacks: {
    interactionCallback: (node: string|null, type: Interaction) => void;
  }
}

type GraphSettings = {
  data: RawGraphModel,
}

function createGraph(
  data: RawGraphModel,
  callbacks: {
    interactionCallback: (node: string|null, type: Interaction) => void;
  }
) {
  console.log('createGraph');

  const model = createGraphModel(data);
  const {simulation, attachForces} = createSimulation(model);

  return {
    updateSimulationSettings: (settings: typeof DefaultSimulationSettings) => {
      attachForces(settings);
    },
    init: (element: HTMLCanvasElement) => {
      const app = createPixiApp({ canvasEl: element });
      const view = createViewport(app, element);
      const cache = createTextureCache(app.renderer);
      const interaction = createInteraction(
        model,
        view.viewport,
        app.renderer,
        simulation,
        renderLinksById,
        callbacks.interactionCallback
      );
      const layers = createLayers(view.viewport);
      const items = createPixiItems(model, layers, interaction.handlers),
            getPixiNode = (id: ID) => items.nodes.get(id) ?? null,
            getPixiLinks = (id: ID) => items.links.get(id) ?? [];
      const resizeObserver = view.registerResizeObserver(items);

      // why?
      app.renderer.plugins.interaction.moveWhenInside = true;
      settings.LINE_SCALE_MODE = LINE_SCALE_MODE.NORMAL;

      app.loader.load(() => {
        view.viewport.on('frame-end', () => {
          if (view.viewport.dirty) {
            view.viewport.dirty = (
              updateGraphVisibility(view.viewport, app, items),
              false
            );
          }
        })

        resizeObserver.observe(element);

        // give the simulation time to set coordinates
        setTimeout(() => {
          view.reset(Array.from(items.nodes).flatMap(([,node]) => node));
        }, items.nodes.size);
      });

      let elapsed = 0;
      function shouldRender() {
        // console.log(simulation.alpha());

        const idle = simulation.alpha() < 0.0225;
        const nextTick = ++elapsed % 8 === 0;

        return !idle || nextTick;
      }

      app.ticker.add(() => shouldRender() && render());

      function render() {
        for (const d3node of simulation.nodes()) {
          const item = getPixiNode(d3node.id);
          const links = getPixiLinks(d3node.id);
          const highlight = interaction.test.isHighlighted(d3node.id);

          if (!item) return;
          updateNodeStyle(item, cache, d3node, highlight);

          if (!links) return;
          renderLinksByItem(links, highlight);
        }
      }

      function renderLinksById(sourceNode: ID) {
        const links = model.links.get(sourceNode) ?? null;
        const highlight = interaction.test.isHighlighted(sourceNode);

        if (!links) return;

        const attachedLinks = new Set([...links.sourceFor, ...links.targetOf]);
        for (const id of attachedLinks) {
          renderLinksByItem(getPixiLinks(id), links.sourceFor.includes(id));
        }
        renderLinksByItem(getPixiLinks(sourceNode), highlight);
      }

      function renderLinksByItem(links: PixiLink[], highlight: boolean) {
        for (const { source, target, item } of links) {
          const sourceNode = getPixiNode(source);
          const targetNode = getPixiNode(target);

          if (!sourceNode) return;
          if (!targetNode) return;

          updateLinkStyle(item, sourceNode, targetNode, highlight);
        }
      }

      function destroy() {
        console.log('destroy');
        model.links.clear();
        model.nodes.clear();
        items.links.clear();
        items.nodes.clear();
        cache.clear();
        simulation.stop();
        app.stop();
        resizeObserver.disconnect();
        app.destroy(false, {
          children: true,
          texture: true,
          baseTexture: true
        });
      }

      return {
        destroy,
      };
    }
  }
}

export default createGraph;
