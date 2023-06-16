import { useGraphSettings } from '../../hooks/settings';
import { useTheme } from '../../hooks/theme';
import { DarkmodeToggle } from './darkmode-toggle';
import { SimulationSettings } from './graph-settings';

export const SettingsContainer = (
    props: ReturnType<typeof useGraphSettings> & ReturnType<typeof useTheme>
  ) => {

  return(<div className='absolute right-2'>
    <div className="">
      <DarkmodeToggle {...props}/>
    </div>

    <div className="">
      <SimulationSettings {...props}/>
    </div>
  </div>);
};
