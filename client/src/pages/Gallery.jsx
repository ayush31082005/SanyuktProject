import { useEffect, useState } from "react"
import api, { API_URL } from "../api"

function Gallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        api.get("/gallery/all")
            .then(res => {
                setGallery(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error fetching gallery:", err)
                setLoading(false)
            })
    }, [])

    const openLightbox = (item, index) => {
        setSelectedImage(item)
        setSelectedIndex(index)
    }

    const closeLightbox = () => setSelectedImage(null)

    const prevImage = (e) => {
        e.stopPropagation()
        const newIndex = (selectedIndex - 1 + gallery.length) % gallery.length
        setSelectedImage(gallery[newIndex])
        setSelectedIndex(newIndex)
    }

    const nextImage = (e) => {
        e.stopPropagation()
        const newIndex = (selectedIndex + 1) % gallery.length
        setSelectedImage(gallery[newIndex])
        setSelectedIndex(newIndex)
    }

    const getImageUrl = (filename) => `${API_URL}/uploads/gallery/${filename}`

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: '4px solid #bbf7d0', borderTopColor: '#16a34a',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#15803d', fontWeight: 600, fontSize: 16 }}>Loading gallery...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, serif' }}>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.94); }
                    to { opacity: 1; transform: scale(1); }
                }
                .gallery-card {
                    animation: fadeUp 0.5s ease forwards;
                    opacity: 0;
                    cursor: pointer;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    position: relative;
                }
                .gallery-card:hover {
                    box-shadow: 0 8px 32px rgba(22,163,74,0.18);
                    transform: translateY(-4px);
                }
                .gallery-card img {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.5s ease;
                }
                .gallery-card:hover img {
                    transform: scale(1.06);
                }
                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(5,46,22,0.75) 0%, transparent 55%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    align-items: flex-end;
                    padding: 16px;
                }
                .gallery-card:hover .card-overlay {
                    opacity: 1;
                }
                .zoom-btn {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    background: rgba(255,255,255,0.92);
                    border-radius: 50%;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .gallery-card:hover .zoom-btn {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                .badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255,255,255,0.92);
                    color: #15803d;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 99px;
                    font-family: sans-serif;
                    letter-spacing: 0.5px;
                }
                .lightbox-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.15);
                    border: none;
                    color: white;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                    backdrop-filter: blur(4px);
                }
                .lightbox-nav:hover { background: rgba(255,255,255,0.3); }
            `}</style>

            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
                borderBottom: '1px solid #d1fae5',
                padding: '60px 24px 48px',
                textAlign: 'center',
                animation: 'fadeIn 0.6s ease'
            }}>
                <div style={{
                    display: 'inline-block',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 2,
                    padding: '5px 16px',
                    borderRadius: 99,
                    marginBottom: 18,
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase'
                }}>Our Memories</div>

                <h1 style={{
                    fontSize: 'clamp(36px, 5vw, 58px)',
                    fontWeight: 800,
                    color: '#052e16',
                    margin: '0 0 12px',
                    letterSpacing: '-1px',
                    lineHeight: 1.1
                }}>Beautiful Moments</h1>

                <div style={{ width: 48, height: 3, background: '#16a34a', borderRadius: 99, margin: '0 auto 16px' }} />

                <p style={{
                    color: '#4b7a5a',
                    fontSize: 17,
                    maxWidth: 480,
                    margin: '0 auto',
                    fontFamily: 'sans-serif',
                    lineHeight: 1.6
                }}>
                    Explore our collection of cherished memories and events
                </p>

                {gallery.length > 0 && (
                    <div style={{
                        marginTop: 24,
                        display: 'inline-flex',
                        gap: 24,
                        background: 'white',
                        border: '1px solid #d1fae5',
                        borderRadius: 12,
                        padding: '10px 24px',
                        fontFamily: 'sans-serif'
                    }}>
                        <span style={{ color: '#15803d', fontWeight: 700, fontSize: 15 }}>
                            {gallery.length} <span style={{ color: '#6b7280', fontWeight: 400 }}>Photos</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Gallery Grid */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
                {gallery.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 24px',
                        animation: 'fadeIn 0.6s ease'
                    }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: '#f0fdf4', border: '2px dashed #86efac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <svg width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>No Images Yet</h3>
                        <p style={{ color: '#9ca3af', fontFamily: 'sans-serif' }}>Gallery will appear here once admin adds photos.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 20
                    }}>
                        {gallery.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="gallery-card"
                                style={{ animationDelay: `${index * 70}ms` }}
                                onClick={() => openLightbox(item, index)}
                            >
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={`Gallery ${index + 1}`}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.background = '#f0fdf4'
                                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='220' viewBox='0 0 260 220'%3E%3Crect width='260' height='220' fill='%23f0fdf4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2386efac' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E`
                                    }}
                                />
                                <div className="card-overlay">
                                    <span style={{ color: 'white', fontSize: 13, fontFamily: 'sans-serif', fontWeight: 500 }}>
                                        Click to view
                                    </span>
                                </div>
                                <div className="zoom-btn">
                                    <svg width="18" height="18" fill="none" stroke="#15803d" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                    </svg>
                                </div>
                                <div className="badge">#{index + 1}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                        animation: 'fadeIn 0.2s ease'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            maxWidth: '90vw',
                            maxHeight: '88vh',
                            animation: 'scaleIn 0.25s ease'
                        }}
                    >
                        <img
                            src={getImageUrl(selectedImage.image)}
                            alt="Gallery full"
                            style={{
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: 10,
                                display: 'block'
                            }}
                        />

                        {/* Counter */}
                        <div style={{
                            position: 'absolute', bottom: -38, left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'rgba(255,255,255,0.6)',
                            fontFamily: 'sans-serif', fontSize: 13
                        }}>
                            {selectedIndex + 1} / {gallery.length}
                        </div>
                    </div>

                    {/* Prev */}
                    <button className="lightbox-nav" onClick={prevImage} style={{ left: 16 }}>
                        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next */}
                    <button className="lightbox-nav" onClick={nextImage} style={{ right: 16 }}>
                        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Close */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'fixed', top: 20, right: 20,
                            background: 'rgba(255,255,255,0.12)',
                            border: 'none', color: 'white',
                            width: 40, height: 40, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', backdropFilter: 'blur(4px)',
                            transition: 'background 0.2s'
                        }}
                    >
                        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Gallery
