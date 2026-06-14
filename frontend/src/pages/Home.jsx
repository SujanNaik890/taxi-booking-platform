import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Compass, Phone, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { destinationsAPI, reviewsAPI } from '../services/api';

const DEFAULT_DESTINATIONS = [
  {
    id: "ooty",
    name: "Ooty",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=500&q=75",
    description: "Queen of Hill Stations, known for its expansive tea gardens, pleasant climate, and scenic Pykara lakes.",
    distance: 260.0
  },
  {
    id: "guruvayur",
    name: "Guruvayur",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=500&q=75",
    description: "Famous pilgrimage town home to the historic Guruvayur Sri Krishna Temple, a spiritual haven for devotees.",
    distance: 340.0
  },
  {
    id: "mysuru",
    name: "Mysuru",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=500&q=75",
    description: "City of Palaces, rich in royal heritage, featuring the spectacular Mysore Palace, Chamundi Hills, and Brindavan Gardens.",
    distance: 150.0
  },
  {
    id: "coorg",
    name: "Coorg",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=500&q=75",
    description: "The Scotland of India, famous for coffee plantations, mist-covered valleys, Abbey waterfalls, and lush spice estates.",
    distance: 250.0
  }
];

const Home = () => {
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, revRes] = await Promise.all([
          destinationsAPI.getAll(),
          reviewsAPI.getApproved()
        ]);
        if (destRes.data && destRes.data.length > 0) {
          setDestinations(destRes.data.slice(0, 4));
        }
        setReviews(revRes.data);
      } catch (err) {
        console.error("Failed to fetch home page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative overflow-hidden pt-20">
      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-32 flex items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-charcoal via-brand-dark to-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-gold/25">
                <Car className="h-4 w-4" />
                <span>Premium Owner-Operated Taxi</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Your Scenic Ride in <span className="text-gradient-gold">Safe Hands</span>
              </h1>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl">
                Reliable city pickups, swift airport transfers, and breathtaking journeys to Ooty, Coorg, Wayanad, and more. Submit booking details, get custom prices, and travel comfortably.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/booking"
                  className="bg-gradient-gold px-8 py-4 rounded-full text-center text-sm font-bold shadow-lg block"
                >
                  Book Your Journey
                </Link>
                <Link
                  to="/destinations"
                  className="bg-brand-charcoal text-white hover:text-brand-gold border border-white/10 px-8 py-4 rounded-full text-center text-sm font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Explore Destinations</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Premium Taxi Illustration / Image */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-brand-gold/10 blur-[120px] rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                alt="Premium Taxi Service"
                className="rounded-3xl shadow-2xl border border-white/10 object-cover w-full max-w-md h-[300px] sm:h-[400px] relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Features */}
      <section className="py-16 bg-brand-charcoal/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Driver Owned & Operated</h3>
              <p className="text-sm text-brand-muted">
                Direct interaction with the business owner ensures unparalleled accountability, cleanliness, and safety on every single trip.
              </p>
            </div>
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Always On Time</h3>
              <p className="text-sm text-brand-muted">
                Punctuality is our highest commitment. Rest assured we track flight delays and traffic patterns to reach your pick-up spot early.
              </p>
            </div>
            <div className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Custom Outstations</h3>
              <p className="text-sm text-brand-muted">
                Tailored trips to Ooty, Wayanad, Coorg, or custom stops. You dictate the pace; we provide a stress-free travel experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Destinations Preview */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Trending Destinations</h2>
              <p className="text-brand-muted text-sm mt-2">Scenic packages highly requested by our customers.</p>
            </div>
            <Link to="/destinations" className="text-brand-gold hover:text-white flex items-center space-x-1.5 text-sm font-semibold mt-4 sm:mt-0">
              <span>See All Destinations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass h-[320px] rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {destinations.map((dest) => (
                <div key={dest.id} className="group glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-brand-gold font-bold">
                      {dest.distance} KM
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">{dest.name}</h3>
                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">{dest.description}</p>
                    </div>
                    <Link
                      to={`/booking?destination=${encodeURIComponent(dest.name)}`}
                      className="w-full text-center bg-brand-charcoal text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-dark py-2.5 rounded-xl text-xs font-bold transition-all block"
                    >
                      Book This Trip
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Testimonials (Approved Reviews) */}
      <section className="py-20 bg-brand-charcoal/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">What Our Customers Say</h2>
          <p className="text-brand-muted text-sm mb-16">Genuine reviews from travelers who experienced our service.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="glass p-8 rounded-2xl flex flex-col justify-between text-left space-y-6">
                <div className="space-y-4">
                  <div className="flex space-x-1 text-brand-gold">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic leading-relaxed">"{rev.review}"</p>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-sm font-bold text-white">{rev.name}</p>
                  <p className="text-xs text-brand-muted">Verified Customer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="py-20 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-gold/10 via-brand-dark to-brand-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Have a Trip Idea in Mind?</h2>
          <p className="text-brand-muted text-base max-w-2xl mx-auto">
            Get in touch directly with the driver for specialized multi-day excursions or immediate pickups. We offer customized flat prices after discussing details.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:+918670175981"
              className="w-full sm:w-auto bg-brand-charcoal text-white hover:text-brand-gold border border-white/10 px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center space-x-2.5 transition-all"
            >
              <Phone className="h-5 w-5 text-brand-gold" />
              <span>Call +91 86701 75981</span>
            </a>
            <a
              href="https://wa.me/918670175981?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20taxi%20booking."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#20ba5a] px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center space-x-2.5 transition-all"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
