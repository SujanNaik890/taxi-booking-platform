import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight, Check } from 'lucide-react';
import { destinationsAPI } from '../services/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationsAPI.getAll();
        setDestinations(res.data);
      } catch (err) {
        console.error("Failed to fetch destinations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-brand-dark">
      {/* Header */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Popular <span className="text-gradient-gold">Destinations</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-brand-muted leading-relaxed">
          Embark on scenic trips from Bengaluru. Explore distances, review route guides, and secure safe travels with our dedicated driver.
        </p>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 border-t border-white/5 bg-brand-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass h-[400px] rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest) => (
                <div key={dest.id} className="group glass rounded-2xl overflow-hidden hover:scale-[1.01] hover:border-brand-gold/15 transition-all duration-300 flex flex-col justify-between">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 glass px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center space-x-1.5">
                      <Compass className="h-4.5 w-4.5 text-brand-gold" />
                      <span>{dest.distance} KM (One Way)</span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-gold transition-colors">{dest.name}</h3>
                      <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">{dest.description}</p>
                    </div>

                    <Link
                      to={`/booking?destination=${encodeURIComponent(dest.name)}`}
                      className="w-full text-center bg-gradient-gold py-3 rounded-xl text-sm font-bold shadow-md block"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}

              {/* Custom Destination Card */}
              <div className="glass p-8 rounded-2xl border-dashed border-2 border-white/10 hover:border-brand-gold/30 flex flex-col justify-between transition-colors">
                <div className="space-y-6">
                  <div className="bg-brand-gold/10 w-12 h-12 rounded-xl flex items-center justify-center text-brand-gold">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Custom Destinations</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      Need a ride to a different destination? Whether it's a remote village, a beach escape, or a multi-stop heritage tour, we've got you covered.
                    </p>
                  </div>
                  <ul className="text-xs text-brand-muted space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                      <span>Customized sightseeing detours</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                      <span>Flexible drop locations</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/booking?destination=Custom"
                  className="w-full text-center bg-brand-charcoal hover:bg-brand-gold text-brand-gold hover:text-brand-dark py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 border border-brand-gold/25 transition-all mt-8"
                >
                  <span>Request Custom Destination</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;
