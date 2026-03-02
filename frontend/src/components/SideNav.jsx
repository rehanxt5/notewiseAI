const TOTAL = 7;

export default function SideNav({ current, goTo }) {
  return (
    <div className="side-nav">
      {Array.from({ length: TOTAL }, (_, i) => (
        <div
          key={i}
          className={`side-dot${current === i ? ' active' : ''}`}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}
