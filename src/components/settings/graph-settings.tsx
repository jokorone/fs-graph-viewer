import React from 'react';
import { useGraphSettings } from '../../hooks/settings';
import { SimulationSettingsEnum as GraphSetting, GraphSettingInputConfig, humanReadable, SimulationSettingsInputs } from '../../lib/d3/settings';

export const SimulationSettings = React.memo(
  (props: ReturnType<typeof useGraphSettings>
) => {
  const [ visible, setVisible ] = React.useState(false);

  const handleSimulationSettingsInput = (key: GraphSetting) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log('update', key, +event.target.value);
      props.updateSimulationSetting(key, +event.target.value);
    }
  }

  const Settings = (
    <div className='flex flex-col my-2'>
      { (Object.entries(SimulationSettingsInputs) as [
          [GraphSetting, GraphSettingInputConfig]
        ]).map(
        ([ key, config ]) =>
          <React.Fragment key={key}>
            <SliderInput
              name={key}
              value={props.simulationSettings[key]}
              config={config}
              handler={handleSimulationSettingsInput(key)}
            />
          </React.Fragment>
        )
      }
    </div>
  );

  const IconToggle = (
    <button className="icon group"
      onClick={() => setVisible(!visible)}>
      {
        visible
          ? 'x'
          : (<>
            <svg className="svg-icon"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            <span className="tooltip color origin-center right-14 group-hover:scale-100">
              Settings
            </span>
          </>)
      }
    </button>
  );

  return (<div className='flex flex-row-reverse'>
    {IconToggle}
    {visible && Settings}
  </div>
  );
});



const SliderInput = ({ name, value, config, handler }:{
  name: GraphSetting,
  value: number,
  config: GraphSettingInputConfig,
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => {

  return (
    <div className="flex flex-col mx-2 my-auto text-xs w-40 justify-items-between">
      <div className='flex flex-row justify-between'>
        <span className='text-gray-900 dark:text-gray-200'>{humanReadable(name)}</span>
        <span className='text-gray-900 dark:text-gray-200 ml-auto'>{value}</span>
      </div>
      <input type="range" className='appearance-none h-1 w-max outline-none opacity-70 transition-opacity hover:opacity-100'
        id={name}
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={handler}
      />
  </div>
  );
};
