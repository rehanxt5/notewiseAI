import { useRef } from 'react';

export default function StatementSection({ visible }) {
  const textRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!textRef.current) return;
    const sec = e.currentTarget.getBoundingClientRect();
    const rx  = ((e.clientY - sec.top  - sec.height / 2) / sec.height) * -9;
    const ry  = ((e.clientX - sec.left - sec.width  / 2) / sec.width)  *  9;
    textRef.current.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleMouseLeave = () => {
    if (textRef.current)
      textRef.current.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <section className="section" data-section="1" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="orbit-rig">
        <div className="orbit-ring" />
        <div className="orbit-ring" />
        <div className="orbit-ring" />
      </div>
      <div
        ref={textRef}
        className={`statement-text reveal${visible ? ' visible' : ''}`}
        style={{ transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg)' }}
      >
        Upload the chaos.<br />
        <em>We build the neural links.</em>
      </div>
    </section>
  );
}
