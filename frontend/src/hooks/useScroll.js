import { useEffect, useRef, useCallback } from 'react';

const TOTAL = 7;

export function useScroll(onSectionChange) {
  const curRef   = useRef(0);
  const syRef    = useRef(0);
  const tyRef    = useRef(0);
  const animRef  = useRef(false);
  const wLockRef = useRef(false);
  const wheelAcc = useRef(0);
  const wheelTmr = useRef(null);
  const trackRef = useRef(null);
  const tLockRef = useRef(false);

  const vh = () => window.innerHeight;

  const smoothRun = useCallback(() => {
    if (animRef.current) return;
    animRef.current = true;
    const tick = () => {
      const d = tyRef.current - syRef.current;
      if (Math.abs(d) < 0.35) {
        syRef.current = tyRef.current;
        if (trackRef.current)
          trackRef.current.style.transform = `translateY(${-syRef.current}px)`;
        animRef.current = false;
        return;
      }
      syRef.current += d * 0.088;
      if (trackRef.current)
        trackRef.current.style.transform = `translateY(${-syRef.current}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const goTo = useCallback((idx) => {
    const next = Math.max(0, Math.min(TOTAL - 1, idx));
    curRef.current = next;
    tyRef.current  = next * vh();
    onSectionChange(next);
    smoothRun();
  }, [onSectionChange, smoothRun]);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (wLockRef.current) return;
      wheelAcc.current += e.deltaY;
      clearTimeout(wheelTmr.current);
      wheelTmr.current = setTimeout(() => { wheelAcc.current = 0; }, 220);
      if (Math.abs(wheelAcc.current) < 60) return;
      const dir = wheelAcc.current > 0 ? 1 : -1;
      wheelAcc.current = 0;
      wLockRef.current = true;
      setTimeout(() => { wLockRef.current = false; }, 920);
      goTo(curRef.current + dir);
    };

    let tY0 = 0;
    let tX0 = 0;
    const onTouchStart = (e) => {
      tY0 = e.touches[0].clientY;
      tX0 = e.touches[0].clientX;
    };
    const onTouchEnd   = (e) => {
      if (tLockRef.current) return;
      const dy = tY0 - e.changedTouches[0].clientY;
      const dx = tX0 - e.changedTouches[0].clientX;
      // Only trigger if vertical swipe is dominant and significant
      if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        tLockRef.current = true;
        setTimeout(() => { tLockRef.current = false; }, 700);
        goTo(curRef.current + (dy > 0 ? 1 : -1));
      }
    };

    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goTo(curRef.current + 1); }
      if (['ArrowUp',   'PageUp'       ].includes(e.key)) { e.preventDefault(); goTo(curRef.current - 1); }
    };

    const onResize = () => {
      syRef.current = curRef.current * vh();
      tyRef.current = syRef.current;
      if (trackRef.current)
        trackRef.current.style.transform = `translateY(${-syRef.current}px)`;
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    window.addEventListener('keydown',    onKey);
    window.addEventListener('resize',     onResize);

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('keydown',    onKey);
      window.removeEventListener('resize',     onResize);
    };
  }, [goTo]);

  return { trackRef, goTo };
}
