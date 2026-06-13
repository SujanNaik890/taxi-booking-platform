import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AdminGuard, PassengerGuard } from './components/RouteGuard';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Destinations from './pages/Destinations';
import Booking from './pages/Booking';
import BookingCheckout from './pages/BookingCheckout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-brand-dark">
        {/* Premium Toast notifications container */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F1F1F',
              color: '#FFF',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontFamily: 'Outfit, sans-serif',
            },
          }}
        />
        
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route
              path="/booking"
              element={
                <PassengerGuard>
                  <Booking />
                </PassengerGuard>
              }
            />
            <Route path="/booking/checkout/:id" element={<BookingCheckout />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Passenger auth route */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin auth route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected dashboard console */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
