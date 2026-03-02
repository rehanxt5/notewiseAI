import { useState, useCallback, useEffect, lazy, Suspense, useMemo } from 'react';
import './styles/globals.css';

import { useScroll }          from './hooks/useScroll';
import Nav                    from './components/Nav';
import SideNav                from './components/SideNav';
import HeroSection            from './components/sections/HeroSection';
import StatementSection       from './components/sections/StatementSection';
import HowItWorksSection      from './components/sections/HowItWorksSection';
import CapabilitiesSection    from './components/sections/CapabilitiesSection';
import StatsSection           from './components/sections/StatsSection';
import TerminalSection        from './components/sections/TerminalSection';
import CtaSection             from './components/sections/CtaSection';

// Lazy-load Three.js background (heaviest dependency)
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));

const TOTAL = 7;

// Detect touch / mobile once
const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

export default function App() {
  const [current, setCurrent] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  // visited tracks which sections have already been revealed (one-way)
  const [visited, setVisited] = useState(new Set([0]));

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  const onSectionChange = useCallback((idx) => {
    setCurrent(idx);
    setVisited(prev => { const next = new Set(prev); next.add(idx); return next; });
  }, []);

  const { trackRef, goTo } = useScroll(onSectionChange);

  // progress bar width
  const progressWidth = `${(current / (TOTAL - 1)) * 100}%`;

  // cursor glow — throttled via rAF, disabled on touch devices
  useEffect(() => {
    if (isTouch) return;
    let rafId = 0;
    let mx = 0, my = 0;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mx', `${mx}px`);
          document.documentElement.style.setProperty('--my', `${my}px`);
          rafId = 0;
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isTouch]);

  const vis = (idx) => visited.has(idx);

  return (
    <>
      {!isTouch && <div className="cursor-glow" />}
      <div className="bg-grid" />
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>
      <div className="scroll-progress" style={{ width: progressWidth }} />

      <Nav goTo={goTo} />
      <SideNav current={current} goTo={goTo} />

      <div className="scroll-wrapper">
        <div className="scroll-track" ref={trackRef}>
          <HeroSection         visible={vis(0)} />
          <StatementSection    visible={vis(1)} />
          <HowItWorksSection   visible={vis(2)} />
          <CapabilitiesSection visible={vis(3)} />
          <StatsSection        visible={vis(4)} />
          <TerminalSection     visible={vis(5)} />
          <CtaSection          visible={vis(6)} />
        </div>
      </div>
    </>
  );
}
