import { useEffect, useState } from 'react';

export function useConnectivity(onBackOnline?: () => void) {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const up = () => {
      setOnline(true);
      onBackOnline?.();
    };
    const down = () => setOnline(false);

    window.addEventListener('online', up);
    window.addEventListener('offline', down);

    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, [onBackOnline]);

  return online;
}