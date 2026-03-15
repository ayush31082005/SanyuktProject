import { useEffect, useState } from "react"
import api, { API_URL } from "../api"

function Gallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)

    // Add animation styles
    const animationStyles = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
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
        
        .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
            animation: scaleIn 0.3s ease-out forwards;
        }
    `

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <style>{animationStyles}</style>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-600"></div>
            </div>
        )
    }

    return (
        <>
            <style>{animationStyles}</style>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4">
                            Our Gallery
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mx-auto rounded-full"></div>
                        <p className="text-gray-600 mt-4 text-lg">Explore our beautiful collection of memories</p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                        {gallery.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group relative overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-200/50 animate-fade-in-up cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => setSelectedImage(item)}
                            >
                                <div className="relative w-full h-64 overflow-hidden">
                                    <img
                                        src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image.startsWith('/uploads') ? item.image : '/uploads/' + item.image}`}
                                        alt={`Gallery item ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />

                                    {/* Overlay with hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-white font-semibold text-xl mb-2">
                                                {item.title || `Gallery Image ${index + 1}`}
                                            </h3>
                                            <p className="text-green-200 text-sm">
                                                {item.description || 'Click to view full size'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image counter badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-green-600 font-semibold px-3 py-1 rounded-full text-sm shadow-lg">
                                        #{index + 1}
                                    </div>

                                    {/* Zoom icon on hover */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {gallery.length === 0 && (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl max-w-md mx-auto">
                                <svg className="w-20 h-20 text-green-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Images Yet</h3>
                                <p className="text-gray-500">Check back soon for updates!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lightbox Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-6xl w-full max-h-[90vh] animate-scale-in">
                            <img
                                src={selectedImage.image.startsWith('http') ? selectedImage.image : `${API_URL}${selectedImage.image.startsWith('/uploads') ? selectedImage.image : '/uploads/' + selectedImage.image}`}
                                alt="Selected gallery item"
                                className="w-full h-full object-contain rounded-lg"
                            />

                            {/* Close button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Image info */}
                            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                                <p className="bg-black/50 backdrop-blur-sm inline-block px-6 py-3 rounded-full">
                                    {selectedImage.title || 'Gallery Image'} • Click anywhere to close
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Gallery
