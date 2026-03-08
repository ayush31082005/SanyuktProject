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
import Gallery from '../pages/Gallery.jsx'
import Events from '../pages/Events.jsx'
import News from '../pages/News.jsx'
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

// ✅ Admin imports
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminProducts from '../pages/admin/Products'
import AdminFranchise from '../pages/admin/Franchise.jsx'
import AdminRoute from '../routes/AdminRoutes.jsx'
import AdminGrievance from '../pages/admin/AdminGrievance.jsx'
import AdminOrders from '../pages/admin/Orders.jsx'
import AdminGallery from '../pages/admin/Gallery.jsx'
import AdminEvents from '../pages/admin/Events.jsx'
import AdminNews from '../pages/admin/News.jsx'

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
                <Route path='bonus/first' element={<DashboardPlaceholder title="First Purchase Bonus" />} />
                <Route path='bonus/repurchase' element={<DashboardPlaceholder title="Repurchase Bonus" />} />
                <Route path='wallet' element={<DashboardPlaceholder title="E-Wallet" />} />
                <Route path='wallet/generation' element={<DashboardPlaceholder title="Generation Wallet" />} />
                <Route path='folder' element={<DashboardPlaceholder title="My Folder" />} />
            </Route>

            <Route path='/order-details/:id' element={<OrderDetails />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/news' element={<News />} />
            <Route path='/events' element={<Events />} />


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
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="news" element={<AdminNews />} />


            </Route>

        </Routes>
    )
}

export default MainRoutes
