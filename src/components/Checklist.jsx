import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

function formatDeadline(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `Terlambat ${Math.abs(diff)} hari`, overdue: true };
  if (diff === 0) return { label: "Deadline hari ini!", overdue: true };
  if (diff === 1) return { label: "Deadline besok", overdue: false };
  return { label: `Deadline ${diff} hari lagi`, overdue: false };
}

export default function Checklist({ onComplete }) {
  const [checks, setChecks] = useLocalStorage("nitip_checks", []);
  const [textInput, setTextInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  function addCheck() {
    if (!textInput.trim()) return;
    setChecks([
      ...checks,
      { id: Date.now(), text: textInput.trim(), deadline: deadlineInput, done: false },
    ]);
    setTextInput("");
    setDeadlineInput("");
  }

  function toggleCheck(id) {
    const updated = checks.map((c) =>
      c.id === id ? { ...c, done: !c.done } : c
    );
    setChecks(updated);
    const item = checks.find((c) => c.id === id);
    if (item && !item.done) onComplete();
  }

  function deleteCheck(id) {
    setChecks(checks.filter((c) => c.id !== id));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditText(item.text);
    setEditDeadline(item.deadline || "");
  }

  function saveEdit(id) {
    setChecks(
      checks.map((c) =>
        c.id === id ? { ...c, text: editText.trim() || c.text, deadline: editDeadline } : c
      )
    );
    setEditingId(null);
  }

  const done = checks.filter((c) => c.done).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const pending = checks.filter((c) => !c.done);
  const completed = checks.filter((c) => c.done);
  const sorted = [...pending, ...completed];

  return (
    <div>
      <div className="add-checklist-row">
        <input
          type="text"
          className="check-text-input"
          placeholder="Tambah tugas baru..."
          maxLength={80}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCheck()}
        />
        <input
          type="date"
          className="deadline-input"
          value={deadlineInput}
          onChange={(e) => setDeadlineInput(e.target.value)}
          title="Pilih deadline"
        />
        <button className="btn-sage" onClick={addCheck}>
          Tambah
        </button>
      </div>

      {total > 0 && (
        <div className="progress-wrap card" style={{ marginBottom: 16 }}>
          <div className="progress-label">
            <span>Progress</span>
            <span>
              {done} / {total} &nbsp;·&nbsp; {pct}%
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {checks.length === 0 ? (
        <div className="empty-state">
          {/* <span className="big-emoji">✅</span> */}
          Belum ada tugas. Ayo mulai!
        </div>
      ) : (
        <div className="checklist-items">
          {sorted.map((item) => {
            const dl = formatDeadline(item.deadline);
            return (
              <div
                key={item.id}
                className={`check-item ${item.done ? "done" : ""} ${
                  dl?.overdue && !item.done ? "overdue" : ""
                }`}
              >
                <div
                  className={`check-box ${item.done ? "checked" : ""}`}
                  onClick={() => toggleCheck(item.id)}
                />
                <div className="check-content">
                  {editingId === item.id ? (
                    <>
                      <input
                        className="check-edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                      />
                      <input
                        type="date"
                        className="check-edit-deadline"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                      />
                      <div className="note-edit-actions" style={{ marginTop: 6 }}>
                        <button className="btn-save" onClick={() => saveEdit(item.id)}>
                          Simpan
                        </button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>
                          Batal
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span
                        className="check-label"
                        onClick={() => toggleCheck(item.id)}
                      >
                        {item.text}
                      </span>
                      {dl && !item.done && (
                        <span className="deadline-badge">{dl.label}</span>
                      )}
                    </>
                  )}
                </div>
                {editingId !== item.id && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn-icon" onClick={() => startEdit(item)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn-icon" onClick={() => deleteCheck(item.id)} title="Hapus">
                      ×
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
