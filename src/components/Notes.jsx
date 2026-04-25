import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Notes() {
  const [notes, setNotes] = useLocalStorage("nitip_notes", []);
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  function addNote() {
    if (!titleInput.trim() && !bodyInput.trim()) return;
    const newNote = {
      id: Date.now(),
      title: titleInput.trim() || "(tanpa judul)",
      body: bodyInput.trim(),
    };
    setNotes([newNote, ...notes]);
    setTitleInput("");
    setBodyInput("");
  }

  function deleteNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  function startEdit(note) {
    setEditingId(note.id);
    setEditTitle(note.title === "(tanpa judul)" ? "" : note.title);
    setEditBody(note.body);
  }

  function saveEdit(id) {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? { ...n, title: editTitle.trim() || "(tanpa judul)", body: editBody.trim() }
          : n
      )
    );
    setEditingId(null);
  }

  return (
    <div>
      <div className="add-note-area">
        <input
          type="text"
          placeholder="Judul catatan..."
          maxLength={60}
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
        <textarea
          placeholder="Tulis sesuatu di sini..."
          value={bodyInput}
          onChange={(e) => setBodyInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) addNote();
          }}
        />
        <div className="add-row">
          <button className="btn-primary" onClick={addNote}>
            Simpan catatan
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <span className="big-emoji">📝</span>
          Belum ada catatan. Tulis sesuatu!
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              {editingId === note.id ? (
                <>
                  <input
                    className="note-edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Judul..."
                  />
                  <textarea
                    className="note-edit-textarea"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    placeholder="Isi catatan..."
                  />
                  <div className="note-edit-actions">
                    <button className="btn-save" onClick={() => saveEdit(note.id)}>
                      Simpan
                    </button>
                    <button className="btn-cancel" onClick={() => setEditingId(null)}>
                      Batal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="note-actions">
                    <button className="btn-icon" onClick={() => startEdit(note)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn-icon" onClick={() => deleteNote(note.id)} title="Hapus">
                      ×
                    </button>
                  </div>
                  <div className="note-title">{note.title}</div>
                  {note.body && <div className="note-body">{note.body}</div>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
