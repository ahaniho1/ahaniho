'use client';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setForm(prev => ({
        ...prev,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email || '',
      }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', padding: '64px 0 48px', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 text-lg">Have questions or feedback? We would love to hear from you.</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            
            {/* Form */}
            <div style={{ flex: '1 1 400px' }}>
              {sent && (
                <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl mb-6 text-sm font-semibold text-center border border-green-200">
                  Message sent successfully! We will get back to you soon.
                </div>
              )}
              <div className="card" style={{ padding: '36px' }}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Jean Paul" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input" placeholder="What is this about?" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="textarea" placeholder="Your message..." />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Send Message</button>
                </form>
              </div>
            </div>

            {/* Info + Map */}
            <div style={{ flex: '1 1 350px' }}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="card text-center" style={{ padding: '24px' }}>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <h3 className="font-bold text-sm">Email</h3>
                  <p className="text-gray-500 text-sm mt-1">ahaniho1@gmail.com</p>
                </div>
                <div className="card text-center" style={{ padding: '24px' }}>
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <h3 className="font-bold text-sm">Phone</h3>
                  <a href="https://wa.me/250722938763" target="_blank" rel="noopener" className="text-green-600 text-sm mt-1 hover:underline">Chat with us on WhatsApp</a>
                </div>
              </div>

              {/* Map */}
              <div className="card" style={{ padding: '8px', overflow: 'hidden', borderRadius: '16px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.497663893456!2d30.061785!3d-1.944073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4256f4b7e7b%3A0x9a3b2c5d6e8f1a0b!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1690000000000"
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aha Secret Max Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}