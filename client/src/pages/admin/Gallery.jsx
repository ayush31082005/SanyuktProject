import { useState, useEffect } from "react"
import api, { API_URL } from "../../api"

const STYLES = `
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }

.g-card {
    background:#fff; border:1px solid #e5e7eb; border-radius:12px;
    overflow:hidden; animation:slideUp 0.4s ease forwards; opacity:0;
    transition:box-shadow 0.2s,transform 0.2s;
}
.g-card:hover { box-shadow:0 6px 24px rgba(22,163,74,0.15); transform:translateY(-2px); }
.g-card img { width:100%; height:180px; object-fit:cover; display:block; transition:transform 0.4s; }
.g-card:hover img { transform:scale(1.04); }
.img-wrap { overflow:hidden; position:relative; }

.action-btn {
    display:flex; align-items:center; justify-content:center;
    width:34px; height:34px; border-radius:8px; border:none;
    cursor:pointer; transition:all 0.15s; font-size:14px;
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
    padding:20px; animation:fadeIn 0.2s ease; backdrop-filter:blur(3px);
}
.modal-box {
    background:#fff; border-radius:16px; width:100%; max-width:480px;
    animation:slideUp 0.25s ease; overflow:hidden;
}
.form-input {
    width:100%; padding:10px 14px; border:1.5px solid #e5e7eb;
    border-radius:8px; font-size:14px; font-family:sans-serif;
    outline:none; box-sizing:border-box; transition:border-color 0.2s;
}
.form-input:focus { border-color:#16a34a; }
.drop-zone {
    border:2px dashed #d1fae5; border-radius:10px;
    padding:28px 16px; text-align:center; cursor:pointer;
    transition:all 0.2s; background:#fafffe;
}
.drop-zone:hover,.drop-zone.active { border-color:#16a34a; background:#f0fdf4; }
.toast {
    position:fixed; bottom:28px; right:28px; z-index:9999;
    padding:12px 20px; border-radius:10px; font-family:sans-serif;
    font-size:14px; font-weight:600; animation:slideUp 0.3s ease;
    display:flex; align-items:center; gap:8px; box-shadow:0 4px 20px rgba(0,0,0,0.15);
}
`

