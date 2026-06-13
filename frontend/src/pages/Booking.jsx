import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Send, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';
import { bookingsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    pickup: '',
    drop: '',
    date: '',
    time: '',
    passengers: 1,
    tripType: 'One Way',
    notes: '',
    distance: '',
    estimatedPrice: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);

  const isNightShift = (timeStr) => {
    if (!timeStr) return false;
    const [hours] = timeStr.split(':').map(Number);
    // Night shift is from 10:00 PM (22:00) to 6:00 AM (06:00)
    return hours >= 22 || hours < 6;
  };

  const computePrice = (dist, tripType, pickupTime) => {
    const dVal = parseFloat(dist);
    if (isNaN(dVal) || dVal <= 0) return '';
    const ratePerKm = isNightShift(pickupTime) ? 22 : 20;
    const multiplier = tripType === 'Round Trip' ? 2 : 1;
    return Math.round(dVal * ratePerKm * multiplier);
  };

  const calculateDistanceOSRM = async (pickupVal, dropVal) => {
    if (!pickupVal || !dropVal) return;
    
    try {
      // 1. Geocode pickup using free OpenStreetMap Nominatim API
      const pickupRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupVal)}&limit=1`,
        { headers: { 'User-Agent': 'SharavatiTravelLinkBookingApp/1.0' } }
      );
      const pickupData = await pickupRes.json();
      if (!pickupData || pickupData.length === 0) {
        console.warn("Could not geocode pickup location");
        return;
      }
      const pickupCoords = { lat: parseFloat(pickupData[0].lat), lon: parseFloat(pickupData[0].lon) };

      // 2. Geocode drop using Nominatim
      const dropRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropVal)}&limit=1`,
        { headers: { 'User-Agent': 'SharavatiTravelLinkBookingApp/1.0' } }
      );
      const dropData = await dropRes.json();
      if (!dropData || dropData.length === 0) {
        console.warn("Could not geocode drop location");
        return;
      }
      const dropCoords = { lat: parseFloat(dropData[0].lat), lon: parseFloat(dropData[0].lon) };

      // 3. Calculate driving distance using free OSRM Routing API
      const osrmRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lon},${pickupCoords.lat};${dropCoords.lon},${dropCoords.lat}?overview=false`
      );
      const osrmData = await osrmRes.json();
      if (osrmData.code === 'Ok' && osrmData.routes && osrmData.routes.length > 0) {
        const distVal = osrmData.routes[0].distance / 1000; // in km
        const roundedDist = Math.round(distVal * 10) / 10; // 1 decimal place
        
        setFormData((prev) => {
          const price = computePrice(roundedDist, prev.tripType, prev.time);
          return {
            ...prev,
            distance: roundedDist,
            estimatedPrice: price
          };
        });
        toast.success(`Calculated distance: ${roundedDist} KM`);
      }
    } catch (err) {
      console.error("OSRM/Nominatim calculation failed:", err);
    }
  };

  const calculateDistance = () => {
    const pickupVal = pickupRef.current?.value || formData.pickup;
    const dropVal = dropRef.current?.value || formData.drop;
    if (!pickupVal || !dropVal) return;

    if (window.google) {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [pickupVal],
          destinations: [dropVal],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            const distText = response.rows[0].elements[0].distance.text;
            const distVal = response.rows[0].elements[0].distance.value / 1000; // in km
            const roundedDist = Math.round(distVal * 10) / 10; // 1 decimal place
            
            setFormData((prev) => {
              const price = computePrice(roundedDist, prev.tripType, prev.time);
              return {
                ...prev,
                distance: roundedDist,
                estimatedPrice: price
              };
            });
            toast.success(`Calculated distance: ${distText}`);
          } else {
            // Fallback to OSRM if Google Matrix fails
            calculateDistanceOSRM(pickupVal, dropVal);
          }
        }
      );
    } else {
      // Fallback to OSRM if Google is not configured
      calculateDistanceOSRM(pickupVal, dropVal);
    }
  };

  // Set initial drop/type from query params and pre-fill customer name & phone if logged in
  useEffect(() => {
    const dest = searchParams.get('destination');
    const type = searchParams.get('type');
    
    const savedName = localStorage.getItem('name');
    const savedPhone = localStorage.getItem('phone');

    setFormData((prev) => ({ 
      ...prev, 
      customerName: savedName || prev.customerName,
      phone: savedPhone || prev.phone,
      ...(dest ? { drop: dest === 'Custom' ? '' : dest } : {})
    }));
    
    if (type) {
      if (type.includes('Airport')) {
        setFormData((prev) => ({ ...prev, tripType: 'One Way', notes: 'Airport Transfer request.' }));
      } else if (type.includes('Outstation')) {
        setFormData((prev) => ({ ...prev, tripType: 'Round Trip' }));
      }
    }
  }, [searchParams]);

  // Google Places Autocomplete Setup
  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google) return;

      const options = {
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry'],
      };

      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, options);
      const dropAutocomplete = new window.google.maps.places.Autocomplete(dropRef.current, options);

      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData((prev) => ({ ...prev, pickup: place.formatted_address }));
          setTimeout(calculateDistance, 50);
        }
      });

      dropAutocomplete.addListener('place_changed', () => {
        const place = dropAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData((prev) => ({ ...prev, drop: place.formatted_address }));
          setTimeout(calculateDistance, 50);
        }
      });
    };

    // Load Script dynamically if key present, else rely on manual inputs
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!window.google && apiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initAutocomplete();
      document.head.appendChild(script);
    } else if (window.google) {
      initAutocomplete();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'distance' || name === 'time') {
        updated.estimatedPrice = computePrice(updated.distance, updated.tripType, updated.time);
      }
      return updated;
    });
  };

  const handleTripTypeChange = (type) => {
    setFormData((prev) => {
      const updated = { ...prev, tripType: type };
      updated.estimatedPrice = computePrice(prev.distance, type, prev.time);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.pickup || !formData.drop || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await bookingsAPI.create(formData);
      setSubmittedBooking(res.data);
      toast.success("Booking request submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate WhatsApp Direct link
  const getWhatsAppLink = () => {
    if (!submittedBooking) return '#';
    const driverPhone = import.meta.env.VITE_DRIVER_PHONE || '918670175981';
    const text = `Hello,
