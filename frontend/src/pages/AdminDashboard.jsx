import React, { useState, useEffect } from 'react';
import { bookingsAPI, destinationsAPI, reviewsAPI } from '../services/api';
import { 
  BarChart3, Car, MessageSquare, ShieldCheck, Search, Filter, 
  Trash2, Edit, Check, X, Plus, ExternalLink, RefreshCw, IndianRupee 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({ totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, completedTrips: 0 });
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Search & Filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [bookingSearchText, setBookingSearchText] = useState('');
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit states
  const [editingBooking, setEditingBooking] = useState(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [waitingCharges, setWaitingCharges] = useState('');
  const [tollsAndPermits, setTollsAndPermits] = useState('');

  // Destination Modal/Form states
  const [showDestForm, setShowDestForm] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destForm, setDestForm] = useState({ name: '', distance: '', description: '', image: '' });

  // Data Fetching
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookRes, destRes, revRes] = await Promise.all([
        bookingsAPI.getStats(),
        bookingsAPI.getAll(bookingStatusFilter, bookingSearchText),
        destinationsAPI.getAll(),
        reviewsAPI.getAllAdmin()
      ]);
      
      setStats(statsRes.data);
      setBookings(bookRes.data);
      setDestinations(destRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [bookingStatusFilter]); // Re-fetch bookings on status filter change

  const handleBookingSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await bookingsAPI.getAll(bookingStatusFilter, bookingSearchText);
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to search bookings");
    } finally {
      setLoading(false);
    }
  };

  // Booking Actions
  const handleEditBookingClick = (booking) => {
    setEditingBooking(booking);
    setQuotePrice(booking.quotedPrice || '');
    setBookingStatus(booking.status);
    setWaitingCharges('');
    setTollsAndPermits('');
  };

  const calculateTotalQuote = (waiting, tolls, currentEditing) => {
    const base = currentEditing?.estimatedPrice || 0;
    const wVal = parseFloat(waiting) || 0;
    const tVal = parseFloat(tolls) || 0;
    setQuotePrice((base + wVal + tVal).toString());
  };

  const handleWaitingChargesChange = (val) => {
    setWaitingCharges(val);
    calculateTotalQuote(val, tollsAndPermits, editingBooking);
  };

  const handleTollsChange = (val) => {
    setTollsAndPermits(val);
    calculateTotalQuote(waitingCharges, val, editingBooking);
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;
    setActionLoading(true);
    try {
      const updatedData = {
        ...editingBooking,
        status: bookingStatus,
        quotedPrice: quotePrice ? parseFloat(quotePrice) : null
      };
      
      // If status is updated to confirmed or completed, reflect payment status as well
      if (bookingStatus === 'CONFIRMED' && editingBooking.paymentStatus !== 'PAID') {
        updatedData.paymentStatus = 'PAID';
      }
      
      await bookingsAPI.update(editingBooking.id, updatedData);
      toast.success("Booking updated successfully!");
      setEditingBooking(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking request?")) return;
    try {
      await bookingsAPI.delete(id);
      toast.success("Booking deleted successfully!");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete booking");
    }
  };

  // Destination Actions
  const handleDestChange = (e) => {
    const { name, value } = e.target;
    setDestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destForm.name || !destForm.distance || !destForm.description || !destForm.image) {
      toast.error("Please fill in all fields");
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        ...destForm,
        distance: parseFloat(destForm.distance)
      };

      if (editingDest) {
        await destinationsAPI.update(editingDest.id, payload);
        toast.success("Destination updated successfully!");
      } else {
        await destinationsAPI.create(payload);
        toast.success("Destination added successfully!");
      }

      setDestForm({ name: '', distance: '', description: '', image: '' });
      setEditingDest(null);
      setShowDestForm(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save destination");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditDestClick = (dest) => {
    setEditingDest(dest);
    setDestForm({
      name: dest.name,
      distance: dest.distance.toString(),
      description: dest.description,
      image: dest.image
    });
    setShowDestForm(true);
  };

  const handleDeleteDest = async (id) => {
    if (!window.confirm("Delete this destination route?")) return;
    try {
      await destinationsAPI.delete(id);
      toast.success("Destination deleted");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete destination");
    }
  };

  // Review Actions
  const handleApproveReview = async (id) => {
    try {
      await reviewsAPI.approve(id);
      toast.success("Review approved for display!");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to approve review");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewsAPI.delete(id);
      toast.success("Review deleted");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  // Helper: Get WhatsApp quotation link for customers
  const sendQuotationLink = (b) => {
    const quote = b.quotedPrice || '0';
    const baseUrl = window.location.origin;
    const checkoutLink = `${baseUrl}/booking/checkout/${b.id}`;
    const text = `Hello ${b.customerName},
Your taxi ride quotation is ready.

Route: ${b.pickup} ➔ ${b.drop}
Schedule: ${b.date} at ${b.time}
Total Price: Rs. ${quote}

Check status & complete advance payment to confirm your booking:
${checkoutLink}`;

    return `https://wa.me/${b.phone.startsWith('91') ? b.phone : '91' + b.phone}?text=${encodeURIComponent(text)}`;
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'QUOTED': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'CONFIRMED': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'COMPLETED': return 'text-gray-400 bg-gray-500/10 border-white/10';
      case 'CANCELLED': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-white bg-white/10';
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-dark px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header & Quick Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Operator Console</h1>
          <p className="text-brand-muted text-xs">Review passenger booking requests, dispatch quotations, and moderation lists.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 bg-brand-charcoal text-xs px-4 py-2.5 rounded-xl border border-white/5 hover:border-brand-gold/30 text-white cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <span className="text-xs text-brand-muted font-semibold uppercase tracking-wider">Total Bookings</span>
          <span className="text-3xl font-bold text-white">{stats.totalBookings}</span>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col justify-between space-y-4 border-l-4 border-yellow-500">
          <span className="text-xs text-brand-muted font-semibold uppercase tracking-wider">Pending Quote</span>
          <span className="text-3xl font-bold text-yellow-400">{stats.pendingBookings}</span>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col justify-between space-y-4 border-l-4 border-green-500">
          <span className="text-xs text-brand-muted font-semibold uppercase tracking-wider">Confirmed (Paid)</span>
          <span className="text-3xl font-bold text-green-400">{stats.confirmedBookings}</span>
        </div>
        <div className="glass p-6 rounded-2xl flex flex-col justify-between space-y-4 border-l-4 border-gray-500">
          <span className="text-xs text-brand-muted font-semibold uppercase tracking-wider">Completed Trips</span>
          <span className="text-3xl font-bold text-gray-400">{stats.completedTrips}</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-white/5 space-x-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'bookings' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-muted hover:text-white'
          }`}
        >
          <Car className="h-4 w-4" />
          <span>Bookings Manager</span>
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`pb-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'destinations' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-muted hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Route Configs</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'reviews' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-muted hover:text-white'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Reviews Moderator</span>
        </button>
      </div>

      {/* 4. Tab Content Panel */}
      <div className="relative">
        
        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <form onSubmit={handleBookingSearch} className="flex-grow flex space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-brand-muted" />
                  <input
                    type="text"
                    value={bookingSearchText}
                    onChange={(e) => setBookingSearchText(e.target.value)}
                    placeholder="Search by customer name or phone..."
                    className="w-full bg-brand-charcoal border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <button type="submit" className="bg-brand-charcoal text-white hover:text-brand-gold px-6 py-3 rounded-xl border border-white/5 text-sm font-semibold transition-all">
                  Search
                </button>
              </form>

              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-brand-gold" />
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-brand-charcoal text-white border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending Quote</option>
                  <option value="QUOTED">Price Quoted</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass h-32 rounded-2xl"></div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass p-12 text-center text-brand-muted text-sm rounded-2xl">
                No bookings found matching query.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-6">
                    {/* Customer info & route */}
                    <div className="space-y-3 flex-grow text-left">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-bold text-white">{booking.customerName}</h3>
                        <span className="text-xs text-brand-muted font-mono">{booking.phone}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-brand-muted">
                        <div>
                          <span className="block text-[10px] uppercase font-semibold text-brand-gold">Route</span>
                          <span className="text-white font-medium mt-0.5 block">{booking.pickup} ➔ {booking.drop}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-semibold text-brand-gold">Schedule</span>
                          <span className="text-white font-medium mt-0.5 block">{booking.date} at {booking.time} ({booking.tripType})</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-semibold text-brand-gold">Distance & Est. Cost</span>
                          <span className="text-white font-medium mt-0.5 block">
                            {booking.distance ? `${booking.distance} KM` : 'N/A'} (Est: {booking.estimatedPrice ? `₹${booking.estimatedPrice}` : 'N/A'})
                          </span>
                        </div>
                      </div>

                      {booking.notes && (
                        <p className="text-xs bg-brand-charcoal/30 px-3 py-1.5 rounded-lg inline-block border border-white/5">
                          <span className="text-brand-gold font-semibold">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>

                    {/* Quotation details & Actions */}
                    <div className="flex flex-col justify-between items-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-semibold text-brand-gold">Quote Price</span>
                        <span className="text-xl font-bold text-white flex items-center justify-end">
                          <IndianRupee className="h-4 w-4 text-brand-gold" />
                          <span>{booking.quotedPrice ? `${booking.quotedPrice}` : 'TBD'}</span>
                        </span>
                        <span className="block text-[10px] text-brand-muted">Payment: {booking.paymentStatus}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {/* Quote & Status Action */}
                        <button
                          onClick={() => handleEditBookingClick(booking)}
                          className="bg-brand-charcoal hover:border-brand-gold/50 text-white p-2.5 rounded-xl border border-white/5 transition-all text-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Update</span>
                        </button>
                        
                        {/* Send Quotation Link */}
                        {booking.status === 'QUOTED' && (
                          <a
                            href={sendQuotationLink(booking)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all hover:scale-105"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>WhatsApp Quote</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Delete Booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROUTE CONFIGS */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            
            {/* Create Route CTA */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Popular Destinations List</h2>
              <button
                onClick={() => {
                  setEditingDest(null);
                  setDestForm({ name: '', distance: '', description: '', image: '' });
                  setShowDestForm(!showDestForm);
                }}
                className="bg-gradient-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Destination</span>
              </button>
            </div>

            {/* Destination Form (Collapsible) */}
            {showDestForm && (
              <form onSubmit={handleSaveDestination} className="glass p-6 rounded-2xl border border-brand-gold/15 space-y-4">
                <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider">
                  {editingDest ? 'Edit Destination' : 'Create New Destination'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-brand-muted font-medium">Destination Name</label>
                    <input
                      type="text"
                      name="name"
                      value={destForm.name}
                      onChange={handleDestChange}
                      placeholder="E.g., Coorg"
                      className="w-full bg-brand-charcoal border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-brand-muted font-medium">One-Way Distance (KM)</label>
                    <input
                      type="number"
                      name="distance"
                      value={destForm.distance}
                      onChange={handleDestChange}
                      placeholder="E.g., 250"
                      className="w-full bg-brand-charcoal border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-brand-muted font-medium">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={destForm.image}
                      onChange={handleDestChange}
                      placeholder="Unsplash image URL"
                      className="w-full bg-brand-charcoal border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-brand-muted font-medium">Route Description</label>
                  <textarea
                    name="description"
                    value={destForm.description}
                    onChange={handleDestChange}
                    rows="2"
                    placeholder="Provide a small travel summary..."
                    className="w-full bg-brand-charcoal border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex space-x-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDestForm(false);
                      setEditingDest(null);
                    }}
                    className="bg-brand-charcoal text-white hover:text-red-500 border border-white/5 px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-gold px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : 'Save Route'}
                  </button>
                </div>
              </form>
            )}

            {/* Grid of Route Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <div key={dest.id} className="glass rounded-xl overflow-hidden flex flex-col justify-between">
                  <div className="h-40 overflow-hidden relative">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-brand-dark/80 px-2 py-0.5 rounded text-[10px] text-brand-gold font-bold">
                      {dest.distance} KM
                    </div>
                  </div>
                  <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{dest.name}</h4>
                      <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{dest.description}</p>
                    </div>
                    <div className="flex space-x-2 border-t border-white/5 pt-3 justify-end">
                      <button
                        onClick={() => handleEditDestClick(dest)}
                        className="p-2 bg-brand-charcoal text-brand-gold hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
                        title="Edit Route"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDest(dest.id)}
                        className="p-2 bg-red-600/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors cursor-pointer"
                        title="Delete Route"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATOR */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white text-left">Customer Reviews Moderation Queue</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="glass p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                        rev.approved ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                      }`}>
                        {rev.approved ? 'Approved' : 'Pending Review'}
                      </span>
                    </div>

                    <div className="flex space-x-1 text-brand-gold">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <svg
                          key={idx}
                          className={`h-3.5 w-3.5 fill-current ${idx < rev.rating ? 'text-brand-gold' : 'text-brand-muted'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-xs text-brand-muted leading-relaxed italic">"{rev.review}"</p>
                  </div>

                  <div className="flex space-x-2 border-t border-white/5 pt-3 justify-end">
                    {!rev.approved && (
                      <button
                        onClick={() => handleApproveReview(rev.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="bg-red-500/15 text-red-500 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. EDIT BOOKING OVERLAY MODAL */}
      {editingBooking && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass w-full max-w-md p-6 rounded-2xl border border-brand-gold/25 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-base">Update Booking Quote</h3>
              <button onClick={() => setEditingBooking(null)} className="text-brand-muted hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-brand-muted space-y-1 bg-brand-dark/40 p-4 rounded-xl border border-white/5">
                <span className="block text-[10px] uppercase font-semibold text-brand-gold mb-1">Ride Reference Details</span>
                <p><span className="text-white font-semibold">Customer:</span> {editingBooking.customerName}</p>
                <p><span className="text-white font-semibold">Route:</span> {editingBooking.pickup} ➔ {editingBooking.drop}</p>
                {editingBooking.distance && (
                  <p><span className="text-white font-semibold">Distance:</span> {editingBooking.distance} KM</p>
                )}
                {editingBooking.estimatedPrice && (
                  <p><span className="text-white font-semibold">Auto Estimate:</span> <span className="text-brand-gold font-semibold">₹{editingBooking.estimatedPrice}</span></p>
                )}
              </div>

              {/* Quote Calculator Helper (Applied by Owner) */}
              <div className="bg-brand-charcoal/40 p-4 rounded-xl border border-white/5 space-y-3">
                <span className="block text-[10px] uppercase font-semibold text-brand-gold">Quote Helper (Owner-Applied)</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] text-brand-muted uppercase font-semibold">Waiting Fees (₹)</label>
                    <input
                      type="number"
                      value={waitingCharges}
                      onChange={(e) => handleWaitingChargesChange(e.target.value)}
                      placeholder="E.g., 150"
                      className="w-full bg-brand-charcoal border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] text-brand-muted uppercase font-semibold">Tolls & Permits (₹)</label>
                    <input
                      type="number"
                      value={tollsAndPermits}
                      onChange={(e) => handleTollsChange(e.target.value)}
                      placeholder="E.g., 200"
                      className="w-full bg-brand-charcoal border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="text-[9px] text-brand-muted flex justify-between border-t border-white/5 pt-1.5 mt-1">
                  <span>Base Fare: ₹{editingBooking.estimatedPrice || 0}</span>
                  <span>Tolls + Waiting: ₹{((parseFloat(waitingCharges) || 0) + (parseFloat(tollsAndPermits) || 0))}</span>
                </div>
              </div>

              {/* Price Quote input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider block">Final Quoted Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-brand-gold font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="Enter manual ride cost"
                    className="w-full bg-brand-charcoal border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Status input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider block">Booking Status</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value)}
                  className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="PENDING">Pending Quote</option>
                  <option value="QUOTED">Price Quoted</option>
                  <option value="CONFIRMED">Confirmed (Advance Paid)</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2 justify-end border-t border-white/5 pt-4">
              <button
                onClick={() => setEditingBooking(null)}
                className="bg-brand-charcoal border border-white/5 px-4 py-2 rounded-xl text-xs text-white cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleUpdateBooking}
                disabled={actionLoading}
                className="bg-gradient-gold px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {actionLoading ? 'Updating...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
