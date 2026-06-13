import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Plane, Briefcase, ChevronRight, HelpCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'City Pickup & Drop',
      icon: MapPin,
      description: 'Point-to-point transfers within city bounds. Ideal for business meetings, wedding functions, doctor appointments, or shopping commutes.',
      inclusions: ['Clean air-conditioned ride', 'Luggage assistance', 'Knowledgeable local routes', 'Flexible waiting time (on request)']
    },
    {
      title: 'Airport Transfers',
      icon: Plane,
      description: 'Punctual pick-ups and drop-offs to Kempegowda International Airport. We track flight patterns to assure on-time arrival.',
      inclusions: ['24/7 flight tracking', 'Airport toll inclusive quote options', 'Early morning pickups guaranteed', 'No surge pricing for late flights']
    },
    {
      title: 'Outstation Trips',
      icon: Car,
      description: 'Breathtaking inter-city road journeys to Ooty, Wayanad, Coorg, Chikmagalur, and other custom holiday spots.',
      inclusions: ['Experienced hill station driver', 'State permits handling', 'Custom multi-day itineraries', 'Flexible stops along scenic spots']
    },
    {
      title: 'Corporate Travel',
      icon: Briefcase,
      description: 'Sophisticated transit for delegates, business executives, and corporate teams. Includes monthly billing options for businesses.',
      inclusions: ['Professional attire and conduct', 'Well-maintained business SUV/Sedan', 'Precise timing and billing receipts', 'Airport meet-and-greet options']
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-brand-dark">
      {/* Header */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Our <span className="text-gradient-gold">Taxi Services</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-brand-muted leading-relaxed">
          Flexible owner-operated transportation solutions tailored to your personal and business travel needs.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-12 border-t border-white/5 bg-brand-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <div key={svc.title} className="glass p-8 rounded-2xl flex flex-col justify-between space-y-8 group hover:border-brand-gold/20 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold group-hover:scale-105 transition-transform duration-300">
                      <svc.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{svc.title}</h3>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">{svc.description}</p>
                  
                  <div className="space-y-2.5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gold">What's Included:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                      {svc.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0"></div>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  to={`/booking?type=${encodeURIComponent(svc.title)}`}
                  className="w-full text-center bg-brand-charcoal hover:bg-brand-gold text-brand-gold hover:text-brand-dark py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 border border-brand-gold/25 transition-all"
                >
                  <span>Request Quote</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / FAQ */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="glass p-6 rounded-xl space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span>How are final rates calculated?</span>
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Rates depend on distance, road tolls, state permits (for out-of-state travel), and whether it's a one-way or round trip. We manually review details and quote you a fixed transparent price upfront.
            </p>
          </div>
          <div className="glass p-6 rounded-xl space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span>Do I need to pay an advance?</span>
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Yes, for outstation trips, an advance payment (usually ₹500 - ₹1,000) helps us block dates and secure permit clearances. The remainder is payable at the end of the trip.
            </p>
          </div>
          <div className="glass p-6 rounded-xl space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span>What if my flight is delayed?</span>
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              For airport transfers, we monitor live flight status. There are no additional waiting charges for delayed landings, and we will adjust your pickup time automatically.
            </p>
          </div>
          <div className="glass p-6 rounded-xl space-y-2">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span>How do I cancel a booking?</span>
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              You can cancel by calling the driver or messaging on WhatsApp. Free cancellation is available up to 12 hours before the scheduled pickup time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
