const cards = [
  {
    icon: '⬡',
    title: 'Absolute Synthesis',
    body: 'PDFs, CSVs, text files — ingested in full context. One unified knowledge base, always queryable.',
    delay: '1',
  },
  {
    icon: '◈',
    title: 'Fact-Grounded Output',
    body: 'Zero hallucinations. Every response carries inline citations tracing back to exact paragraphs in your files.',
    delay: '2',
  },
  {
    icon: '⟁',
    title: 'Instant Routing',
    body: 'Sub-50ms vector retrieval. Modern embeddings pinpoint the exact passage from thousands of pages in milliseconds.',
    delay: '3',
  },
];

function CapCard({ icon, title, body }) {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const r    = card.getBoundingClientRect();
    const x    = e.clientX - r.left;
    const y    = e.clientY - r.top;
    const rX   = ((y - r.height / 2) / r.height) * -11;
    const rY   = ((x - r.width  / 2) / r.width)  *  11;
    card.style.transform = `perspective(700px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(14px)`;
    card.style.setProperty('--cx', `${(x / r.width  * 100)}%`);
    card.style.setProperty('--cy', `${(y / r.height * 100)}%`);
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };
  return (
    <div className="cap-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <span className="cap-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function CapabilitiesSection({ visible }) {
  return (
    <section className="section" data-section="3">
      <p className={`sec-label reveal${visible ? ' visible' : ''}`}>System capabilities</p>
      <div className="card-row">
        {cards.map((c) => (
          <div
            key={c.title}
            className={`reveal${visible ? ' visible' : ''}`}
            data-delay={c.delay}
          >
            <CapCard icon={c.icon} title={c.title} body={c.body} />
          </div>
        ))}
      </div>
    </section>
  );
}
