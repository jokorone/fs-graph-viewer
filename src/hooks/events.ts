import type { EventCallback } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export function useEvent<T extends {}>(
  event: string,
  callback: EventCallback<T>,
  deps?: Object[]
) {
  useEffect(() => {
    const listener = appWindow.listen<T>(event, callback);
    console.log(deps);

    return () => {
      listener.then(remove => remove());
    }
  }, [event, callback, ...deps || []]);
}
