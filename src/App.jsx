import { useState, useEffect } from "react";
import Notes from "./components/Notes";
import Checklist from "./components/Checklist";
import Popup from "./components/Popup";
import "./style.css";

// icons
import { WiDaySunny } from 'react-icons/wi';
import { MdNightlight } from 'react-icons/md';

export default function App() {
  const [tab, setTab] = useState("notes");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("nitip_dark") === "true";
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("nitip_dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          Niti<span>p</span>
        </div>
        <p className="tagline">catatan & checklist harianmu</p>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle dark mode"
        >
          {darkMode ? <WiDaySunny /> : <MdNightlight />}
        </button>
      </header>

      <div className="tabs">
        <button
          className={`tab ${tab === "notes" ? "active" : ""}`}
          onClick={() => setTab("notes")}
        >
          Catatan
        </button>
        <button
          className={`tab ${tab === "checklist" ? "active" : ""}`}
          onClick={() => setTab("checklist")}
        >
          Checklist
        </button>
      </div>

      {tab === "notes" && <Notes />}
      {tab === "checklist" && <Checklist onComplete={() => setShowPopup(true)} />}

      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
