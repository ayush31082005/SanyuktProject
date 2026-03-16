import { useEffect, useState } from "react"
import api, { API_URL } from "../api"

function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/all")
            setEvents(response.data)
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return null
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        } catch { return dateString }
    }

    const formatTime = (timeString) => {
        if (!timeString) return null
        try {
            const [h, m] = timeString.split(':')
            const hour = parseInt(h)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour % 12 || 12
            return `${displayHour}:${m} ${ampm}`
        } catch { return timeString }
    }

    const getImageUrl = (filename) => `${API_URL}/uploads/events/${filename}`

    const categoryColors = {
        Meeting: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
        Celebration: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
        Workshop: { bg: '#f3e8ff', text: '#7c3aed', border: '#e9d5ff' },
        Festival: { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' },
        Other: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: '4px solid #bbf7d0', borderTopColor: '#16a34a',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#15803d', fontWeight: 600, fontSize: 16, fontFamily: 'sans-serif' }}>Loading events...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, serif' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to { opacity: 1; transform: scale(1); }
                }
                .event-card {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    overflow: hidden;
                    animation: fadeUp 0.5s ease forwards;
                    opacity: 0;
                    transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
                    cursor: pointer;
                }
                .event-card:hover {
                    box-shadow: 0 12px 40px rgba(22,163,74,0.15);
                    transform: translateY(-5px);
                    border-color: #86efac;
                }
                .event-card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .event-card:hover img { transform: scale(1.05); }
                .img-wrap { overflow: hidden; position: relative; }
                .img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(5,46,22,0.6) 0%, transparent 50%);
                }
                .detail-btn {
                    display: flex; align-items: center; gap: 6px;
                    color: #15803d; font-weight: 600; font-size: 14px;
                    font-family: sans-serif;
                    background: none; border: none; cursor: pointer;
                    padding: 0; transition: gap 0.2s ease;
                }
                .event-card:hover .detail-btn { gap: 10px; }
                .modal-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 1000;
                    display: flex; align-items: center; justify-content: center;
                    padding: 24px;
                    animation: fadeIn 0.2s ease;
                    backdrop-filter: blur(4px);
                }
                .modal-box {
                    background: white; border-radius: 20px;
                    max-width: 580px; width: 100%;
                    overflow: hidden; animation: scaleIn 0.25s ease;
                    max-height: 90vh; overflow-y: auto;
                }
                .tag {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 4px 12px; border-radius: 99px;
                    font-size: 12px; font-weight: 600; font-family: sans-serif;
                }
            `}</style>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
                borderBottom: '1px solid #d1fae5',
                padding: '60px 24px 48px',
                textAlign: 'center',
                animation: 'fadeIn 0.6s ease'
            }}>
                <div style={{
                    display: 'inline-block',
                    background: '#dcfce7', border: '1px solid #86efac',
                    color: '#15803d', fontSize: 11, fontWeight: 700,
                    letterSpacing: 2, padding: '5px 16px', borderRadius: 99,
                    marginBottom: 18, fontFamily: 'sans-serif', textTransform: 'uppercase'
                }}>Upcoming & Recent</div>

                <h1 style={{
                    fontSize: 'clamp(34px, 5vw, 56px)',
                    fontWeight: 800, color: '#052e16',
                    margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.1
                }}>Our Seminars & Events</h1>

                <div style={{ width: 48, height: 3, background: '#16a34a', borderRadius: 99, margin: '0 auto 16px' }} />

                <p style={{
                    color: '#4b7a5a', fontSize: 16, maxWidth: 460,
                    margin: '0 auto', fontFamily: 'sans-serif', lineHeight: 1.6
                }}>
                    Join us for exciting events, workshops and celebrations
                </p>

                {/* Stats */}
                {events.length > 0 && (
                    <div style={{
                        marginTop: 28,
                        display: 'inline-flex', gap: 32,
                        background: 'white', border: '1px solid #d1fae5',
                        borderRadius: 12, padding: '12px 28px',
                        fontFamily: 'sans-serif'
                    }}>
                        {[
                            { label: 'Total Events', val: events.length },
                            { label: 'Scheduled', val: events.filter(e => e.date).length },
                            { label: 'With Location', val: events.filter(e => e.location).length },
                        ].map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#052e16' }}>{s.val}</div>
                                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, letterSpacing: 0.5 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Events Grid */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
                {events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeIn 0.6s ease' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: '#f0fdf4', border: '2px dashed #86efac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <svg width="36" height="36" fill="none" stroke="#16a34a" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>No Events Yet</h3>
                        <p style={{ color: '#9ca3af', fontFamily: 'sans-serif' }}>Events will appear here once admin adds them.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 24
                    }}>
                        {events.map((item, index) => {
                            const catStyle = categoryColors[item.category] || categoryColors.Other
                            return (
                                <div
                                    key={item._id || index}
                                    className="event-card"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => setSelectedEvent(item)}
                                >
                                    {/* Image */}
                                    <div className="img-wrap">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            onError={(e) => {
                                                e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'%3E%3Crect width='320' height='200' fill='%23f0fdf4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2386efac' font-size='13' font-family='sans-serif'%3EEvent Image%3C/text%3E%3C/svg%3E`
                                            }}
                                        />
                                        <div className="img-overlay" />

                                        {/* Date badge */}
                                        {item.date && (
                                            <div style={{
                                                position: 'absolute', top: 12, left: 12,
                                                background: 'rgba(255,255,255,0.95)',
                                                borderRadius: 10, padding: '5px 12px',
                                                display: 'flex', alignItems: 'center', gap: 5,
                                                fontFamily: 'sans-serif', fontSize: 12,
                                                fontWeight: 600, color: '#15803d'
                                            }}>
                                                <svg width="13" height="13" fill="#16a34a" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {formatDate(item.date)}
                                            </div>
                                        )}

                                        {!item.date && (
                                            <div style={{
                                                position: 'absolute', top: 12, left: 12,
                                                background: 'rgba(255,255,255,0.85)',
                                                borderRadius: 10, padding: '5px 12px',
                                                fontFamily: 'sans-serif', fontSize: 11,
                                                fontWeight: 600, color: '#9ca3af'
                                            }}>Date TBD</div>
                                        )}

                                        {/* Category */}
                                        {item.category && (
                                            <div style={{
                                                position: 'absolute', top: 12, right: 12,
                                                background: catStyle.bg,
                                                border: `1px solid ${catStyle.border}`,
                                                color: catStyle.text,
                                                borderRadius: 99, padding: '4px 12px',
                                                fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700
                                            }}>{item.category}</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '20px 20px 16px' }}>
                                        <h3 style={{
                                            fontSize: 18, fontWeight: 700,
                                            color: '#111827', margin: '0 0 8px',
                                            lineHeight: 1.3
                                        }}>{item.title}</h3>

                                        <p style={{
                                            color: '#6b7280', fontSize: 14, lineHeight: 1.6,
                                            fontFamily: 'sans-serif', margin: '0 0 14px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>{item.content}</p>

                                        {/* Meta tags */}
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                                            {item.time && (
                                                <span className="tag" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                                                    <svg width="11" height="11" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {formatTime(item.time)}
                                                </span>
                                            )}
                                            {item.location && (
                                                <span className="tag" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                                                    <svg width="11" height="11" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {item.location}
                                                </span>
                                            )}
                                            {!item.time && !item.location && (
                                                <span style={{ fontSize: 12, color: '#d1d5db', fontFamily: 'sans-serif', fontStyle: 'italic' }}>No additional details</span>
                                            )}
                                        </div>

                                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
                                            <button className="detail-btn">
                                                View Details
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom bar */}
                                    <div style={{ height: 3, background: 'linear-gradient(90deg, #16a34a, #4ade80)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s ease' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scaleX(1)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scaleX(0)'}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        {/* Modal Image */}
                        <div style={{ position: 'relative' }}>
                            <img
                                src={getImageUrl(selectedEvent.image)}
                                alt={selectedEvent.title}
                                style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
                                onError={(e) => {
                                    e.target.style.background = '#f0fdf4'
                                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='580' height='240' viewBox='0 0 580 240'%3E%3Crect width='580' height='240' fill='%23f0fdf4'/%3E%3C/svg%3E`
                                }}
                            />
                            <button
                                onClick={() => setSelectedEvent(null)}
                                style={{
                                    position: 'absolute', top: 12, right: 12,
                                    background: 'rgba(0,0,0,0.5)', border: 'none',
                                    color: 'white', width: 36, height: 36,
                                    borderRadius: '50%', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '24px 28px 28px' }}>
                            {selectedEvent.category && (
                                <div style={{
                                    display: 'inline-block', marginBottom: 12,
                                    background: (categoryColors[selectedEvent.category] || categoryColors.Other).bg,
                                    color: (categoryColors[selectedEvent.category] || categoryColors.Other).text,
                                    border: `1px solid ${(categoryColors[selectedEvent.category] || categoryColors.Other).border}`,
                                    borderRadius: 99, padding: '4px 14px',
                                    fontSize: 11, fontWeight: 700, fontFamily: 'sans-serif'
                                }}>{selectedEvent.category}</div>
                            )}

                            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 12px', lineHeight: 1.2 }}>
                                {selectedEvent.title}
                            </h2>

                            <p style={{ color: '#4b5563', fontSize: 15, lineHeight: 1.7, fontFamily: 'sans-serif', marginBottom: 20 }}>
                                {selectedEvent.content}
                            </p>

                            {/* Details grid */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr',
                                gap: 12, background: '#f9fafb',
                                borderRadius: 12, padding: 16
                            }}>
                                {[
                                    { icon: '📅', label: 'Date', val: formatDate(selectedEvent.date) || 'TBD' },
                                    { icon: '⏰', label: 'Time', val: formatTime(selectedEvent.time) || 'TBD' },
                                    { icon: '📍', label: 'Location', val: selectedEvent.location || 'TBD' },
                                    { icon: '🏷️', label: 'Category', val: selectedEvent.category || 'General' },
                                ].map((d, i) => (
                                    <div key={i} style={{ fontFamily: 'sans-serif' }}>
                                        <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {d.icon} {d.label}
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{d.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Events
