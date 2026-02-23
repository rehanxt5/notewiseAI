import { useRef, useLayoutEffect, useState, useCallback } from 'react';

const steps = [
  { num: '01', title: 'Ingest',   mt: 15,  body: 'Drop any file — PDF, Markdown, CSV, code. The parser preserves structure, tables, and hierarchy without losing context.' },
  { num: '02', title: 'Embed',    mt: 160, body: 'Content is chunked and cast into high-dimensional vector space, capturing deep semantic relationships across all documents.' },
  { num: '03', title: 'Query',    mt: 40,  body: 'Ask in plain language. The model understands intent and formulates precise queries against your entire corpus.' },
  { num: '04', title: 'Search',   mt: 185, body: 'Vector similarity search scans every embedded chunk, ranking results by semantic closeness rather than keyword frequency.' },
  { num: '05', title: 'Retrieve', mt: 20,  body: 'Top passages are assembled with full inline citations and returned as a grounded, accurate answer — every time.' },
];

const seg = (a, b) => `M ${a.x},${a.y} L ${b.x},${b.y}`;

export default function HowItWorksSection({ visible }) {
  const rowRef   = useRef(null);
  const nodeRefs = useRef([]);
  const [pts, setPts]         = useState([]);
  const [hovered, setHovered] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const recalc = useCallback(() => {
    if (!rowRef.current) return;
    const rowRect = rowRef.current.getBoundingClientRect();
    const points = nodeRefs.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - rowRect.left + r.width  / 2,
        y: r.top  - rowRect.top  + r.height / 2,
      };
    }).filter(Boolean);
    if (points.length === steps.length) setPts(points);
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    const id = setTimeout(recalc, 60);
    window.addEventListener('resize', recalc);
    return () => { clearTimeout(id); window.removeEventListener('resize', recalc); };
  }, [visible, recalc]);

  const handleEnter = (i) => { setHovered(i); setAnimKey(k => k + 1); };
  const handleLeave = () => setHovered(null);

  const showGlow = pts.length === steps.length && hovered !== null && hovered < steps.length - 1;
  const a = showGlow ? pts[hovered]     : null;
  const b = showGlow ? pts[hovered + 1] : null;

  return (
    <section className="section" data-section="2">
      <p className={`sec-label reveal${visible ? ' visible' : ''}`}>How it works</p>
      <h2 className={`sec-heading reveal${visible ? ' visible' : ''}`} data-delay="1">
        Five steps to omniscience.
      </h2>

      <div className="zigzag-row" ref={rowRef}>
        <svg className="zigzag-svg" aria-hidden="true">
          <defs>
            {/* gradient aligned to the hovered segment's actual direction */}
            {showGlow && (
              <linearGradient
                id="segFadeGrad"
                gradientUnits="userSpaceOnUse"
                x1={a.x} y1={a.y}
                x2={b.x} y2={b.y}
              >
                <stop offset="0%"   stopColor="white" stopOpacity="0.9" />
                <stop offset="55%"  stopColor="white" stopOpacity="0.25" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            )}
          </defs>

          {/* dim base segments */}
          {pts.length === steps.length && pts.slice(0, -1).map((_, i) => (
            <path
              key={`base-${i}`}
              d={seg(pts[i], pts[i + 1])}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          ))}

          {/* fade-glow that draws itself from hovered node toward the next */}
          {showGlow && (
            <path
              key={`glow-${animKey}`}
              className="segment-fade-glow"
              d={seg(a, b)}
              fill="none"
              stroke="url(#segFadeGrad)"
              strokeWidth="2"
              pathLength="1"
            />
          )}

          {/* node dots */}
          {pts.map((p, i) => (
            <circle
              key={`dot-${i}`}
              cx={p.x} cy={p.y} r="3"
              className={hovered === i ? 'node-dot node-dot-active' : 'node-dot'}
            />
          ))}
        </svg>

        {steps.map((s, i) => (
          <div
            key={s.num}
            className={`zigzag-item reveal${visible ? ' visible' : ''}`}
            data-delay={String(i + 1)}
            style={{ marginTop: `${s.mt}px` }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          >
            <div
              className={`step-num${hovered === i ? ' step-num-glow' : ''}`}
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



