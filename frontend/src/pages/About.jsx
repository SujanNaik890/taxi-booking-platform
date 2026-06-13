import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Compass, Users, Fuel } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-dark">
      {/* Page Header */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          About <span className="text-gradient-gold">Sharavati Travel Link</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-brand-muted leading-relaxed">
          Get to know your driver, our vehicle standards, and the core commitments that define our premium taxi service.
        </p>
      </section>

      {/* Driver Bio Section */}
      <section className="py-12 border-t border-white/5 bg-brand-charcoal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Meet Your Owner-Driver</h2>
              <h3 className="text-brand-gold font-semibold text-lg">Over 12 Years of Accident-Free Road Experience</h3>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Hi, I'm the owner and driver of Sharavati Travel Link. Unlike large aggregator companies where you get assigned random, unverified drivers, I manage this service personally. Having completed thousands of outstation and city trips across Karnataka, Tamil Nadu, and Kerala, I prioritize safe driving, passenger comfort, and local route expertise.
              </p>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Whether you are a solo traveler needing an early morning airport drop, or a family heading to the hills of Ooty and Coorg, I guarantee a clean vehicle, polite behavior, and professional assistance with your bags.
              </p>
            </div>
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-brand-gold/10 blur-[100px] rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                alt="Driver profile or vehicle dashboard"
                className="rounded-3xl shadow-xl border border-white/10 object-cover w-full max-w-md h-[300px] relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Comfort Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Commitments to You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Uncompromised Safety</h3>
            <p className="text-sm text-brand-muted">
              GPS-enabled tracking, defensive driving behavior, compliance with speed regulations, and standard child safety lock features.
            </p>
          </div>
          <div className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Transparent manually reviewed prices</h3>
            <p className="text-sm text-brand-muted">
              No hidden peak pricing or surprise tolls. We give you a customized quotation upfront after discussing your route details.
            </p>
          </div>
          <div className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Courteous Service</h3>
            <p className="text-sm text-brand-muted">
              Always receive assistance with your luggage, phone chargers inside the vehicle, water bottles, and clean air-conditioning.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Specifications */}
      <section className="py-20 border-t border-white/5 bg-brand-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center relative order-last lg:order-first">
              <div className="absolute inset-0 bg-brand-gold/10 blur-[100px] rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
                alt="Clean premium vehicle interior"
                className="rounded-3xl shadow-xl border border-white/10 object-cover w-full max-w-md h-[300px] relative z-10"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Vehicle Information</h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                We operate a premium **Toyota Innova Crysta** (or equivalent luxury multi-purpose SUV/Sedan) configured to provide the highest cabin comfort:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl flex items-center space-x-3">
                  <Users className="h-5 w-5 text-brand-gold" />
                  <div>
                    <span className="block text-xs text-brand-muted">Capacity</span>
                    <span className="text-sm font-bold text-white">6 + 1 Seats</span>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl flex items-center space-x-3">
                  <Compass className="h-5 w-5 text-brand-gold" />
                  <div>
                    <span className="block text-xs text-brand-muted">Carrier</span>
                    <span className="text-sm font-bold text-white">Roof luggage rack</span>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl flex items-center space-x-3">
                  <Fuel className="h-5 w-5 text-brand-gold" />
                  <div>
                    <span className="block text-xs text-brand-muted">Type</span>
                    <span className="text-sm font-bold text-white">Air Conditioned</span>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl flex items-center space-x-3">
                  <ShieldCheck className="h-5 w-5 text-brand-gold" />
                  <div>
                    <span className="block text-xs text-brand-muted">Maintenance</span>
                    <span className="text-sm font-bold text-white">Sanitized daily</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                *Note: The vehicle is fully commercial-registered, insured, and receives regular diagnostic servicing every 5,000 KM.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
