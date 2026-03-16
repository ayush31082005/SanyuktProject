import { useState, useEffect } from "react"
import api, { API_URL } from "../../api"

const STYLES = `
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }

.ev-card {
    background:#fff; border:1px solid #e5e7eb; border-radius:12px;
    overflow:hidden; animation:slideUp 0.4s ease forwards; opacity:0;
    transition:box-shadow 0.2s,transform 0.2s;
}
.ev-card:hover { box-shadow:0 6px 24px rgba(22,163,74,0.15); transform:translateY(-2px); }
.ev-card img { width:100%; height:160px; object-fit:cover; display:block; transition:transform 0.4s; }
.ev-card:hover img { transform:scale(1.04); }
.img-wrap { overflow:hidden; position:relative; }

.action-btn {
    display:flex; align-items:center; justify-content:center;
    width:32px; height:32px; border-radius:7px; border:none;
    cursor:pointer; transition:all 0.15s;
}
.btn-edit { background:#f0fdf4; color:#15803d; }
.btn-edit:hover { background:#dcfce7; }
.btn-delete { background:#fef2f2; color:#dc2626; }
.btn-delete:hover { background:#fee2e2; }
.btn-primary {
    background:linear-gradient(135deg,#16a34a,#15803d);
    color:white; border:none; border-radius:10px;
    padding:10px 22px; font-weight:600; font-size:14px;
    cursor:pointer; transition:opacity 0.2s; display:flex; align-items:center; gap:6px;
}
.btn-primary:hover { opacity:0.9; }
.btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

.modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,0.55);
    z-index:999; display:flex; align-items:center; justify-content:center;
    padding:16px; animation:fadeIn 0.2s ease; backdrop-filter:blur(3px);
}
.modal-box {
    background:#fff; border-radius:16px; width:100%; max-width:640px;
    animation:slideUp 0.25s ease; max-height:92vh; overflow-y:auto;
}
.form-input {
    width:100%; padding:10px 13px; border:1.5px solid #e5e7eb;
    border-radius:8px; font-size:14px; font-family:sans-serif;
    outline:none; box-sizing:border-box; transition:border-color 0.2s;
}
.form-input:focus { border-color:#16a34a; }
.form-label { display:block; font-size:12px; font-weight:700; color:#374151; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.5px; }
.drop-zone {
    border:2px dashed #d1fae5; border-radius:10px;
    padding:20px; text-align:center; cursor:pointer;
    transition:all 0.2s; background:#fafffe;
}
.drop-zone:hover,.drop-zone.active { border-color:#16a34a; background:#f0fdf4; }
.toast {
    position:fixed; bottom:28px; right:28px; z-index:9999;
    padding:12px 20px; border-radius:10px; font-family:sans-serif;
    font-size:14px; font-weight:600; animation:slideUp 0.3s ease;
    display:flex; align-items:center; gap:8px; box-shadow:0 4px 20px rgba(0,0,0,0.15);
}
.cat-badge {
    display:inline-block; padding:3px 10px; border-radius:99px;
    font-size:11px; font-weight:700; font-family:sans-serif;
}
`

const CAT_COLORS = {
    Meeting: { bg: "#dbeafe", color: "#1d4ed8" },
    Celebration: { bg: "#fef3c7", color: "#d97706" },
    Workshop: { bg: "#f3e8ff", color: "#7c3aed" },
    Festival: { bg: "#fce7f3", color: "#be185d" },
    Other: { bg: "#f0fdf4", color: "#15803d" },
}

function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
    const ok = type === "success"
    return (
        <div className="toast" style={{ background: ok ? "#f0fdf4" : "#fef2f2", color: ok ? "#15803d" : "#dc2626", border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}` }}>
            {ok ? "✓" : "✕"} {msg}
        </div>
    )
}

function ConfirmModal({ msg, onConfirm, onCancel }) {
    return (
        <div className="modal-bg" onClick={onCancel}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", animation: "slideUp 0.25s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>🗑️</div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700 }}>Delete Event?</h3>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: 14, fontFamily: "sans-serif" }}>{msg}</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#dc2626", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default function AdminEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = "success") => setToast({ msg, type })

    const fetchEvents = async () => {
        try {
            const res = await api.get("/events/all")
            setEvents(res.data)
        } catch { showToast("Failed to load events", "error") }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchEvents() }, [])

    const handleDelete = async () => {
        try {
            await api.delete(`/events/delete/${deleteId}`)
            setEvents(prev => prev.filter(e => e._id !== deleteId))
            showToast("Event deleted successfully")
        } catch { showToast("Failed to delete event", "error") }
        finally { setDeleteId(null) }
    }

    const getImgUrl = (fn) => `${API_URL}/uploads/events/${fn}`

    const formatDate = (d) => {
        if (!d) return "No date"
        try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }
        catch { return d }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
            <style>{STYLES}</style>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            {deleteId && <ConfirmModal msg="This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", borderBottom: "1px solid #d1fae5", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#052e16" }}>Seminar & Event Management</h1>
                    <p style={{ margin: 0, color: "#4b7a5a", fontSize: 13 }}>Add, edit or delete events and seminars</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: "white", border: "1px solid #bbf7d0", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#15803d" }}>
                        {events.length} Events
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Event
                    </button>
                </div>
            </div>

            {/* Events List */}
            <div style={{ padding: 32 }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 60 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #bbf7d0", borderTopColor: "#16a34a", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                        <p style={{ color: "#6b7280" }}>Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                        <h3 style={{ color: "#374151", margin: "0 0 6px" }}>No events yet</h3>
                        <p style={{ color: "#9ca3af", margin: "0 0 20px" }}>Add your first event or seminar</p>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add First Event</button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
                        {events.map((item, i) => {
                            const cat = CAT_COLORS[item.category] || CAT_COLORS.Other
                            return (
                                <div key={item._id} className="ev-card" style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="img-wrap">
                                        <img src={getImgUrl(item.image)} alt={item.title}
                                            onError={e => { e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160'%3E%3Crect width='300' height='160' fill='%23f0fdf4'/%3E%3Ctext x='50%25' y='50%25' fill='%2386efac' font-size='12' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EEvent Image%3C/text%3E%3C/svg%3E` }} />

                                        {item.date && (
                                            <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.93)", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#15803d" }}>
                                                📅 {formatDate(item.date)}
                                            </div>
                                        )}
                                        {item.category && (
                                            <div className="cat-badge" style={{ position: "absolute", top: 10, right: 10, background: cat.bg, color: cat.color }}>{item.category}</div>
                                        )}
                                    </div>

                                    <div style={{ padding: "14px 16px" }}>
                                        <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</h3>
                                        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#6b7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.content}</p>

                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                                            {item.time && <span style={{ fontSize: 11, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "2px 9px" }}>⏰ {item.time}</span>}
                                            {item.location && <span style={{ fontSize: 11, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "2px 9px" }}>📍 {item.location}</span>}
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
                                            <span style={{ fontSize: 11, color: "#d1d5db" }}>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button className="action-btn btn-edit" title="Edit" onClick={() => setEditItem(item)}>
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button className="action-btn btn-delete" title="Delete" onClick={() => setDeleteId(item._id)}>
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <EventModal
                    title="Add New Event"
                    onClose={() => setShowAddModal(false)}
                    onSuccess={(newItem) => { setEvents(prev => [newItem, ...prev]); setShowAddModal(false); showToast("Event added!") }}
                    showToast={showToast}
                />
            )}

            {/* Edit Modal */}
            {editItem && (
                <EventModal
                    title="Edit Event"
                    event={editItem}
                    onClose={() => setEditItem(null)}
                    onSuccess={(updated) => { setEvents(prev => prev.map(e => e._id === updated._id ? updated : e)); setEditItem(null); showToast("Event updated!") }}
                    showToast={showToast}
                />
            )}
        </div>
    )
}

