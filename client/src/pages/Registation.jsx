import React, { useState, useEffect, useRef } from 'react';
import {
    Users,
    Phone,
    Mail,
    Home,
    ChevronDown,
    MapPin,
    Building,
    Flag,
    TreePine,
    Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

// Define address data directly in the component to avoid import issues
const addressData = {
    "Andhra Pradesh": {
        "Anantapur": ["Anantapur Urban", "Anantapur Rural", "Dharmavaram"],
        "Chittoor": ["Chittoor", "Tirupati", "Madanapalle"],
        "East Godavari": ["Kakinada", "Rajahmundry Urban", "Rajahmundry Rural"],
        "Guntur": ["Guntur East", "Guntur West", "Tenali"],
        "Krishna": ["Vijayawada East", "Vijayawada West", "Machilipatnam"],
        "Kurnool": ["Kurnool", "Nandyal", "Adoni"],
        "Prakasam": ["Ongole", "Markapuram"],
        "Srikakulam": ["Srikakulam", "Palasa"],
        "Visakhapatnam": ["Visakhapatnam East", "Visakhapatnam West", "Anakapalle"],
        "Vizianagaram": ["Vizianagaram", "Bobbili"],
        "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem"],
        "YSR Kadapa": ["Kadapa", "Proddatur"]
    },
    "Maharashtra": {
        "Mumbai City": ["Mumbai South", "Mumbai South Central", "Mumbai North Central"],
        "Mumbai Suburban": ["Mumbai North", "Mumbai North West", "Mumbai North East"],
        "Pune": ["Pune City", "Pune Cantonment", "Shivajinagar"],
        "Nagpur": ["Nagpur West", "Nagpur East", "Nagpur Central"],
        "Thane": ["Thane", "Kalyan", "Dombivli"],
        "Nashik": ["Nashik West", "Nashik East"],
        "Aurangabad": ["Aurangabad West", "Aurangabad East"]
    },
    "Delhi": {
        "Central Delhi": ["Karol Bagh", "Daryaganj"],
        "East Delhi": ["Laxmi Nagar", "Shahdara"],
        "New Delhi": ["New Delhi", "Chanakyapuri"],
        "North Delhi": ["Civil Lines", "Model Town"],
        "North East Delhi": ["Seelampur", "Yamuna Vihar"],
        "North West Delhi": ["Rohini", "Saraswati Vihar"],
        "Shahdara": ["Shahdara", "Seemapuri"],
        "South Delhi": ["Greater Kailash", "Kalkaji"],
        "South East Delhi": ["Defence Colony", "Lajpat Nagar"],
        "South West Delhi": ["Dwarka", "Najafgarh"],
        "West Delhi": ["Rajouri Garden", "Punjabi Bagh"]
    },
    "Uttar Pradesh": {
        "Agra": ["Agra West", "Agra East", "Fatehabad"],
        "Lucknow": ["Lucknow West", "Lucknow East", "Lucknow Central"],
        "Kanpur": ["Kanpur West", "Kanpur East", "Kanpur Central"],
        "Varanasi": ["Varanasi South", "Varanasi North"],
        "Ghaziabad": ["Ghaziabad", "Loni", "Modinagar"],
        "Noida": ["Noida", "Dadri", "Jewar"],
        "Allahabad": ["Allahabad West", "Allahabad East"],
        "Bareilly": ["Bareilly City", "Bareilly Cantonment"]
    },
    "Gujarat": {
        "Ahmedabad": ["Ahmedabad West", "Ahmedabad East", "Gandhinagar"],
        "Surat": ["Surat West", "Surat East", "Surat South"],
        "Vadodara": ["Vadodara City", "Vadodara Rural"],
        "Rajkot": ["Rajkot West", "Rajkot East"],
        "Bhavnagar": ["Bhavnagar West", "Bhavnagar East"]
    },
    "Karnataka": {
        "Bengaluru Urban": ["Bengaluru South", "Bengaluru North", "Bengaluru Central"],
        "Bengaluru Rural": ["Devanahalli", "Doddaballapur"],
        "Mysore": ["Mysore City", "Mysore Rural"],
        "Hubli": ["Hubli City", "Dharwad"],
        "Mangalore": ["Mangalore City", "Mangalore North"]
    },
    "Tamil Nadu": {
        "Chennai": ["Chennai Central", "Chennai South", "Chennai North"],
        "Coimbatore": ["Coimbatore West", "Coimbatore East"],
        "Madurai": ["Madurai West", "Madurai East"],
        "Tiruchirappalli": ["Tiruchirappalli West", "Tiruchirappalli East"],
        "Salem": ["Salem West", "Salem East"]
    },
    "West Bengal": {
        "Kolkata": ["Kolkata South", "Kolkata North", "Kolkata Central"],
        "Howrah": ["Howrah West", "Howrah East"],
        "Darjeeling": ["Darjeeling", "Siliguri"],
        "North 24 Parganas": ["Barasat", "Bongaon"],
        "South 24 Parganas": ["Diamond Harbour", "Jaynagar"]
    },
    "Bihar": {
        "Patna": ["Patna West", "Patna East", "Patna Central"],
        "Gaya": ["Gaya West", "Gaya East"],
        "Bhagalpur": ["Bhagalpur City", "Bhagalpur Rural"],
        "Muzaffarpur": ["Muzaffarpur West", "Muzaffarpur East"]
    },
    "Madhya Pradesh": {
        "Bhopal": ["Bhopal West", "Bhopal East", "Bhopal Central"],
        "Indore": ["Indore West", "Indore East"],
        "Jabalpur": ["Jabalpur West", "Jabalpur East"],
        "Gwalior": ["Gwalior West", "Gwalior East"]
    },
    "Rajasthan": {
        "Jaipur": ["Jaipur West", "Jaipur East", "Jaipur Central"],
        "Jodhpur": ["Jodhpur West", "Jodhpur East"],
        "Udaipur": ["Udaipur City", "Udaipur Rural"],
        "Kota": ["Kota West", "Kota East"]
    }
};

