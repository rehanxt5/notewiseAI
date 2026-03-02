export default function CtaSection({ visible }) {
  return (
    <section className="section" data-section="6">
      <div className={`cta-big reveal${visible ? ' visible' : ''}`}>
        <span className="dim">Start building</span><br />
        your second brain.
      </div>
      <p className={`cta-line reveal${visible ? ' visible' : ''}`} data-delay="1">
        No setup. No infrastructure. Upload and start asking.
      </p>
      <div className={`cta-actions reveal${visible ? ' visible' : ''}`} data-delay="2">
        <button className="btn-primary">Initialize Workspace</button>
        <button className="btn-ghost">Read the docs</button>
      </div>
      <div className="footer-bar">
        <span>© 2026 NoteWise AI</span>
        <span style={{ fontFamily: 'Space Grotesk' }}>Built for the curious.</span>
        <span>0.1.0-alpha</span>
      </div>
    </section>
  );
}
