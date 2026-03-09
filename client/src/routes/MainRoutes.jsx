import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home.jsx'
import Registation from '../pages/Registation.jsx'
import Login from '../pages/Login.jsx'
import ContactUs from '../pages/ContactUs.jsx'
import AboutUs from '../pages/AboutUs.jsx'
import Legal from '../pages/Legal.jsx'
import Grievance from '../pages/Grievance.jsx'
import Product from '../pages/Product.jsx'
import Recharge from '../pages/Recharge.jsx'
import MyAccount from '../pages/MyAccount.jsx'
import UserDashboardLayout from '../layouts/UserDashboardLayout.jsx'
import DashboardOverview from '../pages/DashboardOverview.jsx'
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx'

import Opportunities from '../pages/Opportunities.jsx'
import ExchangePolicy from '../footerPages/ExchangePolicy.jsx'
import MarketingSalesPolicy from '../footerPages/MarketingSalesPolicy.jsx'
import PaymentPolicy from '../footerPages/PaymentPolicy.jsx'
import PrivacyPolicy from '../footerPages/PrivacyPolicy.jsx'
import TermsConditions from '../footerPages/TermsConditions.jsx'
import RefundCancellationPolicy from '../footerPages/RefundCancellationPolicy.jsx'
import ShipmentDeliveryPolicy from '../footerPages/ShipmentDeliveryPolicy.jsx'
import OrderPolicy from '../footerPages/OrderPolicy.jsx'
import TestimonialPolicy from '../footerPages/TestimonialPolicy.jsx'
import OurBanker from '../footerPages/OurBanker.jsx'
import VerifyOTP from '../pages/VerifyOTP.jsx'
import Checkout from '../pages/Checkout.jsx'
import Cart from '../pages/Cart.jsx'
import Franchise from '../pages/Franchise.jsx'
import FranchiseLogin from '../pages/FranchiseLogin.jsx';
import OrderDetails from '../pages/OrderDetails.jsx'
import FranchiseDashboard from '../pages/FranchiseDashboard.jsx'

// ✅ Admin imports
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminProducts from '../pages/admin/Products'
import AdminFranchise from '../pages/admin/Franchise.jsx'
import AdminRoute from '../routes/AdminRoutes.jsx'
import AdminGrievance from '../pages/admin/AdminGrievance.jsx'
import AdminOrders from '../pages/admin/Orders.jsx'

const MainRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Registation />} />
            <Route path='/login' element={<Login />} />
            <Route path='/contact' element={<ContactUs />} />
            <Route path='/company/about' element={<AboutUs />} />
            <Route path='/company/legal' element={<Legal />} />
            <Route path='/grievance' element={<Grievance />} />
            <Route path='/products' element={<Product />} />
            <Route path='/recharge' element={<Recharge />} />
            <Route path='/opportunities' element={<Opportunities />} />
            <Route path='/exchange-policy' element={<ExchangePolicy />} />
            <Route path='/marketing-sales-policy' element={<MarketingSalesPolicy />} />
            <Route path='/payment-policy' element={<PaymentPolicy />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-conditions' element={<TermsConditions />} />
            <Route path='/cancellation-policy' element={<RefundCancellationPolicy />} />
            <Route path='/shipment-delivery-policy' element={<ShipmentDeliveryPolicy />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/order-policy' element={<OrderPolicy />} />
            <Route path='/testimonial-policy' element={<TestimonialPolicy />} />
            <Route path='/banker' element={<OurBanker />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/franchise/list' element={<Franchise />} />
            <Route path='/franchise/login' element={<FranchiseLogin />} />
            <Route path='/franchise/dashboard' element={<FranchiseDashboard />} />

            <Route path='/my-account' element={<UserDashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path='profile' element={<MyAccount defaultTab={0} />} />
                <Route path='address' element={<MyAccount defaultTab={1} />} />
                <Route path='orders' element={<MyAccount defaultTab={2} />} />
                <Route path='transactions' element={<MyAccount defaultTab={3} />} />
                <Route path='grievances' element={<MyAccount defaultTab={4} />} />
                <Route path='kyc' element={<MyAccount defaultTab={5} />} />
                <Route path='cart' element={<MyAccount defaultTab={-1} />} />

                {/* Placeholder Routes for unfinished sections */}
                <Route path='downline' element={<DashboardPlaceholder title="My Downline" />} />
                <Route path='downline/directs' element={<DashboardPlaceholder title="My Directs" />} />
                <Route path='downline/left-team' element={<DashboardPlaceholder title="Left Team" />} />
                <Route path='downline/right-team' element={<DashboardPlaceholder title="Right Team" />} />
                <Route path='downline/all-team' element={<DashboardPlaceholder title="All Team" />} />
                <Route path='downline/tree-view' element={<DashboardPlaceholder title="Tree View" />} />

                <Route path='bonus/first' element={<DashboardPlaceholder title="First Purchase Bonus" />} />
                <Route path='bonus/first/silver' element={<DashboardPlaceholder title="Silver Matching" />} />
                <Route path='bonus/first/gold' element={<DashboardPlaceholder title="Gold Matching" />} />
                <Route path='bonus/first/diamond' element={<DashboardPlaceholder title="Diamond Matching" />} />

                <Route path='bonus/repurchase' element={<DashboardPlaceholder title="Repurchase Bonus" />} />
                <Route path='bonus/repurchase/self' element={<DashboardPlaceholder title="Self Repurchase Income" />} />
                <Route path='bonus/repurchase/level' element={<DashboardPlaceholder title="Repurchase Level Income" />} />
                <Route path='bonus/repurchase/sponsor' element={<DashboardPlaceholder title="Sponsor Income" />} />
                <Route path='bonus/repurchase/royalty' element={<DashboardPlaceholder title="Royalty Bonus" />} />
                <Route path='bonus/repurchase/director' element={<DashboardPlaceholder title="Director Bonus" />} />
                <Route path='bonus/repurchase/house' element={<DashboardPlaceholder title="House Fund" />} />
                <Route path='bonus/repurchase/leadership' element={<DashboardPlaceholder title="Leadership Fund" />} />
                <Route path='bonus/repurchase/car' element={<DashboardPlaceholder title="Car Fund" />} />
                <Route path='bonus/repurchase/travel' element={<DashboardPlaceholder title="Travel Fund" />} />
                <Route path='bonus/repurchase/bike' element={<DashboardPlaceholder title="Bike Fund" />} />

                <Route path='wallet' element={<DashboardPlaceholder title="E-Wallet" />} />
                <Route path='wallet/deduction-report' element={<DashboardPlaceholder title="Deduction Report" />} />
                <Route path='wallet/withdrawal-history' element={<DashboardPlaceholder title="Withdrawal History" />} />
                <Route path='wallet/all-transactions' element={<DashboardPlaceholder title="All Transaction Report" />} />
                <Route path='wallet/daily-closing' element={<DashboardPlaceholder title="Daily Closing Report" />} />

                <Route path='wallet/generation' element={<DashboardPlaceholder title="Generation Wallet" />} />
                <Route path='wallet/generation/deduction-report' element={<DashboardPlaceholder title="Generation Deduction Report" />} />
                <Route path='wallet/generation/withdrawal-history' element={<DashboardPlaceholder title="Generation Withdrawal History" />} />
                <Route path='wallet/generation/all-transactions' element={<DashboardPlaceholder title="Generation All Transactions" />} />
                <Route path='wallet/generation/monthly-closing' element={<DashboardPlaceholder title="Monthly Closing Report" />} />

                <Route path='folder' element={<DashboardPlaceholder title="My Folder" />} />
                <Route path='folder/welcome-letter' element={<DashboardPlaceholder title="Welcome Letter" />} />
                <Route path='folder/download-files' element={<DashboardPlaceholder title="Download Files" />} />
                <Route path='folder/our-banker' element={<DashboardPlaceholder title="Our Banker" />} />
                <Route path='folder/id-card' element={<DashboardPlaceholder title="ID Card" />} />
            </Route>

            <Route path='/order-details/:id' element={<OrderDetails />} />


            {/* 🔥 Admin Routes (Nested) */}
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="franchise" element={<AdminFranchise />} />
                <Route path="grievance" element={<AdminGrievance />} />
                <Route path="orders" element={<AdminOrders />} />


            </Route>

        </Routes>
    )
}

export default MainRoutes

// Dashboard Refined and Verified - Solid Green/Orange Theme Applied
