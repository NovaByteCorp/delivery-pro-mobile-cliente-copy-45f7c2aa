import Layout from "./Layout.jsx";

import Menu from "./Menu";

import Admin from "./Admin";

import Welcome from "./Welcome";

import Orders from "./Orders";

import Deliveries from "./Deliveries";

import Support from "./Support";

import Reports from "./Reports";

import AllRestaurants from "./AllRestaurants";

import AdminRegionals from "./AdminRegionals";

import AllDeliveries from "./AllDeliveries";

import Settings from "./Settings";

import Home from "./Home";

import Dashboard from "./Dashboard";

import AllOrders from "./AllOrders";

import Profile from "./Profile";

import ClientDashboard from "./ClientDashboard";

import AccountPage from "./AccountPage";

import ChangePassword from "./ChangePassword";

import DeliveryAddress from "./DeliveryAddress";

import NewSupportTicket from "./NewSupportTicket";

import Cart from "./Cart";

import MyOrders from "./MyOrders";

import AllProducts from "./AllProducts";

import Search from "./Search";

import ProductDetails from "./ProductDetails";

import Favorites from "./Favorites";

import Checkoutclient from "./Checkoutclient";

import OrderConfirmation from "./OrderConfirmation";

import OrderTracking from "./OrderTracking";

import OrderHistory from "./OrderHistory";

import PaymentMethods from "./PaymentMethods";

import ClientSettings from "./ClientSettings";

/* Driver */

import DriverDashboard from "./DriverDashboard";

import ProfileDriver from "./ProfileDriver";

import DriverHistory from "./DriverHistory";

import DriverEarnings from "./DriverEarnings";

/* Driver */


import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Menu: Menu,
    
    Admin: Admin,
    
    Welcome: Welcome,
    
    Orders: Orders,
    
    Deliveries: Deliveries,
    
    Support: Support,
    
    Reports: Reports,
    
    AllRestaurants: AllRestaurants,
    
    AdminRegionals: AdminRegionals,
    
    AllDeliveries: AllDeliveries,
    
    Settings: Settings,
    
    Home: Home,
    
    Dashboard: Dashboard,
    
    AllOrders: AllOrders,
    
    Profile: Profile,
    
    ClientDashboard: ClientDashboard,
    
    AccountPage: AccountPage,
    
    ChangePassword: ChangePassword,
    
    DeliveryAddress: DeliveryAddress,
    
    NewSupportTicket: NewSupportTicket,
    
    Cart: Cart,
    
    MyOrders: MyOrders,
    
    AllProducts: AllProducts,
    
    Search: Search,
    
    ProductDetails: ProductDetails,
    
    Favorites: Favorites,
    
    Checkoutclient: Checkoutclient,
    
    OrderConfirmation: OrderConfirmation,
    
    OrderTracking: OrderTracking,
    
    OrderHistory: OrderHistory,
    
    PaymentMethods: PaymentMethods,
    
    ClientSettings: ClientSettings,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Menu />} />
                
                
                <Route path="/Menu" element={<Menu />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/Orders" element={<Orders />} />
                
                <Route path="/Deliveries" element={<Deliveries />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/AllRestaurants" element={<AllRestaurants />} />
                
                <Route path="/AdminRegionals" element={<AdminRegionals />} />
                
                <Route path="/AllDeliveries" element={<AllDeliveries />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/AllOrders" element={<AllOrders />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/ClientDashboard" element={<ClientDashboard />} />
                
                <Route path="/AccountPage" element={<AccountPage />} />
                
                <Route path="/ChangePassword" element={<ChangePassword />} />
                
                <Route path="/DeliveryAddress" element={<DeliveryAddress />} />
                
                <Route path="/NewSupportTicket" element={<NewSupportTicket />} />
                
                <Route path="/Cart" element={<Cart />} />
                
                <Route path="/MyOrders" element={<MyOrders />} />
                
                <Route path="/AllProducts" element={<AllProducts />} />
                
                <Route path="/Search" element={<Search />} />
                
                <Route path="/ProductDetails" element={<ProductDetails />} />
                
                <Route path="/Favorites" element={<Favorites />} />
                
                <Route path="/Checkoutclient" element={<Checkoutclient />} />
                
                <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
                
                <Route path="/OrderTracking" element={<OrderTracking />} />
                
                <Route path="/OrderHistory" element={<OrderHistory />} />
                
                <Route path="/PaymentMethods" element={<PaymentMethods />} />
                
                <Route path="/ClientSettings" element={<ClientSettings />} />

                <Route path="/DriverDashboard" element={<DriverDashboard />} />

                <Route path="/ProfileDriver" element={<ProfileDriver />} />
                
                <Route path="/DriverHistory" element={<DriverHistory />} />

                <Route path="/DriverEarnings" element={<DriverEarnings />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}