const RegistrationForm = () => {
    const navigate = useNavigate();
    const stateDropdownRef = useRef(null);
    const districtDropdownRef = useRef(null);
    const assemblyDropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sponsorId: '',
        sponsorName: '',
        userName: '',
        fatherName: '',
        position: '',
        gender: '',
        mobile: '',
        email: '',
        shippingAddress: '',
        state: '',
        district: '',
        city: '',
        password: '',
        assemblyArea: '',
        block: '',
        villageCouncil: '',
        village: '',
    });

    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
    const [isAssemblyDropdownOpen, setIsAssemblyDropdownOpen] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const [assemblySearch, setAssemblySearch] = useState('');

    const states = Object.keys(addressData).sort();

    const filteredStates = states.filter(s =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
    );

    // Safe access to districts with error handling
    const getDistrictsForState = (state) => {
        try {
            if (!state) return [];
            const stateData = addressData[state];
            return stateData ? Object.keys(stateData) : [];
        } catch (error) {
            console.error("Error getting districts:", error);
            return [];
        }
    };

    const districts = getDistrictsForState(formData.state);

    const filteredDistricts = districts.filter(d =>
        d.toLowerCase().includes(districtSearch.toLowerCase())
    );

    // Safe access to assemblies with error handling
    const getAssembliesForDistrict = (state, district) => {
        try {
            if (!state || !district) return [];
            const stateData = addressData[state];
            if (!stateData) return [];
            const districtData = stateData[district];
            return Array.isArray(districtData) ? districtData : [];
        } catch (error) {
            console.error("Error getting assemblies:", error);
            return [];
        }
    };

    const assemblies = getAssembliesForDistrict(formData.state, formData.district);

    const filteredAssemblies = assemblies.filter(a =>
        a.toLowerCase().includes(assemblySearch.toLowerCase())
    );

    useEffect(() => {
        const fetchSponsorName = async () => {
            if (formData.sponsorId.length >= 3) { // Trigger only for reasonable length
                try {
                    const res = await api.get(`/sponsor/${formData.sponsorId}`);
                    if (res.data.name) {
                        setFormData(prev => ({ ...prev, sponsorName: res.data.name }));
                    }
                } catch (err) {
                    setFormData(prev => ({ ...prev, sponsorName: '' }));
                }
            } else {
                setFormData(prev => ({ ...prev, sponsorName: '' }));
            }
        };

        const timeoutId = setTimeout(fetchSponsorName, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [formData.sponsorId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
                setIsStateDropdownOpen(false);
            }
            if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
                setIsDistrictDropdownOpen(false);
            }
            if (assemblyDropdownRef.current && !assemblyDropdownRef.current.contains(event.target)) {
                setIsAssemblyDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        if (!agreed) {
            setError("Please accept the terms and conditions");
            return false;
        }

        const requiredFields = [
            { field: 'sponsorId', message: 'Sponsor ID' },
            { field: 'userName', message: 'User Name' },
            { field: 'fatherName', message: 'Father Name' },
            { field: 'position', message: 'Position' },
            { field: 'gender', message: 'Gender' },
            { field: 'mobile', message: 'Mobile Number' },
            { field: 'email', message: 'Email ID' },
            { field: 'password', message: 'Password' },
            { field: 'shippingAddress', message: 'Shipping Address' },
            { field: 'state', message: 'State' },
            { field: 'district', message: 'District' },
            { field: 'assemblyArea', message: 'Assembly' },
            { field: 'block', message: 'Block' },
            { field: 'villageCouncil', message: 'Village Council' },
            { field: 'village', message: 'Village' }
        ];

        for (let item of requiredFields) {
            if (!formData[item.field] || formData[item.field].trim() === '') {
                setError(`Please enter ${item.message}`);
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            setError("Please enter a valid 10-digit mobile number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = { ...formData };
            if (profileImage) payload.profileImage = profileImage;
            const response = await api.post("/register", payload);

            if (response.data) {
                setSuccess("Registration successful! Redirecting to verification...");

                localStorage.setItem('registrationEmail', formData.email);
                localStorage.setItem('registrationMobile', formData.mobile);

                setTimeout(() => {
                    navigate("/verify-otp", {
                        state: {
                            email: formData.email,
                            mobile: formData.mobile
                        }
                    });
                }, 1500);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Registration failed. Please try again.");
            } else if (error.request) {
                setError("No response from server. Please check your internet connection.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto relative">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-gray-600 mb-6">
                    <Home className="h-4 w-4" />
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    <span className="text-blue-600 font-semibold">Register Now</span>
                </div>

                {/* Main Grid */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Registration Form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 md:px-8 py-6 text-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    Registration Form
                                </h2>
                                <p className="text-blue-100 mt-2 text-sm md:text-base">Join our network today</p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mx-4 md:mx-6 lg:mx-8 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Success Display */}
                            {success && (
                                <div className="mx-4 md:mx-6 lg:mx-8 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                    {success}
                                </div>
                            )}

                            {/* Profile Picture Upload */}
                            <div className="flex flex-col items-center py-5 border-b border-gray-100 bg-gray-50">
                                <div className="relative inline-flex cursor-pointer group" onClick={() => document.getElementById('reg-profile-upload').click()}>
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-200 bg-green-100 flex items-center justify-center shadow-md group-hover:border-green-400 transition-all">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-10 h-10 text-green-400" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green-600 border-2 border-white flex items-center justify-center group-hover:bg-green-700 transition-colors">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    {profileImage ? (
                                        <span className="text-green-600 font-medium cursor-pointer" onClick={() => setProfileImage(null)}>Remove photo</span>
                                    ) : (
                                        <span className="text-gray-400">Click to upload photo <span className="text-gray-300">(optional)</span></span>
                                    )}
                                </p>
                                <input id="reg-profile-upload" type="file" accept="image/*" hidden onChange={handleImageUpload} />
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="p-4 md:p-6 lg:p-8">
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            {/* Sponsor Id */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Sponsor Id <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="sponsorId"
                                                        value={formData.sponsorId}
                                                        onChange={handleChange}
                                                        placeholder="Enter Sponsor Id"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Sponsor Name */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Sponsor Name
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="sponsorName"
                                                        value={formData.sponsorName}
                                                        onChange={handleChange}
                                                        placeholder="Sponsor Name"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            {/* Position Radio */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Position <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex flex-wrap gap-4">
                                                    {['Left', 'Right'].map((pos) => (
                                                        <label key={pos} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="position"
                                                                value={pos}
                                                                checked={formData.position === pos}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                                required
                                                            />
                                                            <span className="text-gray-700">{pos}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* User Name */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    User Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="userName"
                                                        value={formData.userName}
                                                        onChange={handleChange}
                                                        placeholder="Enter User Name"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Father Name */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Father Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="fatherName"
                                                        value={formData.fatherName}
                                                        onChange={handleChange}
                                                        placeholder="Enter Father Name"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            {/* Gender Radio */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Gender <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex flex-wrap gap-4">
                                                    {['Male', 'Female', 'Other'].map((gen) => (
                                                        <label key={gen} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value={gen}
                                                                checked={formData.gender === gen}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                                required
                                                            />
                                                            <span className="text-gray-700">{gen}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mobile Number */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Mobile No. <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        name="mobile"
                                                        value={formData.mobile}
                                                        onChange={handleChange}
                                                        placeholder="Enter Mobile Number"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                        maxLength="10"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email ID */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Email ID <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="Enter Email Id"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Password <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Enter Password"
                                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="mt-6 space-y-4">
                                        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-xl mt-4 space-y-4">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">Address Details</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* State Select */}
                                                <div className="space-y-2 relative" ref={stateDropdownRef}>
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        State <span className="text-red-500">*</span>
                                                    </label>
                                                    <div
                                                        onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
                                                    >
                                                        <span className={formData.state ? 'text-gray-900' : 'text-gray-400'}>
                                                            {formData.state || '- Select State -'}
                                                        </span>
                                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </div>

                                                    <AnimatePresence>
                                                        {isStateDropdownOpen && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                                                            >
                                                                <div className="p-2 border-b border-gray-100 bg-gray-50">
                                                                    <div className="relative">
                                                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search state..."
                                                                            value={stateSearch}
                                                                            onChange={(e) => setStateSearch(e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 bg-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="max-h-60 overflow-y-auto">
                                                                    {filteredStates.length > 0 ? (
                                                                        filteredStates.map((st) => (
                                                                            <div
                                                                                key={st}
                                                                                onClick={() => {
                                                                                    setFormData({ ...formData, state: st, district: '', assemblyArea: '' });
                                                                                    setIsStateDropdownOpen(false);
                                                                                    setStateSearch('');
                                                                                }}
                                                                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-blue-50 hover:text-blue-700 ${formData.state === st ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                                                                    }`}
                                                                            >
                                                                                {st}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                                                            No states found
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* District Select */}
                                                <div className="space-y-2 relative" ref={districtDropdownRef}>
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        District <span className="text-red-500">*</span>
                                                    </label>
                                                    <div
                                                        onClick={() => {
                                                            if (!formData.state) {
                                                                setError("Please select a state first");
                                                                return;
                                                            }
                                                            setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                                                        }}
                                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors ${!formData.state ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span className={formData.district ? 'text-gray-900' : 'text-gray-400'}>
                                                            {formData.district || '- Select District -'}
                                                        </span>
                                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDistrictDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </div>

                                                    <AnimatePresence>
                                                        {isDistrictDropdownOpen && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                                                            >
                                                                <div className="p-2 border-b border-gray-100 bg-gray-50">
                                                                    <div className="relative">
                                                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search district..."
                                                                            value={districtSearch}
                                                                            onChange={(e) => setDistrictSearch(e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 bg-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="max-h-60 overflow-y-auto">
                                                                    {filteredDistricts.length > 0 ? (
                                                                        filteredDistricts.map((d) => (
                                                                            <div
                                                                                key={d}
                                                                                onClick={() => {
                                                                                    setFormData({ ...formData, district: d, assemblyArea: '' });
                                                                                    setIsDistrictDropdownOpen(false);
                                                                                    setDistrictSearch('');
                                                                                }}
                                                                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-blue-50 hover:text-blue-700 ${formData.district === d ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                                                                    }`}
                                                                            >
                                                                                {d}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                                                            No districts found for {formData.state}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Assembly Select */}
                                                <div className="space-y-2 relative" ref={assemblyDropdownRef}>
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Assembly <span className="text-red-500">*</span>
                                                    </label>
                                                    <div
                                                        onClick={() => {
                                                            if (!formData.district) {
                                                                setError("Please select a district first");
                                                                return;
                                                            }
                                                            setIsAssemblyDropdownOpen(!isAssemblyDropdownOpen);
                                                        }}
                                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors ${!formData.district ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span className={formData.assemblyArea ? 'text-gray-900' : 'text-gray-400'}>
                                                            {formData.assemblyArea || '- Select Assembly -'}
                                                        </span>
                                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isAssemblyDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </div>

                                                    <AnimatePresence>
                                                        {isAssemblyDropdownOpen && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                                                            >
                                                                <div className="p-2 border-b border-gray-100 bg-gray-50">
                                                                    <div className="relative">
                                                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Search assembly..."
                                                                            value={assemblySearch}
                                                                            onChange={(e) => setAssemblySearch(e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 bg-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="max-h-60 overflow-y-auto">
                                                                    {filteredAssemblies.length > 0 ? (
                                                                        filteredAssemblies.map((a) => (
                                                                            <div
                                                                                key={a}
                                                                                onClick={() => {
                                                                                    setFormData({ ...formData, assemblyArea: a });
                                                                                    setIsAssemblyDropdownOpen(false);
                                                                                    setAssemblySearch('');
                                                                                }}
                                                                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-blue-50 hover:text-blue-700 ${formData.assemblyArea === a ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                                                                    }`}
                                                                            >
                                                                                {a}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                                                            {formData.district ? 'No assemblies found for this district' : 'Select a district first'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Block */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Block <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            name="block"
                                                            value={formData.block}
                                                            onChange={handleChange}
                                                            placeholder="Enter Block"
                                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Village (Council) */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Village (Council) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            name="villageCouncil"
                                                            value={formData.villageCouncil}
                                                            onChange={handleChange}
                                                            placeholder="Enter Village Council"
                                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Village */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Village <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <TreePine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            name="village"
                                                            value={formData.village}
                                                            onChange={handleChange}
                                                            placeholder="Enter Village Name"
                                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Shipping Address <span className="text-red-500">*</span>
                                                </label>
                                                <p className="text-xs text-gray-500 mb-2 italic">
                                                    Note: Enter complete shipping address with Pincode.
                                                </p>
                                                <textarea
                                                    name="shippingAddress"
                                                    value={formData.shippingAddress}
                                                    onChange={handleChange}
                                                    placeholder="Enter complete shipping address"
                                                    rows="3"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agreement and Submit Section */}
                                    <div className="mt-8 space-y-4">
                                        {/* Agreement Checkbox */}
                                        <div className="flex items-start space-x-3">
                                            <input
                                                type="checkbox"
                                                id="agreement"
                                                checked={agreed}
                                                onChange={(e) => setAgreed(e.target.checked)}
                                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="agreement" className="text-sm text-gray-600">
                                                I accept the <Link to="/terms" className="text-blue-600 hover:underline font-semibold">terms and conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:underline font-semibold">privacy policy</Link>.
                                            </label>
                                        </div>

                                        {/* Sign In Link and Submit Button */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                                            <p className="text-gray-600 text-sm">
                                                Already have an account?{' '}
                                                <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                                                    Sign In
                                                </Link>
                                            </p>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-8 py-3 bg-[#F7931E] hover:bg-[#e08418] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                            >
                                                {loading ? 'REGISTERING...' : 'SIGN UP'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;