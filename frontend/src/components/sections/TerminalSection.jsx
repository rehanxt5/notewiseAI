export default function TerminalSection({ visible }) {
  return (
    <section className="section" data-section="5">
      <p className={`sec-label reveal${visible ? ' visible' : ''}`}>The interface</p>
      <h2 className={`sec-heading reveal${visible ? ' visible' : ''}`} data-delay="1">
        Query like a conversation.
      </h2>
      <div className={`terminal-frame reveal${visible ? ' visible' : ''}`} data-delay="2">
        <div className="terminal-bar">
          <div className="t-dot" /><div className="t-dot" /><div className="t-dot" />
          <div className="t-title">notewise &mdash; workspace:research_2026</div>
        </div>
        <div className="terminal-body">
          <div className="t-line">
            <span className="t-prompt">›</span>
            <span className="t-cmd">upload ./papers/ ./notes/ ./data.csv</span>
          </div>
          <div className="t-line">
            <span className="t-out"><span className="t-ok">✓</span> Ingested 48 files — 2.1M tokens indexed in 3.4s</span>
          </div>
          <div className="t-line" style={{ marginTop: 6 }}>
            <span className="t-prompt">›</span>
            <span className="t-cmd">ask &quot;What were the key risks flagged in Q3?&quot;</span>
          </div>
          <div className="t-line">
            <span className="t-out">
              <span className="t-hi">NoteWise:</span> Based on{' '}
              <span className="t-ok">report_q3.pdf §4.2</span> and{' '}
              <span className="t-ok">board_notes.md:87</span>,
            </span>
          </div>
          <div className="t-line">
            <span className="t-out">the primary risks were supply chain delays and FX exposure.</span>
          </div>
          <div className="t-line">
            <span className="t-out">
              Confidence: <span className="t-ok">98.4%</span> — 3 sources cross-referenced.
            </span>
          </div>
          <div className="t-line" style={{ marginTop: 6 }}>
            <span className="t-prompt">›</span>
            <span className="t-cmd"><span className="t-cursor" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
