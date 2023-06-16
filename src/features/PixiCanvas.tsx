import { memo, useRef, useEffect, useCallback, useState, createRef, useMemo } from 'react'
import { InteractionOutlet } from './InteractionOutlet';

import createGraph from '../lib/graph';
import { useTheme } from '../hooks/theme';
import { SettingsContainer } from './settings/settings-container';
import { DefaultSimulationSettings, SimulationSettings } from '../lib/d3/settings';
import { RawGraphModel } from '../lib/d3/model';
import { useGraphSettings } from '../hooks/settings';

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

const PixiCanvas = (props: {
  data: RawGraphModel
}) => {
  const ref = useRef<null|HTMLCanvasElement>(null);
  const [interactionTarget, setInteractionTarget] = useState<string | null>(null);

  const       theme = useTheme(),
      graphSettings = useGraphSettings(DefaultSimulationSettings),
    settingsHandler = { ...theme, ...graphSettings };

  const graph = useMemo(() => createGraph(
      props.data,
      {
        interactionCallback: (id, type) => {
          console.log('interaction: ', id, type);
          setInteractionTarget(id);
        }
    }
  ), [props.data]);


  const initalizeGraph = useCallback(() => {
    const app = graph.init(ref.current!);

    return app.destroy;
  }, []);
  useEffect(initalizeGraph, [initalizeGraph]);

  const updateSimulationSettings = useCallback(
    () => graph.updateSimulationSettings(graphSettings.simulationSettings),
    [graphSettings.simulationSettings]
  );
  useEffect(updateSimulationSettings, [updateSimulationSettings]);

  // const updateSimulationData = useCallback(
  //   () => graph.updateSimulationData(props.data),
  //   [props.data]
  // );
  // useEffect(updateSimulationData, [updateSimulationData]);

  return <>
    <SettingsContainer {...settingsHandler}/>
    <InteractionOutlet hoveredId={interactionTarget}></InteractionOutlet>
    <canvas className='' ref={ref}/>
  </>
};

export const MemoizedPixiCanvas = memo(PixiCanvas);

export default PixiCanvas;
