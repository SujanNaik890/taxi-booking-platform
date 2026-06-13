import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ShieldAlert, Key, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // If user is already logged in, bypass login screen
    if (authAPI.isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
    
    // Check if redirect due to expired session
    if (searchParams.get('expired')) {
      toast.error("Session expired. Please login again.");
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(username, password);
      const { token, username: resUsername, role } = res.data;
      
      if (role !== 'ROLE_ADMIN') {
        toast.error("Access denied. Admin portal is for operators only.");
        return;
      }
      
      // Save credentials in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', resUsername);
      localStorage.setItem('role', role);
      
      toast.success(`Welcome back, ${resUsername}!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data || "Invalid credentials. Please try again.";
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
          <div className="inline-flex bg-brand-gold/10 text-brand-gold p-4 rounded-3xl border border-brand-gold/20 shadow-lg">
            <ShieldAlert className="h-10 w-10 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white">Admin Portal</h1>
            <p className="text-brand-muted text-xs">Access the bookings management and route configurations control panel.</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full bg-brand-charcoal/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-gold" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-brand-charcoal/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4 text-brand-dark" />
          </button>
        </form>

        {/* Home Link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-brand-muted hover:text-brand-gold transition-colors">
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
