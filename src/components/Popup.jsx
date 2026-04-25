import { useEffect, useRef } from "react";

const COLORS = ["#C4714A", "#8FA68A", "#C9A84C", "#1C1A16", "#C4714A88"];

export default function Popup({ onClose }) {
  const confettiRef = useRef(null);

  useEffect(() => {
    const wrap = confettiRef.current;
    if (!wrap) return;

    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      piece.style.width = piece.style.height = 6 + Math.random() * 6 + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.animationDelay = Math.random() * 0.8 + "s";
      piece.style.animationDuration = 1.2 + Math.random() * 0.8 + "s";
      wrap.appendChild(piece);
    }

    const timer = setTimeout(() => {
      if (wrap) wrap.innerHTML = "";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="confetti-wrap" ref={confettiRef} />
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <img 
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzd6anM0NGphM3E5bDUzdTdvc253anBpZTY3dnNidjgwNHBjbHFmMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/rrasLFSTyi4Th1e8Xo/giphy.gif" 
            alt="happycat"
            style={{ width: "240px", borderRadius: "12px" }}
          />
          <div className="popup-title">yey akhirnya selesai!</div>
          <div className="popup-sub">u did well, kamu keren bangett</div>
          <button className="popup-close" onClick={onClose}>
            yippie!
          </button>
        </div>
      </div>
    </>
  );
}