function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
    const isSuccess = type === "success"
    return (
        <div className="toast" style={{ background: isSuccess ? "#f0fdf4" : "#fef2f2", color: isSuccess ? "#15803d" : "#dc2626", border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}` }}>
            {isSuccess ? "✓" : "✕"} {msg}
        </div>
    )
}

function ConfirmModal({ msg, onConfirm, onCancel }) {
    return (
        <div className="modal-bg" onClick={onCancel}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 360 }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>🗑️</div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#111" }}>Confirm Delete</h3>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: 14, fontFamily: "sans-serif" }}>{msg}</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#dc2626", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default function AdminGallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = "success") => setToast({ msg, type })

    const fetchGallery = async () => {
        try {
            const res = await api.get("/gallery/all")
            setGallery(res.data)
        } catch { showToast("Failed to load gallery", "error") }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchGallery() }, [])

    const handleDelete = async () => {
        try {
            await api.delete(`/gallery/delete/${deleteId}`)
            setGallery(prev => prev.filter(g => g._id !== deleteId))
            showToast("Image deleted successfully")
        } catch { showToast("Failed to delete image", "error") }
        finally { setDeleteId(null) }
    }

    const getImgUrl = (filename) => `${API_URL}/uploads/gallery/${filename}`

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
            <style>{STYLES}</style>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            {deleteId && <ConfirmModal msg="Are you sure you want to delete this image? This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", borderBottom: "1px solid #d1fae5", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#052e16" }}>Gallery Management</h1>
                    <p style={{ margin: 0, color: "#4b7a5a", fontSize: 13 }}>Add, edit or delete gallery images</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: "white", border: "1px solid #bbf7d0", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#15803d" }}>
                        {gallery.length} Images
                    </div>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Image
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div style={{ padding: 32 }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: 60 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #bbf7d0", borderTopColor: "#16a34a", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                        <p style={{ color: "#6b7280" }}>Loading gallery...</p>
                    </div>
                ) : gallery.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4", border: "2px dashed #86efac", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>🖼️</div>
                        <h3 style={{ color: "#374151", margin: "0 0 6px" }}>No images yet</h3>
                        <p style={{ color: "#9ca3af", margin: "0 0 20px" }}>Add your first gallery image</p>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add First Image</button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                        {gallery.map((item, i) => (
                            <div key={item._id} className="g-card" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="img-wrap">
                                    <img src={getImgUrl(item.image)} alt={`Gallery ${i + 1}`}
                                        onError={e => { e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='180'%3E%3Crect width='240' height='180' fill='%23f0fdf4'/%3E%3Ctext x='50%25' y='50%25' fill='%2386efac' font-size='12' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif'%3EImage not found%3C/text%3E%3C/svg%3E` }} />
                                </div>
                                <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                        #{i + 1} · {new Date(item.createdAt).toLocaleDateString('en-IN')}
                                    </span>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button className="action-btn btn-edit" title="Replace Image" onClick={() => setEditItem(item)}>
                                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button className="action-btn btn-delete" title="Delete" onClick={() => setDeleteId(item._id)}>
                                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <ImageModal
                    title="Add New Image"
                    onClose={() => setShowAddModal(false)}
                    onSuccess={(newItem) => {
                        setGallery(prev => [newItem, ...prev])
                        setShowAddModal(false)
                        showToast("Image added successfully!")
                    }}
                    showToast={showToast}
                />
            )}

            {/* Edit Modal */}
            {editItem && (
                <ImageModal
                    title="Replace Image"
                    editId={editItem._id}
                    currentImage={getImgUrl(editItem.image)}
                    onClose={() => setEditItem(null)}
                    onSuccess={(updated) => {
                        setGallery(prev => prev.map(g => g._id === updated._id ? updated : g))
                        setEditItem(null)
                        showToast("Image updated successfully!")
                    }}
                    showToast={showToast}
                />
            )}
        </div>
    )
}

function ImageModal({ title, editId, currentImage, onClose, onSuccess, showToast }) {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(currentImage || null)
    const [loading, setLoading] = useState(false)
    const [drag, setDrag] = useState(false)

    const handleFile = (f) => {
        if (!f) return
        setFile(f)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(f)
    }

    const handleDrop = (e) => {
        e.preventDefault(); setDrag(false)
        const f = e.dataTransfer.files[0]
        if (f && f.type.startsWith("image/")) handleFile(f)
    }

    const submit = async () => {
        if (!file && !editId) return showToast("Please select an image", "error")
        if (!file && editId) return showToast("Please select a new image to replace", "error")

        setLoading(true)
        const form = new FormData()
        form.append("image", file)

        try {
            let res
            if (editId) {
                res = await api.put(`/gallery/update/${editId}`, form)
                onSuccess(res.data.image)
            } else {
                res = await api.post("/gallery/add", form)
                onSuccess(res.data.image)
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Upload failed", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-bg" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div style={{ padding: 22 }}>
                    {/* Drop zone */}
                    <div
                        className={`drop-zone ${drag ? "active" : ""}`}
                        onDragOver={e => { e.preventDefault(); setDrag(true) }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("gal-file-input").click()}
                    >
                        <input id="gal-file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

                        {preview ? (
                            <div style={{ position: "relative" }}>
                                <img src={preview} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
                                <div style={{ marginTop: 10, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                                    {file ? `✓ ${file.name}` : "Current image (click to change)"}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                                <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#374151" }}>Drop image here</p>
                                <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>or <span style={{ color: "#16a34a" }}>click to browse</span> · PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                            Cancel
                        </button>
                        <button className="btn-primary" onClick={submit} disabled={loading} style={{ flex: 2, justifyContent: "center" }}>
                            {loading ? (
                                <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Uploading...</>
                            ) : editId ? "Update Image" : "Upload Image"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
