"use client"
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCountdown(targetEpochMs?: number, onEnd?: () => void) {
  const [now, setNow] = useState<number>(Date.now());
  const raf = useRef<number>();
  const endedRef = useRef(false);

  const tick = useCallback(() => {
    setNow(Date.now());
    if (targetEpochMs && Date.now() >= targetEpochMs && !endedRef.current) {
      endedRef.current = true;
      onEnd?.();
    }
    if (!endedRef.current) {
      raf.current = window.setTimeout(tick, 1000);
    }
  }, [targetEpochMs, onEnd]);

  useEffect(() => {
    if (targetEpochMs) tick();
    return () => { if (raf.current) clearTimeout(raf.current); };
  }, [targetEpochMs, tick]);

  if (!targetEpochMs) return { remaining: undefined, formatted: '--:--:--' };

  const diff = Math.max(0, targetEpochMs - now);
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const formatted = [h, m, sec].map(v => String(v).padStart(2,'0')).join(':');
  return { remaining: diff, formatted };
}