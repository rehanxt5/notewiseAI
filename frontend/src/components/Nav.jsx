import { useState, useCallback } from 'react';

export default function Nav({ goTo }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useCallback((idx) => {
    setMenuOpen(false);
    goTo(idx);
  }, [goTo]);

  return (
    <nav>
      <div className="nav-logo">
        <svg width="21" height="21" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8">
          <path d="M20 80 V20 L50 50 V80 L80 50 V20" strokeLinejoin="round" strokeLinecap="square" />
        </svg>
        NoteWise
      </div>

      {/* Hamburger toggle — visible only on mobile */}
      <button
        className={`nav-hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      <div className={`nav-right${menuOpen ? ' nav-right-open' : ''}`}>
        <span onClick={() => navigate(2)}>How it works</span>
        <span onClick={() => navigate(3)}>Features</span>
        <span onClick={() => navigate(6)}>Get started</span>
      </div>

      {/* Overlay backdrop for mobile menu */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
