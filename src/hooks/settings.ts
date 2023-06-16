import { useState } from 'react';

export const useGraphSettings = <T>(
  initialSettings: T
) => {
  const [
    settings,
    setSettings
  ] = useState<T>(initialSettings);

  const updateSimulationSetting = (
    key: keyof T,
    value: T[keyof T]
  ) => setSettings(settings => ({
      ...settings,
      [key]: value
  }));

  return {
    simulationSettings: settings,
    updateSimulationSetting
  };
}
