import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ShieldCheck, Mail, Lock, Phone, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // If user is already logged in as a passenger, bypass login screen
    if (authAPI.isAuthenticated()) {
      if (authAPI.isPassenger()) {
        navigate('/booking', { replace: true });
      } else if (authAPI.isAdmin()) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
    
    // Check if session expired
    if (searchParams.get('expired')) {
      toast.error("Session expired. Please login again.");
    }
  }, [navigate, searchParams]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(loginEmail, loginPassword);
      const { token, username, role, name, phone } = res.data;

      // Save tokens
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      if (name) localStorage.setItem('name', name);
      if (phone) localStorage.setItem('phone', phone);

      toast.success(`Welcome back, ${name || username}!`);
      
      // Redirect
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/booking', { replace: true });
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data || "Invalid credentials. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      toast.error("Please fill in all registration fields");
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(regName, regEmail, regPhone, regPassword);
      toast.success("Registration successful! Please login.");
      setIsRegister(false);
      // Prefill login email
      setLoginEmail(regEmail);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data || "Failed to register. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-dark flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Banner Logo */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex bg-brand-gold/10 text-brand-gold p-4 rounded-3xl border border-brand-gold/20 shadow-lg">
            <ShieldCheck className="h-10 w-10 text-brand-gold" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white">Passenger Portal</h1>
            <p className="text-brand-muted text-xs">Login or Register to book your scenic ride with Sharavati Travel Link.</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass p-8 rounded-2xl space-y-6 shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex border border-white/10 rounded-xl overflow-hidden p-1 bg-brand-dark/40">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-xs font-bold transition-all rounded-lg ${
                !isRegister
                  ? 'bg-brand-gold text-brand-dark'
                  : 'text-white hover:text-brand-gold'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-xs font-bold transition-all rounded-lg ${
                isRegister
                  ? 'bg-brand-gold text-brand-dark'
                  : 'text-white hover:text-brand-gold'
              }`}
            >
              Register
            </button>
          </div>

          {!isRegister ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Email or Phone Number</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="E.g., name@example.com or phone"
                    className="premium-input-icon"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="premium-input-icon"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="h-4 w-4 text-brand-dark" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="E.g., Rajesh Kumar"
                    className="premium-input-icon"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="premium-input-icon"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="E.g., 8670175981"
                    className="premium-input-icon"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="premium-input-icon"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
              >
                <span>{loading ? 'Registering...' : 'Register'}</span>
                <ArrowRight className="h-4 w-4 text-brand-dark" />
              </button>
            </form>
          )}

          {/* Admin Redirect Option */}
          <div className="border-t border-white/5 pt-4 text-center">
            <Link
              to="/admin/login"
              className="text-xs text-brand-muted hover:text-brand-gold font-semibold transition-colors"
            >
              Are you an operator? Admin Login
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-brand-muted hover:text-brand-gold transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
