import { useEffect, useRef, useState } from 'react';

function useCounter(target, active) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    let v    = 0;
    const step = target / 55;
    const id = setInterval(() => {
      v = Math.min(v + step, target);
      setVal(Math.floor(v));
      if (v >= target) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [active, target]);

  return val;
}

const stats = [
  { target: 50,  unit: 'ms',  label: 'Avg. retrieval latency'   },
  { target: 10,  unit: 'M+',  label: 'Tokens per workspace'      },
  { target: 99,  unit: '%',   label: 'Citation accuracy'          },
];

function StatItem({ target, unit, label, active, delay }) {
  const val = useCounter(target, active);
  return (
    <div className={`stat-item reveal${active ? ' visible' : ''}`} data-delay={String(delay)}>
      <div className="stat-number">
        <span className="val">{val}</span>
        <span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsSection({ visible }) {
  return (
    <section className="section" data-section="4">
      <p className={`sec-label reveal${visible ? ' visible' : ''}`}>By the numbers</p>
      <h2 className={`sec-heading reveal${visible ? ' visible' : ''}`} data-delay="1">Built for scale.</h2>
      <div className="stats-row">
        {stats.map((s, i) => (
          <StatItem key={s.label} {...s} active={visible} delay={i + 1} />
        ))}
      </div>
    </section>
  );
}
