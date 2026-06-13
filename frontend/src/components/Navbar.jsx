import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Car, ShieldAlert, LogOut } from 'lucide-react';
import { authAPI } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-gold p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Car className="h-6 w-6 text-brand-dark" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Sharavati <span className="text-brand-gold">Travel Link</span>
              </span>
              <span className="block text-[10px] text-brand-muted tracking-wider uppercase font-semibold">
                Owner Operated Service
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-brand-gold font-semibold'
                    : 'text-gray-300 hover:text-brand-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Booking CTA or Admin Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              authAPI.isAdmin() ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-xs text-brand-gold border border-brand-gold/30 px-3 py-1.5 rounded-full hover:bg-brand-gold/10 transition-colors"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/booking"
                    className="bg-gradient-gold px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-md transition-all duration-300 hover:scale-105"
                  >
                    Book a Ride
                  </Link>
                  <div className="flex items-center space-x-2 text-xs text-gray-300 border border-white/10 px-3 py-1.5 rounded-full bg-brand-charcoal/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>{authAPI.getUsername()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-brand-gold transition-colors"
                >
                  Login / Sign Up
                </Link>
                <Link
                  to="/booking"
                  className="bg-gradient-gold px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-md transition-all duration-300 hover:scale-105"
                >
                  Book a Ride
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            {isAuthenticated && authAPI.isAdmin() && (
              <Link
                to="/admin/dashboard"
                className="text-brand-gold"
                title="Dashboard"
              >
                <ShieldAlert className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-40 w-64 glass shadow-2xl p-6 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white cursor-pointer">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-base font-medium transition-colors ${
                isActive(link.path) ? 'text-brand-gold' : 'text-gray-300 hover:text-brand-gold'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <hr className="border-white/10" />

          {isAuthenticated ? (
            <div className="flex flex-col space-y-4">
              {authAPI.isAdmin() ? (
                <Link
                  to="/admin/dashboard"
                  className="w-full text-center border border-brand-gold text-brand-gold px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-gold/10 transition-all"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <div className="w-full text-center border border-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-semibold bg-brand-charcoal/50">
                  Passenger: {authAPI.getUsername()}
                </div>
              )}
              <Link
                to="/booking"
                className="w-full text-center bg-gradient-gold px-4 py-3 rounded-full text-sm font-bold shadow-md block"
              >
                Book a Ride
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center bg-red-600/20 text-red-500 border border-red-600/30 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600/30 transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link
                to="/login"
                className="w-full text-center border border-white/10 text-gray-300 px-4 py-2 rounded-full text-sm font-semibold hover:text-brand-gold hover:border-brand-gold/30 transition-all"
              >
                Login / Sign Up
              </Link>
              <Link
                to="/booking"
                className="w-full text-center bg-gradient-gold px-4 py-3 rounded-full text-sm font-bold shadow-md block"
              >
                Book a Ride
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
