import { useState, useRef, useCallback, useEffect } from 'react';

const CARDS = [
  {
    icon: '⚡',
    title: 'Blazing Fast',
    body: 'Sub-50ms vector retrieval. Modern embeddings pinpoint exact passages from thousands of pages in milliseconds.',
  },
  {
    icon: '◈',
    title: 'Talk with Documents',
    body: 'Ask anything. Get precise, context-aware answers drawn directly from your uploaded files — conversationally.',
  },
  {
    icon: '⬡',
    title: 'Fact-Grounded Answers',
    body: 'Zero hallucinations. Every response carries inline citations tracing back to exact paragraphs in your files.',
  },
  {
    icon: '⟁',
    title: 'Quiz Generation',
    body: 'Automatically generate targeted quizzes from your content to reinforce learning and test comprehension.',
  },
  {
    icon: '◎',
    title: 'Podcast Generation',
    body: 'Transform dense documents into engaging audio podcasts. Consume your knowledge base on the go.',
  },
  {
    icon: '▣',
    title: 'Flashcard Generation',
    body: 'Convert complex material into concise flashcards for rapid review and long-term retention.',
  },
];

const N    = CARDS.length;  // 6
const STEP = 360 / N;       // 60°

export default function CapabilitiesSection({ visible }) {
  const [active,  setActive]  = useState(0);
  const [ringRot, setRingRot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = useCallback((i) => {
    if (i === active) return;
    let diff = i - active;
    if (diff >  N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    setRingRot(r => r - diff * STEP);
    setActive(i);
  }, [active]);

  const goNext = useCallback(() => goTo((active + 1) % N), [active, goTo]);
  const goPrev = useCallback(() => goTo((active - 1 + N) % N), [active, goTo]);

  // Touch swipe for the dial on mobile
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      dx > 0 ? goNext() : goPrev();
    }
  }, [goNext, goPrev]);

  // circular distance — cards ≥ 2 steps away are back-facing
  const circDist = (i) => {
    const d = ((i - active) % N + N) % N;
    return Math.min(d, N - d);
  };

  // Mobile card list layout
  if (isMobile) {
    return (
      <section className="section" data-section="3">
        <p className={`sec-label reveal${visible ? ' visible' : ''}`}>System capabilities</p>
        <h2 className={`sec-heading reveal${visible ? ' visible' : ''}`} data-delay="1">
          Everything you need.
        </h2>
        <div
          className="mobile-cards-swipe"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="mobile-cards-track" style={{ transform: `translateX(${-active * 100}%)` }}>
            {CARDS.map((card, i) => (
              <div key={i} className={`mobile-card${active === i ? ' mobile-card-active' : ''}`}>
                <span className="dial-card-icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
          <div className="dial-dots" style={{ position: 'relative', bottom: 'auto', marginTop: '20px' }}>
            {CARDS.map((_, i) => (
              <button
                key={i}
                className={`dial-dot${active === i ? ' dial-dot-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={CARDS[i].title}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" data-section="3">
      <p className={`sec-label reveal${visible ? ' visible' : ''}`}>System capabilities</p>
      <h2 className={`sec-heading reveal${visible ? ' visible' : ''}`} data-delay="1">
        Everything you need.
      </h2>

      <div className="dial-scene">
        {/* decorative axis ring */}
        <div className="dial-axis-ring" />

        <div
          className="dial-ring"
          style={{ transform: `rotateY(${ringRot}deg)` }}
        >
          {CARDS.map((card, i) => {
            const back = circDist(i) >= 2;
            return (
              <div
                key={i}
                className={[
                  'dial-card',
                  active === i ? 'dial-card-active' : '',
                  back ? 'dial-card-back' : '',
                ].filter(Boolean).join(' ')}
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(360px)` }}
                onMouseEnter={back ? undefined : () => goTo(i)}
              >
                {/* glass overlay — covers mirrored text on back cards */}
                <div className="dial-card-glass-overlay" />
                <span className="dial-card-icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            );
          })}
        </div>

        {/* dot indicators below the dial */}
        <div className="dial-dots">
          {CARDS.map((_, i) => (
            <button
              key={i}
              className={`dial-dot${active === i ? ' dial-dot-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={CARDS[i].title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
