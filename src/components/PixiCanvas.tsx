import { memo, useRef, useEffect, useCallback, useState, createRef, useMemo } from 'react'
import { InteractionOutlet } from './InteractionOutlet';

import createGraph from '../lib/graph';
import { useTheme } from '../hooks/theme';
import { SettingsContainer } from './settings/settings-container';
import { DefaultSimulationSettings, SimulationSettings } from '../lib/d3/settings';

type GraphSettings = typeof DefaultGraphSettings;//{
//   simulation?: {

//   },
//   pixi?: {

//   }
// }

const DefaultGraphSettings = {
  simulation: DefaultSimulationSettings as SimulationSettings,
  pixi: {}
};

const PixiCanvas = memo(() => {
  const data = {
    nodes: [],
    links: []
  }

  const ref = useRef<null|HTMLCanvasElement>(null);
  const [interactionTarget, setInteractionTarget] = useState<string | null>(null);

  const theme = useTheme(),
    [ settings, setSettings ] = useState<GraphSettings>(
      DefaultGraphSettings
    );

  const updateSimulationSetting = (key: keyof SimulationSettings, value: number) =>
    setSettings(settings => ({
      ...settings,
      simulation: {
        ...settings.simulation,
        [key]: value
      }
    }));

  const settingsHandler = {
    ...theme,
    simulationSettings: settings.simulation,
    updateSimulationSetting,
  };

  const graph = useMemo(() => createGraph(
      data,
      {
        interactionCallback: (id, type) => {
          console.log('interaction: ', id, type);
          setInteractionTarget(id);
        }
    }
  ), []);

  const initalizeGraph = useCallback(() => {
    const app = graph.init(ref.current!);
    return app.destroy;
  }, []);

  useEffect(initalizeGraph, [initalizeGraph])

  const updateSimulationSettings = useCallback(
    () => graph.updateSimulationSettings(settings.simulation),
    [settings.simulation]
  );
  useEffect(updateSimulationSettings, [updateSimulationSettings]);
  // const setupPixiApp = useCallback(() => {
  //   graph.current = createPixiGraph({
  //     element: canvas.current!,
  //     data,
  //     callbacks: {
  //       interactionCallback: (id, type) => {
  //         console.log('interaction: ', id, type);
  //         setInteractionTarget(id);
  //       }
  //     }
  //   });

  //   const { app } = graph.current;
  //   app.start();

  //   return () => {
  //     graph.current = (graph.current!.destroy(), null);
  //   }
  // }, []);

  // useEffect(createPixiApp, [createPixiApp]);

  // console.log('pass data:', data);
  return <div className="pixi-container w-full h-full outline-none">
    <SettingsContainer {...settingsHandler}/>
    <InteractionOutlet hoveredId={interactionTarget}></InteractionOutlet>
    <canvas className='outline-none' ref={ref}/>
  </div>
});



export default PixiCanvas;