I would like to book a taxi.

Name: ${submittedBooking.customerName}
Phone: ${submittedBooking.phone}
Pickup: ${submittedBooking.pickup}
Destination: ${submittedBooking.drop}
Date: ${submittedBooking.date}
Time: ${submittedBooking.time}
Passengers: ${submittedBooking.passengers}
Trip Type: ${submittedBooking.tripType}
Booking Ref: ${submittedBooking.id}`;

    return `https://wa.me/${driverPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-dark max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Form Container (Cols 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Book Your Taxi</h1>
            <p className="text-brand-muted text-sm leading-relaxed">
              Submit your trip details. Our driver will manually review the request and send you a fixed quotation price via WhatsApp or Phone call.
            </p>
          </div>

          {!submittedBooking ? (
            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="E.g., Rajesh Kumar"
                    className="premium-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="E.g., 8670175981"
                    className="premium-input"
                    required
                  />
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Pickup Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-brand-gold" />
                    <input
                      ref={pickupRef}
                      type="text"
                      name="pickup"
                      value={formData.pickup}
                      onChange={handleChange}
                      onBlur={calculateDistance}
                      placeholder="Address or Landmark"
                      className="premium-input-icon"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Drop Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-brand-gold" />
                    <input
                      ref={dropRef}
                      type="text"
                      name="drop"
                      value={formData.drop}
                      onChange={handleChange}
                      onBlur={calculateDistance}
                      placeholder="Destination city or spot"
                      className="premium-input-icon"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Travel Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-brand-gold" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="premium-input-icon"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Pickup Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-4 w-4 text-brand-gold" />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="premium-input-icon"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Passengers and Trip Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Number of Passengers *</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 h-4 w-4 text-brand-gold" />
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="premium-input-icon appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <option key={num} value={num} className="bg-brand-charcoal text-white">
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Trip Type *</label>
                  <div className="flex border border-white/10 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleTripTypeChange('One Way')}
                      className={`flex-1 py-3 text-sm font-semibold transition-all ${
                        formData.tripType === 'One Way'
                          ? 'bg-brand-gold text-brand-dark'
                          : 'bg-brand-charcoal/50 text-white hover:bg-brand-charcoal'
                      }`}
                    >
                      One Way
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTripTypeChange('Round Trip')}
                      className={`flex-1 py-3 text-sm font-semibold transition-all ${
                        formData.tripType === 'Round Trip'
                          ? 'bg-brand-gold text-brand-dark'
                          : 'bg-brand-charcoal/50 text-white hover:bg-brand-charcoal'
                      }`}
                    >
                      Round Trip
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Need flight pickup, child seat, extra stops, multi-day itinerary?"
                  className="w-full bg-brand-dark/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 text-white resize-none"
                ></textarea>
              </div>

              {/* Fare Calculator Card */}
              <div className="bg-brand-charcoal/30 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                    <span>Fare Calculator</span>
                  </h3>
                  {isNightShift(formData.time) ? (
                    <span className="text-[10px] text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full font-semibold border border-brand-gold/20 flex items-center space-x-1">
                      <span>🌙 Night Rate: ₹22/KM</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-brand-muted bg-white/5 px-2.5 py-0.5 rounded-full font-semibold border border-white/10 flex items-center space-x-1">
                      <span>☀️ Day Rate: ₹20/KM</span>
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-brand-dark/40 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] text-brand-muted uppercase font-semibold">Calculated Distance</span>
                    <span className="text-xl font-bold text-white mt-0.5">
                      {formData.distance ? `${formData.distance} KM` : (
                        <button
                          type="button"
                          onClick={calculateDistance}
                          className="text-brand-gold hover:underline text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                          Auto-Calculate
                        </button>
                      )}
                    </span>
                  </div>

                  <div className="bg-brand-dark/40 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-[10px] text-brand-muted uppercase font-semibold">Estimated Fare</span>
                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-xl font-bold text-brand-gold">₹{formData.estimatedPrice || '0'}</span>
                      {formData.distance && (
                        <span className="text-[9px] text-brand-muted">
                          (₹{isNightShift(formData.time) ? 22 : 20}/KM {formData.tripType === 'Round Trip' ? 'x 2' : ''})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-[9px] text-brand-muted leading-relaxed">
                  * Note: Tolls, parking, and state permit taxes are extra. Waiting charges policy (₹2/minute after 15 mins free) applies if applicable. Final invoice reviewed and confirmed by driver.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.01] cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? 'Submitting Details...' : 'Request Quotation'}</span>
              </button>
            </form>
          ) : (
            // Success State Modal-like Box
            <div className="glass p-8 rounded-2xl text-center space-y-6 border border-green-500/20">
              <div className="inline-flex bg-green-500/10 text-green-400 p-4 rounded-full border border-green-500/20">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Request Sent to Driver!</h2>
                <p className="text-sm text-brand-muted max-w-md mx-auto">
                  Your booking request is saved as **Pending** in our database. Reference ID:
                  <span className="block font-mono text-brand-gold mt-1 bg-brand-charcoal px-3 py-1 rounded border border-white/5 inline-block select-all">
                    {submittedBooking.id}
                  </span>
                </p>
              </div>

              <div className="p-4 bg-brand-charcoal/30 rounded-xl text-left text-xs text-brand-muted space-y-2.5 border border-white/5">
                <p className="font-semibold text-white">Trip Summary:</p>
                <p>🙋‍♂️ Customer: {submittedBooking.customerName}</p>
                <p>📍 Route: {submittedBooking.pickup} ➔ {submittedBooking.drop}</p>
                <p>📅 Schedule: {submittedBooking.date} at {submittedBooking.time}</p>
                {submittedBooking.distance && (
                  <p>📏 Distance: {submittedBooking.distance} KM</p>
                )}
                {submittedBooking.estimatedPrice && (
                  <p>💰 Automated Estimate: <span className="text-brand-gold font-semibold">₹{submittedBooking.estimatedPrice}</span></p>
                )}
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] text-white hover:bg-[#20ba5a] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2.5 transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Send Details on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmittedBooking(null);
                    setFormData({
                      customerName: '',
                      phone: '',
                      pickup: '',
                      drop: '',
                      date: '',
                      time: '',
                      passengers: 1,
                      tripType: 'One Way',
                      notes: '',
                      distance: '',
                      estimatedPrice: '',
                    });
                  }}
                  className="w-full border border-white/10 hover:border-brand-gold/30 text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  Make Another Request
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informational sidebar (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">How the booking works</h3>
            
            <div className="space-y-6 text-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-brand-gold/15 text-brand-gold px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Submit Booking</h4>
                  <p className="text-xs text-brand-muted mt-1">Fill out this booking form with pickup, destination, date, and passenger details.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-brand-gold/15 text-brand-gold px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Send WhatsApp (Recommended)</h4>
                  <p className="text-xs text-brand-muted mt-1">Forwarding details to WhatsApp establishes direct contact with the driver for instant responses.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-gold/15 text-brand-gold px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Review & Quote</h4>
                  <p className="text-xs text-brand-muted mt-1">The driver reviews the route, tolls, and duration and sends you a manual price quotation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-gold/15 text-brand-gold px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Advance Payment</h4>
                  <p className="text-xs text-brand-muted mt-1">Access the booking details page using your Ref ID and complete the advance payment via Razorpay to lock the dates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
