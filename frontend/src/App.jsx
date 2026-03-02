import { useState, useCallback, useEffect } from 'react';
import './styles/globals.css';

import { useScroll }          from './hooks/useScroll';
import ThreeBackground        from './components/ThreeBackground';
import Nav                    from './components/Nav';
import SideNav                from './components/SideNav';
import HeroSection            from './components/sections/HeroSection';
import StatementSection       from './components/sections/StatementSection';
import HowItWorksSection      from './components/sections/HowItWorksSection';
import CapabilitiesSection    from './components/sections/CapabilitiesSection';
import StatsSection           from './components/sections/StatsSection';
import TerminalSection        from './components/sections/TerminalSection';
import CtaSection             from './components/sections/CtaSection';

const TOTAL = 7;

export default function App() {
  const [current, setCurrent] = useState(0);

  // visited tracks which sections have already been revealed (one-way)
  const [visited, setVisited] = useState(new Set([0]));

  const onSectionChange = useCallback((idx) => {
    setCurrent(idx);
    setVisited(prev => { const next = new Set(prev); next.add(idx); return next; });
  }, []);

  const { trackRef, goTo } = useScroll(onSectionChange);

  // progress bar width
  const progressWidth = `${(current / (TOTAL - 1)) * 100}%`;

  // cursor glow
  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const vis = (idx) => visited.has(idx);

  return (
    <>
      <div className="cursor-glow" />
      <div className="bg-grid" />
      <ThreeBackground />
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
