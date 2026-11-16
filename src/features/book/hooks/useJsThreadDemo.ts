import { useEffect, useState } from 'react';

const TICK_INTERVAL_MS = 100;
const BLOCK_DURATION_MS = 2000;

export default function useJsThreadDemo() {
  const [jsTicks, setJsTicks] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setJsTicks((ticks) => ticks + 1), TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const blockJsThread = () => {
    const end = Date.now() + BLOCK_DURATION_MS;
    while (Date.now() < end) {
      continue;
    }
  };

  return { jsTicks, blockJsThread };
}
