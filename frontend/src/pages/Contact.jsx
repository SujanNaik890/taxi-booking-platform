import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate API contact submission
    setTimeout(() => {
      toast.success("Thank you for your message! We will get back to you shortly.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1200);
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-dark">
      {/* Header */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Contact <span className="text-gradient-gold">Our Driver</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-brand-muted leading-relaxed">
          Need immediate ride assistance or custom multi-day tourist itineraries? Get in touch directly with the operator.
        </p>
      </section>

      {/* Grid: Details & Form */}
      <section className="py-12 border-t border-white/5 bg-brand-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details (Cols 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-8 rounded-2xl space-y-8">
              <h3 className="text-lg font-bold text-white">Direct Contacts</h3>

              <div className="space-y-6">
                <a href="tel:+918670175981" className="flex items-start space-x-4 group">
                  <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-brand-muted">Phone (Call)</span>
                    <span className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors">+91 86701 75981</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/918670175981?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20a%20taxi."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start space-x-4 group"
                >
                  <div className="bg-green-500/10 p-3 rounded-xl text-green-400 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-brand-muted">WhatsApp</span>
                    <span className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">+91 86701 75981</span>
                  </div>
                </a>

                <a href="mailto:bookings@sharavatitravellink.com" className="flex items-start space-x-4 group">
                  <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-brand-muted">Email</span>
                    <span className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors">bookings@sharavatitravellink.com</span>
                  </div>
                </a>

                <div className="flex items-start space-x-4">
                  <div className="bg-brand-gold/10 p-3 rounded-xl text-brand-gold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-brand-muted">Operating Base</span>
                    <span className="text-sm font-semibold text-white">Bengaluru, Karnataka, India</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Map Panel */}
            <div className="glass rounded-2xl overflow-hidden h-64 relative border border-white/5">
              <iframe
                title="Bengaluru Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d248849.8865392652!2d77.49085208639596!3d12.95384772877995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e897e0f760!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-none filter invert grayscale contrast-125 opacity-70"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form (Cols 7) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-white">Send a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g., Snena"
                    className="w-full bg-brand-charcoal/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E.g., name@domain.com"
                    className="w-full bg-brand-charcoal/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="E.g., Outstation tour quote request"
                  className="w-full bg-brand-charcoal/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-gold uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Detail your inquiry here..."
                  className="w-full bg-brand-charcoal/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-white resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-gold py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{sending ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
