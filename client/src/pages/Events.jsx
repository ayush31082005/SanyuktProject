import { useEffect, useState } from "react"
import api from "../api"

function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    const animationStyles = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
            opacity: 0;
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
            animation: scaleIn 0.5s ease-out forwards;
        }
        
        .hover-lift {
            transition: transform 0.3s ease;
        }
        
        .hover-lift:hover {
            transform: translateY(-8px);
        }
    `

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const response = await api.get("/events/all")
            console.log("Events fetched:", response.data)
            setEvents(response.data)
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Date TBD"
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const formatTime = (timeString) => {
        if (!timeString) return "Time TBD"
        return timeString
    }

    if (loading) {
        return (
            <>
                <style>{animationStyles}</style>
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative">
                            {/* Green and Orange Spinner */}
                            <div className="w-20 h-20 border-4 border-green-200 border-t-orange-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-600 text-lg animate-pulse">Loading amazing events...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <style>{animationStyles}</style>

            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section - White, Green, Orange Theme */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
                                Our Events
                            </span>
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-green-500 to-orange-500 mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                            Discover and join our exciting events and celebrations
                        </p>
                    </div>

                    {/* Events Grid */}
                    {events.length === 0 ? (
                        <div className="text-center py-20 animate-scale-in">
                            <div className="bg-white rounded-3xl p-16 shadow-xl max-w-lg mx-auto border border-gray-100">
                                <svg className="w-24 h-24 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-3xl font-bold text-gray-700 mb-3">No Events Yet</h3>
                                <p className="text-gray-500 text-lg">Check back soon for upcoming events!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="group bg-white rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-500 hover:shadow-2xl hover:shadow-green-200/50 border border-gray-100 animate-slide-up"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={`http://localhost:5001/uploads/events/${item.image}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Event+Image'
                                            }}
                                        />

                                        {/* Gradient Overlay - Green to Orange */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-transparent to-transparent"></div>

                                        {/* Date Badge - White with Green/Orange accents */}
                                        <div className="absolute top-4 left-4 bg-white shadow-lg text-green-700 font-bold px-4 py-2 rounded-2xl text-sm">
                                            <span className="flex items-center space-x-1">
                                                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                <span>{formatDate(item.date)}</span>
                                            </span>
                                        </div>

                                        {/* Category Badge - Green to Orange Gradient */}
                                        {item.category && (
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg">
                                                {item.category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {item.content}
                                        </p>

                                        {/* Event Meta Info - Green/Orange theme */}
                                        <div className="flex flex-wrap items-center gap-3 text-sm border-t border-gray-100 pt-4">
                                            {item.location && (
                                                <span className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-full text-green-700">
                                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{item.location}</span>
                                                </span>
                                            )}
                                            {item.time && (
                                                <span className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-full text-green-700">
                                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{formatTime(item.time)}</span>
                                                </span>
                                            )}
                                            {/* Show fallback if no meta data */}
                                            {!item.location && !item.time && (
                                                <span className="text-gray-400 text-sm italic">
                                                    No additional details
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Border - Green to Orange */}
                                    <div className="h-1 bg-gradient-to-r from-green-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Events
