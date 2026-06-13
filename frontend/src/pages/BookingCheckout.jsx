import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { CreditCard, Calendar, Clock, MapPin, CheckCircle, AlertCircle, ArrowLeft, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingCheckout = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await bookingsAPI.getById(id);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Booking not found. Please verify the link.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaying(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you offline?");
      setPaying(false);
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      const orderRes = await bookingsAPI.createPaymentOrder(booking.id);
      const orderData = orderRes.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mockKeyId123',
        amount: orderData.amount * 100, // paise
        currency: orderData.currency,
        name: 'Sharavati Travel Link Service',
        description: `Advance Payment for Booking #${booking.id.substring(0, 8)}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          setLoading(true);
          try {
            // 3. Verify Payment on backend
            await bookingsAPI.verifyPayment(booking.id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Payment successful! Booking confirmed.");
            fetchBooking();
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed. Contact driver.");
            setLoading(false);
          }
        },
        prefill: {
          name: booking.customerName,
          contact: booking.phone,
        },
        notes: {
          bookingId: booking.id,
        },
        theme: {
          color: '#F2C10F',
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      // Handle payment failure state
      paymentObject.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to initiate payment");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-brand-dark flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-muted text-xs mt-4">Loading Booking Status...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-24 min-h-screen bg-brand-dark flex flex-col justify-center items-center text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <p className="text-sm text-brand-muted mt-2">The requested booking link is invalid or has expired.</p>
        <Link to="/" className="text-xs text-brand-gold mt-6 hover:underline flex items-center space-x-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Pending Quote</span>;
      case 'QUOTED':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Price Quoted</span>;
      case 'CONFIRMED':
        return <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Confirmed</span>;
      case 'COMPLETED':
        return <span className="bg-gray-500/15 text-gray-400 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-dark max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-xs text-brand-muted hover:text-brand-gold mb-6 flex items-center space-x-1.5 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="glass rounded-2xl overflow-hidden shadow-2xl">
        {/* Status Banner */}
        <div className="bg-brand-charcoal px-8 py-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <span className="text-xs text-brand-muted font-mono uppercase tracking-wider">Booking Reference</span>
            <h2 className="text-lg font-bold font-mono tracking-tight text-white">{booking.id}</h2>
          </div>
          <div>{getStatusBadge(booking.status)}</div>
        </div>

        {/* Booking Details */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gold">Trip details</span>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-brand-muted">Pickup</span>
                    <span className="text-white font-medium">{booking.pickup}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-brand-muted">Destination</span>
                    <span className="text-white font-medium">{booking.drop}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gold">Schedule</span>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-brand-gold" />
                  <div>
                    <span className="block text-xs text-brand-muted">Date</span>
                    <span className="text-white font-medium">{booking.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-brand-gold" />
                  <div>
                    <span className="block text-xs text-brand-muted">Time</span>
                    <span className="text-white font-medium">{booking.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Passenger & Other Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm text-center">
            <div className="bg-brand-charcoal/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] text-brand-muted uppercase font-semibold">Passengers</span>
              <span className="block text-base font-bold text-white mt-1">{booking.passengers}</span>
            </div>
            <div className="bg-brand-charcoal/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] text-brand-muted uppercase font-semibold">Trip Type</span>
              <span className="block text-sm font-bold text-white mt-1.5">{booking.tripType}</span>
            </div>
            <div className="bg-brand-charcoal/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] text-brand-muted uppercase font-semibold">Distance</span>
              <span className="block text-base font-bold text-white mt-1">
                {booking.distance ? `${booking.distance} KM` : 'N/A'}
              </span>
            </div>
            <div className="bg-brand-charcoal/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] text-brand-muted uppercase font-semibold">Auto Estimate</span>
              <span className="block text-base font-bold text-brand-gold mt-1">
                {booking.estimatedPrice ? `₹${booking.estimatedPrice}` : 'N/A'}
              </span>
            </div>
            <div className="bg-brand-charcoal/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] text-brand-muted uppercase font-semibold">Payment Status</span>
              <span className={`block text-xs font-bold mt-2 ${booking.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>
                {booking.paymentStatus}
              </span>
            </div>
            <div className="bg-brand-charcoal/30 border border-white/5 p-4 rounded-xl">
              <span className="block text-[9px] text-brand-muted uppercase font-semibold">Final Quote</span>
              <span className="block text-base font-bold text-brand-gold mt-1">
                {booking.quotedPrice ? `₹${booking.quotedPrice}` : 'TBD'}
              </span>
            </div>
          </div>

          {booking.notes && (
            <div className="bg-brand-charcoal/30 p-4 rounded-xl text-xs space-y-1">
              <span className="block text-brand-gold font-semibold uppercase">Customer Notes:</span>
              <p className="text-brand-muted leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Payment CTA Box */}
          {booking.status === 'QUOTED' && booking.paymentStatus !== 'PAID' && (
            <div className="p-6 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl space-y-4 text-center">
              <h3 className="text-base font-bold text-white">Secure Your Ride</h3>
              <p className="text-xs text-brand-muted max-w-md mx-auto">
                The driver has quoted a price of <span className="text-brand-gold font-bold">₹{booking.quotedPrice}</span>. Complete the advance payment to lock the driver calendar and confirm your ride.
              </p>
              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full sm:w-auto px-10 py-3.5 bg-gradient-gold rounded-full text-sm font-bold flex items-center justify-center space-x-2.5 mx-auto transition-all cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                <span>{paying ? 'Opening Checkout...' : 'Pay Advance'}</span>
              </button>
            </div>
          )}

          {booking.status === 'CONFIRMED' && (
            <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-3 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Booking Confirmed!</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Your payment was received. The driver will contact you closer to the trip date for boarding coordinates. Have a pleasant journey!
              </p>
            </div>
          )}

          {booking.status === 'PENDING' && (
            <div className="p-6 bg-brand-charcoal/40 border border-white/5 rounded-2xl text-center space-y-2">
              <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping mx-auto"></div>
              <h3 className="text-sm font-bold text-white pt-1">Awaiting Quotation</h3>
              <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
                The driver is reviewing tolls, travel times, and vehicle schedules. {booking.estimatedPrice && <span>Your automated fare estimate is <span className="text-brand-gold font-bold">₹{booking.estimatedPrice}</span>. </span>}You will receive a verified quotation here and on WhatsApp/Call shortly. Please keep this page open.
              </p>
              <div className="text-[10px] text-brand-muted border-t border-white/5 pt-2 mt-2 leading-relaxed">
                ⏱️ <strong>Waiting Charges Policy</strong>: ₹2/minute waiting charge applies after 15 mins free grace period, applied by operator if applicable.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
