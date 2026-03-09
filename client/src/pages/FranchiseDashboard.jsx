// FranchiseDashboard.jsx
import React, { useState } from 'react';

const FranchiseDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Navigation items with icons (Green & Orange theme)
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'green' },
        { id: 'profile', label: 'Profile', icon: '👤', color: 'orange' },
        { id: 'members', label: 'Members', icon: '👥', color: 'green' },
        { id: 'products', label: 'Products', icon: '📦', color: 'orange' },
        { id: 'wallet', label: 'Wallet', icon: '💰', color: 'green' },
        { id: 'income', label: 'Income', icon: '📈', color: 'orange' },
        { id: 'reports', label: 'Reports', icon: '📋', color: 'green' },
        { id: 'support', label: 'Support', icon: '🎫', color: 'orange' },
        { id: 'notifications', label: 'Updates', icon: '🔔', color: 'green' }
    ];

    // Dashboard Stats with Green & Orange theme
    const stats = [
        { label: 'Total Members', value: '1,234', icon: '👥', change: '+12%', color: 'green' },
        { label: 'Today Joinings', value: '25', icon: '➕', change: '+5', color: 'orange' },
        { label: 'Total Business', value: '₹45.6L', icon: '💰', change: '+8%', color: 'green' },
        { label: 'Commission', value: '₹1.2L', icon: '💵', change: '+15%', color: 'orange' },
        { label: 'Wallet Balance', value: '₹78.9K', icon: '👛', change: '+2K', color: 'green' }
    ];

    // Recent Joinings Data
    const recentJoinings = [
        { name: 'Amit Sharma', id: 'FR12345', date: 'Today 10:30 AM', package: 'Gold', amount: '₹10,000' },
        { name: 'Priya Patel', id: 'FR12346', date: 'Yesterday 3:45 PM', package: 'Silver', amount: '₹5,000' },
        { name: 'Raj Kumar', id: 'FR12347', date: '2 days ago', package: 'Platinum', amount: '₹25,000' },
        { name: 'Neha Singh', id: 'FR12348', date: '2 days ago', package: 'Gold', amount: '₹10,000' },
        { name: 'Vikram Mehta', id: 'FR12349', date: '3 days ago', package: 'Silver', amount: '₹5,000' }
    ];

    // Recent Transactions
    const transactions = [
        { id: '#TXN001', amount: '₹5,000', type: 'Commission', status: 'Success', date: 'Today' },
        { id: '#TXN002', amount: '₹10,000', type: 'Transfer', status: 'Pending', date: 'Yesterday' },
        { id: '#TXN003', amount: '₹2,500', type: 'Purchase', status: 'Success', date: '2 days ago' },
        { id: '#TXN004', amount: '₹15,000', type: 'Commission', status: 'Success', date: '3 days ago' }
    ];

    // Render different sections based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        {/* Welcome Banner - Green & Orange Gradient */}
                        <div className="bg-gradient-to-r from-green-600 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Rajesh'}! 👋</h2>
                            <p className="opacity-90">Here's what's happening with your franchise today.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${stat.color}-500 hover:shadow-xl transition-shadow`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 text-sm">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                                            <p className={`text-xs text-${stat.color}-600 mt-1`}>{stat.change}</p>
                                        </div>
                                        <span className="text-3xl">{stat.icon}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts and Recent Data */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Joinings Card */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Recent Joinings</h3>
                                    <button className="text-sm text-green-600 hover:text-green-800">View All →</button>
                                </div>
                                <div className="space-y-3">
                                    {recentJoinings.slice(0, 4).map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {item.id} • {item.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">{item.amount}</p>
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    {item.package}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Transactions Card */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                                    <button className="text-sm text-orange-600 hover:text-orange-800">View All →</button>
                                </div>
                                <div className="space-y-3">
                                    {transactions.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.id}</p>
                                                <p className="text-xs text-gray-500">{item.type} • {item.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">{item.amount}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Profile Management</h2>

                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Cover Photo - Green to Orange Gradient */}
                            <div className="h-32 bg-gradient-to-r from-green-600 to-orange-500"></div>

                            {/* Profile Info */}
                            <div className="px-6 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-end -mt-16">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-white rounded-full p-1">
                                            <div className="w-full h-full bg-gradient-to-r from-green-600 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                                {user?.name?.charAt(0) || 'R'}
                                            </div>
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600">
                                            📷
                                        </button>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-6">
                                        <h3 className="text-xl font-bold text-gray-800">{user?.name || 'Rajesh Kumar'}</h3>
                                        <p className="text-gray-600">Franchise Owner • ID: FR12345</p>
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Franchise Name</label>
                                        <input type="text" value="ABC Enterprises" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name</label>
                                        <input type="text" value="Rajesh Kumar" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                                        <input type="tel" value="9876543210" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email ID</label>
                                        <input type="email" value="rajesh@abc.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Address</label>
                                        <textarea rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">123, Main Street, City - 400001</textarea>
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="mt-8 border-t pt-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder</label>
                                            <input type="text" value="Rajesh Kumar" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                                            <input type="text" value="1234567890" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                                            <input type="text" value="State Bank of India" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                                            <input type="text" value="SBIN001234" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons - Green & Orange */}
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
                                    <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Change Password</button>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                                    <p className="text-sm font-semibold text-gray-700">PAN Card</p>
                                    <p className="text-xs text-gray-500 mt-1">Uploaded: PAN1234</p>
                                    <button className="mt-3 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100">
                                        Update Document
                                    </button>
                                </div>
                                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                                    <p className="text-sm font-semibold text-gray-700">Aadhaar Card</p>
                                    <p className="text-xs text-gray-500 mt-1">Uploaded: XXXX-XXXX-1234</p>
                                    <button className="mt-3 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm hover:bg-orange-100">
                                        Update Document
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'members':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Member Management</h2>
                            <button className="bg-gradient-to-r from-green-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-orange-600 flex items-center">
                                <span className="mr-2">➕</span> Add New Member
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search by ID, Name or Mobile..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                                    <option>All Packages</option>
                                    <option>Silver</option>
                                    <option>Gold</option>
                                    <option>Platinum</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                    <option>All Status</option>
                                    <option>Active</option>
                                    <option>Pending</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Members Table */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joining Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">FR{1000 + i}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                            {String.fromCharCode(64 + i)}
                                                        </div>
                                                        Member Name {i}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">98765432{10 + i}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${i % 3 === 0 ? 'bg-orange-100 text-orange-800' :
                                                        i % 3 === 1 ? 'bg-green-100 text-green-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {i % 3 === 0 ? 'Platinum' : i % 3 === 1 ? 'Gold' : 'Silver'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">2024-01-{10 + i}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${i % 4 === 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {i % 4 === 0 ? 'Pending' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                                                    <button className="text-orange-500 hover:text-orange-700">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                                <div className="text-sm text-gray-500">Showing 1 to 6 of 50 entries</div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
                                    <button className="px-3 py-1 bg-gradient-to-r from-green-600 to-orange-500 text-white rounded">1</button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'products':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Products & Packages</h2>

                        {/* Package Cards - Green & Orange Theme */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { name: 'Silver Package', price: '₹5,000', color: 'green', features: ['Direct: 10%', 'Level: 5%', 'Product Worth: ₹5,000'] },
                                { name: 'Gold Package', price: '₹10,000', color: 'orange', features: ['Direct: 12%', 'Level: 7%', 'Product Worth: ₹10,000'] },
                                { name: 'Platinum Package', price: '₹25,000', color: 'green', features: ['Direct: 15%', 'Level: 10%', 'Product Worth: ₹25,000'] }
                            ].map((pkg, i) => (
                                <div key={i} className={`bg-gradient-to-br from-${pkg.color === 'green' ? 'green-500 to-green-600' : 'orange-500 to-orange-600'} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform`}>
                                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-3xl font-bold mb-4">{pkg.price}</p>
                                    <ul className="space-y-2 text-sm mb-6">
                                        {pkg.features.map((feature, j) => (
                                            <li key={j}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                    <button className="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-100">
                                        Purchase Now
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Product List */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                                            Product Image
                                        </div>
                                        <h4 className="font-semibold text-gray-800">Product Name {i}</h4>
                                        <p className="text-sm text-gray-600">SKU: PROD00{i}</p>
                                        <p className="text-lg font-bold text-green-600 mt-2">₹{i * 1000}</p>
                                        <button className="mt-3 w-full bg-gradient-to-r from-green-600 to-orange-500 text-white py-2 rounded-lg hover:from-green-700 hover:to-orange-600">
                                            Add to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'wallet':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Wallet Management</h2>

                        {/* Wallet Balance Card - Green to Orange Gradient */}
                        <div className="bg-gradient-to-r from-green-600 to-orange-500 rounded-xl shadow-lg p-6 text-white mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm opacity-90">Available Balance</p>
                                    <p className="text-4xl font-bold mt-2">₹78,910</p>
                                    <p className="text-sm opacity-90 mt-2">Last updated: Today 10:30 AM</p>
                                </div>
                                <div className="text-6xl">💰</div>
                            </div>
                        </div>

                        {/* Wallet Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-500">
                                <span className="text-3xl mb-2 block">💳</span>
                                <h3 className="font-semibold text-gray-800">Add Fund</h3>
                                <p className="text-sm text-gray-600">Request for adding money</p>
                            </button>
                            <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-orange-500">
                                <span className="text-3xl mb-2 block">↗️</span>
                                <h3 className="font-semibold text-gray-800">Transfer</h3>
                                <p className="text-sm text-gray-600">Send money to others</p>
                            </button>
                            <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-500">
                                <span className="text-3xl mb-2 block">📊</span>
                                <h3 className="font-semibold text-gray-800">History</h3>
                                <p className="text-sm text-gray-600">View all transactions</p>
                            </button>
                        </div>

                        {/* Recent Wallet Transactions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                            <div className="space-y-3">
                                {transactions.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{item.type === 'Commission' ? '💵' : item.type === 'Transfer' ? '↗️' : '🛒'}</span>
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.type}</p>
                                                <p className="text-xs text-gray-500">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">{item.amount}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            // Income Tab
            case 'income':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Income Details</h2>

                        {/* Income Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                <p className="text-sm text-gray-500">Direct Commission</p>
                                <p className="text-2xl font-bold text-gray-800">₹45,000</p>
                                <p className="text-xs text-green-600 mt-1">+12% this month</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                                <p className="text-sm text-gray-500">Level Commission</p>
                                <p className="text-2xl font-bold text-gray-800">₹28,500</p>
                                <p className="text-xs text-orange-600 mt-1">+8% this month</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                <p className="text-sm text-gray-500">Product Commission</p>
                                <p className="text-2xl font-bold text-gray-800">₹32,000</p>
                                <p className="text-xs text-green-600 mt-1">+15% this month</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                                <p className="text-sm text-gray-500">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-800">₹1,05,500</p>
                                <p className="text-xs text-orange-600 mt-1">+11% this month</p>
                            </div>
                        </div>

                        {/* Income History Table */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Income History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3">2024-01-{10 + i}</td>
                                                <td className="px-4 py-3">{i % 2 === 0 ? 'Direct' : 'Level'}</td>
                                                <td className="px-4 py-3">FR{1000 + i}</td>
                                                <td className="px-4 py-3 font-semibold text-green-600">₹{i * 1500}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Credited</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            // Reports Tab
            case 'reports':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports</h2>

                        {/* Report Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {[
                                { title: 'Joining Report', icon: '📋', color: 'green' },
                                { title: 'Income Report', icon: '💰', color: 'orange' },
                                { title: 'Purchase Report', icon: '🛒', color: 'green' },
                                { title: 'Team Business', icon: '👥', color: 'orange' },
                                { title: 'Daily Report', icon: '📅', color: 'green' },
                                { title: 'Monthly Report', icon: '📊', color: 'orange' }
                            ].map((report, i) => (
                                <div key={i} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-${report.color}-500`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-3xl mb-2 block">{report.icon}</span>
                                            <h3 className="font-semibold text-gray-800">{report.title}</h3>
                                        </div>
                                        <button className={`text-${report.color}-600 hover:text-${report.color}-800`}>
                                            Download →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            // Support Tab
            case 'support':
                return (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Support & Help</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Create Ticket */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Support Ticket</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Enter subject" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                                            <option>Technical Issue</option>
                                            <option>Payment Related</option>
                                            <option>Account Issue</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                        <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Describe your issue..."></textarea>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-green-600 to-orange-500 text-white py-2 rounded-lg hover:from-green-700 hover:to-orange-600">
                                        Submit Ticket
                                    </button>
                                </form>
                            </div>

                            {/* Ticket History */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tickets</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-800">Ticket #{1000 + i}</h4>
                                                <span className={`px-2 py-1 text-xs rounded-full ${i === 1 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {i === 1 ? 'Resolved' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Payment Related Issue</p>
                                            <p className="text-xs text-gray-500 mt-2">Submitted on: 2024-01-{10 + i}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 text-green-600 hover:text-green-800 text-sm font-semibold">
                                    View All Tickets →
                                </button>
                            </div>
                        </div>
                    </div>
                );

            // Notifications Tab
            case 'notifications':
                return (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Updates & Notifications</h2>

                        <div className="bg-white rounded-xl shadow-lg divide-y">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${i % 2 === 0 ? 'bg-green-500' : 'bg-orange-500'}`}>
                                            {i % 2 === 0 ? '📢' : '🎉'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">
                                                {i === 1 ? 'New Product Launch' :
                                                    i === 2 ? 'Special Offer for Franchise' :
                                                        i === 3 ? 'Maintenance Update' :
                                                            i === 4 ? 'Commission Rate Changed' :
                                                                'Holiday Notice'}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {i === 1 ? 'New products added to inventory. Check them out!' :
                                                    i === 2 ? 'Get 10% extra commission this month' :
                                                        i === 3 ? 'System maintenance on Sunday 2 AM to 4 AM' :
                                                            i === 4 ? 'Direct commission increased to 15%' :
                                                                'Office closed on Republic Day'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                                        </div>
                                        {i === 1 && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🚧</span>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
                        <p className="text-gray-600">This section is under development</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
                                    Franchise Panel
                                </h1>
                            </div>
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0) || 'R'}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-gray-800">{user?.name || 'Rajesh Kumar'}</p>
                                    <p className="text-xs text-gray-500">ID: FR12345</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={onLogout}
                                className="ml-4 px-4 py-2 bg-gradient-to-r from-green-600 to-orange-500 text-white rounded-lg hover:from-green-700 hover:to-orange-600 text-sm font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs - Desktop */}
                    <nav className="hidden lg:block border-t">
                        <div className="flex space-x-1 overflow-x-auto">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === item.id
                                            ? `border-${item.color}-600 text-${item.color}-600`
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    {showMobileMenu && (
                        <div className="lg:hidden border-t py-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setShowMobileMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 font-medium text-sm ${activeTab === item.id
                                            ? `bg-${item.color}-50 text-${item.color}-600`
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default FranchiseDashboard;
