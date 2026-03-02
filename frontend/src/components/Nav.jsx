export default function Nav({ goTo }) {
  return (
    <nav>
      <div className="nav-logo">
        <svg width="21" height="21" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="8">
          <path d="M20 80 V20 L50 50 V80 L80 50 V20" strokeLinejoin="round" strokeLinecap="square" />
        </svg>
        NoteWise
      </div>
      <div className="nav-right">
        <span onClick={() => goTo(2)}>How it works</span>
        <span onClick={() => goTo(3)}>Features</span>
        <span onClick={() => goTo(6)}>Get started</span>
      </div>
    </nav>
  );
}
