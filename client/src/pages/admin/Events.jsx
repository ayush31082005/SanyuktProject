import { useState } from "react"
import api from "../../api"

function AddEvent() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    // ✅ Missing variables added
    const [eventDate, setEventDate] = useState("")
    const [eventTime, setEventTime] = useState("")
    const [location, setLocation] = useState("")
    const [category, setCategory] = useState("")

    const animationStyles = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bounceSlow {
            0%, 100% { transform: translateY(-5%); }
            50% { transform: translateY(0); }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-in {
            animation: slideIn 0.6s ease-out forwards;
        }
        
        .animate-bounce-slow {
            animation: bounceSlow 2s infinite;
        }
    `

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            validateAndSetImage(file)
        }
    }

    const validateAndSetImage = (file) => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            alert('❌ Only JPG, PNG, GIF and WEBP files are allowed!')
            return false
        }

        // Check file size (5MB max for events)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            alert('❌ File size should be less than 5MB!')
            return false
        }

        setImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)
        return true
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetImage(e.dataTransfer.files[0])
        }
    }

    const validateForm = () => {
        if (!title.trim()) {
            alert("⚠️ Please enter an event title!")
            return false
        }
        if (!content.trim()) {
            alert("⚠️ Please enter event description!")
            return false
        }
        if (!image) {
            alert("⚠️ Please select an event image!")
            return false
        }
        return true
    }

    const submit = async () => {
        if (!validateForm()) return

        setLoading(true)
        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)
        formData.append("image", image)

        // Optional fields (only add if they have values)
        if (eventDate) formData.append("date", eventDate)
        if (eventTime) formData.append("time", eventTime)
        if (location) formData.append("location", location)
        if (category) formData.append("category", category)

        // Log FormData for debugging
        console.log("Submitting FormData:")
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await api.post("/events/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            console.log("Server Response:", response.data)

            if (response.data.success || response.status === 200) {
                alert("✅ Event Added Successfully!")
                // Reset form
                setTitle("")
                setContent("")
                setImage(null)
                setPreview(null)
                setEventDate("")
                setEventTime("")
                setLocation("")
                setCategory("")
            } else {
                alert("❌ Server Error: " + (response.data?.message || "Unknown error"))
            }
        } catch (error) {
            console.error("Upload Error:", error)

            // Better error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert("❌ Server Error: " + (error.response.data?.message || error.response.statusText))
            } else if (error.request) {
                // The request was made but no response was received
                alert("❌ No response from server. Please check if backend is running.")
            } else {
                // Something happened in setting up the request that triggered an Error
                alert("❌ Error: " + error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const removeImage = () => {
        setImage(null)
        setPreview(null)
    }

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear all fields?")) {
            setTitle("")
            setContent("")
            setImage(null)
            setPreview(null)
            setEventDate("")
            setEventTime("")
            setLocation("")
            setCategory("")
        }
    }

    return (
        <>
            <style>{animationStyles}</style>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-10 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4">
                            Add New Event
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 text-lg">Create and share your upcoming events</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:shadow-green-200/50 animate-slide-in">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Form Fields */}
                            <div className="space-y-6">
                                {/* Title Input */}
                                <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Event Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Annual Family Gathering"
                                            className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                                            maxLength="100"
                                            required
                                        />
                                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
                                </div>

                                {/* Content/Description Input */}
                                <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Event Description <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Describe your event..."
                                            rows="5"
                                            className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300 resize-none"
                                            maxLength="500"
                                            required
                                        ></textarea>
                                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{content.length}/500 characters</p>
                                </div>

                                {/* Optional Fields */}
                                <div className="grid grid-cols-2 gap-4 animate-slide-in" style={{ animationDelay: '300ms' }}>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Event Date
                                        </label>
                                        <input
                                            type="date"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Event Time
                                        </label>
                                        <input
                                            type="time"
                                            value={eventTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 animate-slide-in" style={{ animationDelay: '400ms' }}>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g., Community Hall"
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Meeting">Meeting</option>
                                            <option value="Celebration">Celebration</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Festival">Festival</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Image Upload */}
                            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '500ms' }}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Event Image <span className="text-red-500">*</span>
                                </label>

                                {/* Upload Area */}
                                <div
                                    className={`relative border-3 border-dashed rounded-2xl p-6 transition-all duration-300 ${dragActive
                                        ? "border-green-500 bg-green-50/50 scale-105"
                                        : preview
                                            ? "border-green-400 bg-green-50/30"
                                            : "border-gray-300 hover:border-green-400 hover:bg-green-50/30"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        id="event-image"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    />

                                    {!preview ? (
                                        <label
                                            htmlFor="event-image"
                                            className="flex flex-col items-center justify-center cursor-pointer space-y-4"
                                        >
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-bounce-slow">
                                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-700 mb-1">
                                                    Drop your image here
                                                </p>
                                                <p className="text-gray-500">
                                                    or <span className="text-green-600 font-medium">browse</span>
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-64 object-cover rounded-xl shadow-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Image Requirements */}
                                <div className="bg-green-50 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        Image Requirements:
                                    </h4>
                                    <ul className="text-xs text-green-600 space-y-1 ml-5 list-disc">
                                        <li>Minimum resolution: 800x600 pixels</li>
                                        <li>Maximum file size: 5MB</li>
                                        <li>Supported formats: JPG, PNG, GIF, WEBP</li>
                                        <li>Recommended: 16:9 aspect ratio</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Form Footer with Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="text-sm text-gray-500">
                                <span className="text-red-500">*</span> Required fields
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                                >
                                    Clear Form
                                </button>

                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={loading}
                                    className={`
                                        relative overflow-hidden group px-8 py-3 rounded-xl font-semibold text-lg
                                        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                                        ${loading
                                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                            : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white hover:shadow-green-200"
                                        }
                                    `}
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                            <span>Adding Event...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <span>Add Event</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Preview Section */}
                        {(title || content || preview) && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl animate-fade-in">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    Live Preview
                                </h3>
                                <div className="bg-white rounded-xl p-4 shadow-inner">
                                    <div className="flex items-start space-x-4">
                                        {preview && (
                                            <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                                        )}
                                        <div>
                                            <h4 className="font-bold text-gray-800">{title || "Event Title"}</h4>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content || "Event description will appear here..."}</p>
                                            {(eventDate || eventTime || location) && (
                                                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                                    {eventDate && <span>📅 {eventDate}</span>}
                                                    {eventTime && <span>⏰ {eventTime}</span>}
                                                    {location && <span>📍 {location}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEvent
