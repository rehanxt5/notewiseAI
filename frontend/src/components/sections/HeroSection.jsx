export default function HeroSection({ visible }) {
  return (
    <section className="section" data-section="0">
      <p className={`hero-eyebrow reveal${visible ? ' visible' : ''}`}>
        v2.0 — Intelligence Layer
      </p>
      <h1 className="hero-title">
        <span className={`grad reveal${visible ? ' visible' : ''}`} data-delay="1">
          NoteWise
        </span>
        <span className={`reveal${visible ? ' visible' : ''}`} data-delay="2">
          <span className="ai-badge" data-t="A">A</span>
          <span className="ai-badge" data-t="I">I</span>
        </span>
      </h1>
      <p className={`hero-sub reveal${visible ? ' visible' : ''}`} data-delay="3">
        Transform scattered documents into a searchable, cited intelligence layer — and simply ask anything.
      </p>
      <div className={`hero-actions reveal${visible ? ' visible' : ''}`} data-delay="4">
        <button className="btn-primary">Initialize Workspace</button>
        <button className="btn-ghost">Watch demo</button>
      </div>
      <div className="scroll-cue">
        scroll
        <div className="scroll-cue-line" />
      </div>
    </section>
  );
}
