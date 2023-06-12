import { useState } from 'react';
import { DefaultSimulationSettings, SimulationSettings } from '../lib/d3/settings';

export const useGraphSettings = (
  initialSimulationSettings: SimulationSettings = DefaultSimulationSettings
) => {
  const [
    simulationSettings,
    _setSimulationSettings
  ] = useState<SimulationSettings>(initialSimulationSettings);

  const updateSimulationSetting = (key: keyof SimulationSettings, value: number) =>
    _setSimulationSettings(settings => ({
      ...settings,
      [key]: value
    })
  );

  return { simulationSettings, updateSimulationSetting };
}
