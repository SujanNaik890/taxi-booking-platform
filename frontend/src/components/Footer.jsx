import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Key } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-gold p-2 rounded-xl">
                <Car className="h-5 w-5 text-brand-dark" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Sharavati <span className="text-brand-gold">Travel Link</span>
              </span>
            </Link>
            <p className="text-sm text-brand-muted leading-relaxed">
              Professional owner-operated cab service offering city rides, outstation trips, and airport transfers. Enjoy a safe, reliable, and premium journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-brand-muted hover:text-brand-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-brand-muted hover:text-brand-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-brand-muted hover:text-brand-gold transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/destinations" className="text-brand-muted hover:text-brand-gold transition-colors">Destinations</Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Our Services</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li className="hover:text-brand-gold transition-colors">City Pickup & Drop</li>
              <li className="hover:text-brand-gold transition-colors">Airport Transfers</li>
              <li className="hover:text-brand-gold transition-colors">Outstation Trips</li>
              <li className="hover:text-brand-gold transition-colors">Custom Tourist Routes</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Contact Info</h4>
            <ul className="space-y-3.5 text-sm text-brand-muted">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>+91 86701 75981</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>bookings@sharavatitravellink.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <span>Mysore Road, Bengaluru, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/5 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-brand-muted space-y-4 sm:space-y-0">
          <p>© {currentYear} Sharavati Travel Link. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/admin/login" className="flex items-center space-x-1.5 hover:text-brand-gold transition-colors">
              <Key className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
