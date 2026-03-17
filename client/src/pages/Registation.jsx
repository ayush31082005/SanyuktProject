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
        packageType: 'none',
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
                setError(`No response from server. Check if backend is live at: ${api.defaults.baseURL}`);
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
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#0A7A2F] to-[#085a23] px-6 py-8 text-center">
                                <h2 className="text-3xl font-black text-white">
                                    Registration Form
                                </h2>
                                <p className="text-white/80 mt-1 font-medium italic">Join our Sanyukt Parivaar today</p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
                                    <p className="font-bold text-sm">{error}</p>
                                </div>
                            )}

                            {/* Success Display */}
                            {success && (
                                <div className="mx-8 mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg shadow-sm">
                                    <p className="font-bold text-sm">{success}</p>
                                </div>
                            )}

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} noValidate className="p-8">
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Sponsor Id */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Sponsor Id <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="sponsorId"
                                            value={formData.sponsorId}
                                            onChange={handleChange}
                                            placeholder="Enter Sponsor Id"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Sponsor Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Sponsor Name
                                        </label>
                                        <input
                                            type="text"
                                            name="sponsorName"
                                            value={formData.sponsorName}
                                            onChange={handleChange}
                                            placeholder="Sponser Name Visible Here"
                                            readOnly
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:outline-none opacity-80 font-medium"
                                        />
                                    </div>

                                    {/* Position Dropdown */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Position <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="position"
                                                value={formData.position}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] appearance-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                                required
                                            >
                                                <option value="">- Select Position -</option>
                                                <option value="Left">Left</option>
                                                <option value="Right">Right</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            placeholder="Enter Full Name"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Father Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Father Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fatherName"
                                            value={formData.fatherName}
                                            onChange={handleChange}
                                            placeholder="Enter Father Name"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Gender Dropdown */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] appearance-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                                required
                                            >
                                                <option value="">- Select Gender -</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Mobile No. <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            placeholder="Enter Mobile Number"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                            required
                                            maxLength="10"
                                        />
                                    </div>

                                    {/* Email ID */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Email ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter Email Id"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter Password"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                            required
                                        />
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="space-y-1.5 pt-4">
                                        <label className="block text-sm font-black text-[#222222]">
                                            Shipping Address <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-xs text-gray-500 mb-2 font-medium">
                                            Note : Enter complete shipping address with city, Pincode & State.
                                        </p>
                                        <textarea
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleChange}
                                            placeholder="Enter Shipping Address"
                                            rows="3"
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 transition-all font-medium resize-none shadow-sm"
                                            required
                                        />
                                    </div>

                                    {/* State Select */}
                                    <div className="space-y-1.5 relative" ref={stateDropdownRef}>
                                        <label className="block text-sm font-black text-[#222222]">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                                            className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                        >
                                            <span className={formData.state ? 'text-[#222222]' : 'text-gray-400'}>
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
                                                    className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-2xl overflow-hidden"
                                                >
                                                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search state..."
                                                                value={stateSearch}
                                                                onChange={(e) => setStateSearch(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:border-green-500 bg-white shadow-inner focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto premium-scrollbar">
                                                        {filteredStates.length > 0 ? (
                                                            filteredStates.map((st) => (
                                                                <div
                                                                    key={st}
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, state: st, district: '', assemblyArea: '' });
                                                                        setIsStateDropdownOpen(false);
                                                                        setStateSearch('');
                                                                    }}
                                                                    className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-green-50 hover:text-[#0A7A2F] ${formData.state === st ? 'bg-green-50 text-[#0A7A2F] font-bold' : 'text-gray-700'
                                                                        }`}
                                                                >
                                                                    {st}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-6 text-sm text-gray-500 text-center italic">
                                                                No states found
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* District Select */}
                                    <div className="space-y-1.5 relative" ref={districtDropdownRef}>
                                        <label className="block text-sm font-black text-[#222222]">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            onClick={() => {
                                                if (!formData.state) return;
                                                setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                                            }}
                                            className={`w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-green-500/20 transition-all font-medium ${!formData.state ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className={formData.district ? 'text-[#222222]' : 'text-gray-400'}>
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
                                                    className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-2xl overflow-hidden"
                                                >
                                                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search district..."
                                                                value={districtSearch}
                                                                onChange={(e) => setDistrictSearch(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:border-green-500 bg-white shadow-inner focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto premium-scrollbar">
                                                        {filteredDistricts.length > 0 ? (
                                                            filteredDistricts.map((d) => (
                                                                <div
                                                                    key={d}
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, district: d, assemblyArea: '' });
                                                                        setIsDistrictDropdownOpen(false);
                                                                        setDistrictSearch('');
                                                                    }}
                                                                    className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-green-50 hover:text-[#0A7A2F] ${formData.district === d ? 'bg-green-50 text-[#0A7A2F] font-bold' : 'text-gray-700'
                                                                        }`}
                                                                >
                                                                    {d}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-6 text-sm text-gray-500 text-center italic">
                                                                No districts found
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Other address fields with consistent styling */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Assembly Select */}
                                        <div className="space-y-1.5 relative" ref={assemblyDropdownRef}>
                                            <label className="block text-sm font-black text-[#222222]">
                                                Assembly <span className="text-red-500">*</span>
                                            </label>
                                            <div
                                                onClick={() => {
                                                    if (!formData.district) return;
                                                    setIsAssemblyDropdownOpen(!isAssemblyDropdownOpen);
                                                }}
                                                className={`w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-green-500/20 transition-all font-medium ${!formData.district ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span className={formData.assemblyArea ? 'text-[#222222]' : 'text-gray-400'}>
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
                                                        className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-2xl overflow-hidden"
                                                    >
                                                        <div className="p-3 bg-gray-50 border-b border-gray-100">
                                                            <div className="relative">
                                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search assembly..."
                                                                    value={assemblySearch}
                                                                    onChange={(e) => setAssemblySearch(e.target.value)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:border-green-500 bg-white shadow-inner focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="max-h-60 overflow-y-auto premium-scrollbar">
                                                            {filteredAssemblies.length > 0 ? (
                                                                filteredAssemblies.map((a) => (
                                                                    <div
                                                                        key={a}
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, assemblyArea: a });
                                                                            setIsAssemblyDropdownOpen(false);
                                                                            setAssemblySearch('');
                                                                        }}
                                                                        className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-green-50 hover:text-[#0A7A2F] ${formData.assemblyArea === a ? 'bg-green-50 text-[#0A7A2F] font-bold' : 'text-gray-700'
                                                                            }`}
                                                                    >
                                                                        {a}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-6 text-sm text-gray-500 text-center italic">
                                                                    No assemblies found
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Block */}
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-black text-[#222222]">
                                                Block <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="block"
                                                value={formData.block}
                                                onChange={handleChange}
                                                placeholder="Enter Block"
                                                className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Village Council & Village */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-black text-[#222222]">
                                                Village Council <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="villageCouncil"
                                                value={formData.villageCouncil}
                                                onChange={handleChange}
                                                placeholder="Enter Village Council"
                                                className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-black text-[#222222]">
                                                Village <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="village"
                                                value={formData.village}
                                                onChange={handleChange}
                                                placeholder="Enter Village"
                                                className="w-full px-4 py-3 bg-[#EEF2FF] border-none rounded-md text-[#222222] font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Agreement Checkbox */}
                                    <div className="flex items-start space-x-3 pt-4">
                                        <input
                                            type="checkbox"
                                            id="agreement"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            className="mt-1 w-5 h-5 text-[#0A7A2F] rounded border-none bg-[#EEF2FF] focus:ring-green-500/20"
                                        />
                                        <label htmlFor="agreement" className="text-sm text-gray-600 font-medium leading-relaxed">
                                            I accept the <Link to="/terms" className="text-[#0A7A2F] hover:underline font-bold">terms and conditions</Link> and <Link to="/privacy" className="text-[#0A7A2F] hover:underline font-bold">privacy policy</Link>.
                                        </label>
                                    </div>

                                    {/* Submit Section */}
                                    <div className="flex flex-col items-center gap-6 pt-8 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-4 bg-[#0A7A2F] hover:bg-[#085a23] text-white font-black text-lg rounded-xl transition-all duration-300 shadow-lg shadow-green-100 transform active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-green-200'
                                                }`}
                                        >
                                            {loading ? 'REGISTERING...' : 'SIGN UP'}
                                        </button>

                                        <p className="text-gray-600 text-sm font-medium">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-[#0A7A2F] hover:underline font-bold">
                                                Sign In
                                            </Link>
                                        </p>
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