function EventModal({ title, event, onClose, onSuccess, showToast }) {
    const isEdit = !!event
    const [form, setForm] = useState({
        title: event?.title || "",
        content: event?.content || "",
        date: event?.date || "",
        time: event?.time || "",
        location: event?.location || "",
        category: event?.category || "",
    })
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(event?.image ? `${API_URL}/uploads/events/${event.image}` : null)
    const [loading, setLoading] = useState(false)
    const [drag, setDrag] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleFile = (f) => {
        if (!f || !f.type.startsWith("image/")) return showToast("Please select a valid image", "error")
        setFile(f)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(f)
    }

    const validate = () => {
        if (!form.title.trim()) { showToast("Title is required", "error"); return false }
        if (!form.content.trim()) { showToast("Description is required", "error"); return false }
        if (!isEdit && !file) { showToast("Image is required", "error"); return false }
        return true
    }

    const submit = async () => {
        if (!validate()) return
        setLoading(true)

        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        if (file) fd.append("image", file)

        try {
            let res
            if (isEdit) {
                res = await api.put(`/events/update/${event._id}`, fd)
                onSuccess(res.data.event)
            } else {
                res = await api.post("/events/add", fd)
                onSuccess(res.data.event)
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to save event", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-bg" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {/* Left col */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label className="form-label">Event Title *</label>
                            <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g., Annual Gathering" maxLength={100} />
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{form.title.length}/100</div>
                        </div>

                        <div>
                            <label className="form-label">Description *</label>
                            <textarea className="form-input" value={form.content} onChange={e => set("content", e.target.value)} placeholder="Describe the event..." rows={4} maxLength={500} style={{ resize: "vertical" }} />
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{form.content.length}/500</div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                                <label className="form-label">Date</label>
                                <input type="date" className="form-input" value={form.date} onChange={e => set("date", e.target.value)} />
                            </div>
                            <div>
                                <label className="form-label">Time</label>
                                <input type="time" className="form-input" value={form.time} onChange={e => set("time", e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Location</label>
                            <input className="form-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g., Community Hall" />
                        </div>

                        <div>
                            <label className="form-label">Category</label>
                            <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
                                <option value="">Select Category</option>
                                {["Meeting", "Celebration", "Workshop", "Festival", "Other"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right col - Image */}
                    <div>
                        <label className="form-label">Event Image {!isEdit && "*"}</label>
                        <div
                            className={`drop-zone ${drag ? "active" : ""}`}
                            style={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
                            onDragOver={e => { e.preventDefault(); setDrag(true) }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
                            onClick={() => document.getElementById("ev-file-input").click()}
                        >
                            <input id="ev-file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

                            {preview ? (
                                <div style={{ width: "100%" }}>
                                    <img src={preview} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
                                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "#16a34a", fontWeight: 600, textAlign: "center" }}>
                                        {file ? `✓ ${file.name}` : "Click to change image"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>🖼️</div>
                                    <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#374151", fontSize: 13 }}>Drop image here</p>
                                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>or <span style={{ color: "#16a34a" }}>browse</span></p>
                                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#d1d5db" }}>JPG, PNG, GIF · Max 5MB</p>
                                </>
                            )}
                        </div>

                        {isEdit && (
                            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, fontStyle: "italic" }}>
                                Leave empty to keep current image
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "14px 22px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", fontWeight: 600, cursor: "pointer", fontSize: 14, color: "#374151" }}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={submit} disabled={loading}>
                        {loading ? (
                            <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Saving...</>
                        ) : isEdit ? "Save Changes" : "Add Event"}
                    </button>
                </div>
            </div>
        </div>
    )
}
