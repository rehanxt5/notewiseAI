import { useRef, useLayoutEffect, useState, useCallback } from 'react';

const steps = [
  { num: '01', title: 'Ingest',   mt: 15,  body: 'Drop any file — PDF, Markdown, CSV, code. The parser preserves structure, tables, and hierarchy without losing context.' },
  { num: '02', title: 'Embed',    mt: 160, body: 'Content is chunked and cast into high-dimensional vector space, capturing deep semantic relationships across all documents.' },
  { num: '03', title: 'Query',    mt: 40,  body: 'Ask in plain language. The model understands intent and formulates precise queries against your entire corpus.' },
  { num: '04', title: 'Search',   mt: 185, body: 'Vector similarity search scans every embedded chunk, ranking results by semantic closeness rather than keyword frequency.' },
  { num: '05', title: 'Retrieve', mt: 20,  body: 'Top passages are assembled with full inline citations and returned as a grounded, accurate answer — every time.' },
];

export default function HowItWorksSection({ visible }) {
  const rowRef    = useRef(null);
  const nodeRefs  = useRef([]);
  const svgRef    = useRef(null);
  const [path, setPath] = useState('');
  const [dots, setDots] = useState([]);

  const recalc = useCallback(() => {
    if (!rowRef.current || nodeRefs.current.length < steps.length) return;
    const rowRect = rowRef.current.getBoundingClientRect();
    const points  = nodeRefs.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - rowRect.left + r.width  / 2,
        y: r.top  - rowRect.top  + r.height / 2,
      };
    }).filter(Boolean);
    if (!points.length) return;
    setPath(points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' '));
    setDots(points);
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    // small delay so elements have rendered at final positions
    const id = setTimeout(recalc, 60);
    window.addEventListener('resize', recalc);
    return () => { clearTimeout(id); window.removeEventListener('resize', recalc); };
  }, [visible, recalc]);

  return (
    <section className="section" data-section="2">
      <p className={`sec-label reveal${visible ? ' visible' : ''}`}>How it works</p>
      <h2 className={`sec-heading reveal${visible ? ' visible' : ''}`} data-delay="1">
        Five steps to omniscience.
      </h2>

      <div className="zigzag-row" ref={rowRef}>
        {/* connector SVG — drawn through real measured centers */}
        <svg ref={svgRef} className="zigzag-svg" aria-hidden="true">
          {path && (
            <path
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          )}
          {dots.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="rgba(255,255,255,0.18)" />
          ))}
        </svg>

        {steps.map((s, i) => (
          <div
            key={s.num}
            className={`zigzag-item reveal${visible ? ' visible' : ''}`}
            data-delay={String(i + 1)}
            style={{ marginTop: `${s.mt}px` }}
          >
            <div
              className="step-num"
              ref={(el) => { nodeRefs.current[i] = el; }}
            >
              {s.num}
            </div>
            <div className="step-title">{s.title}</div>
            <div className="step-body">{s.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
