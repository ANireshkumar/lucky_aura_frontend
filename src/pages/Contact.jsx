import React, { useState } from 'react'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In production wire this to an email service
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="animate-fade-up">
      <section className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white py-20 text-center px-4">
        <h1 className="font-display text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-emerald-100 max-w-xl mx-auto">We'd love to hear from you — questions, orders, or wholesale inquiries.</p>
      </section>

      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl text-gray-900 mb-6">Contact Info</h2>
            <div className="space-y-5 text-sm text-gray-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📲</span>
                <div>
                  <p className="font-semibold text-gray-700">WhatsApp Orders</p>
                  <a href="https://wa.me/918870199716" className="text-emerald-600 hover:underline">8870199716</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-gray-700">Email</p>
                  <a href="mailto:hello@luckyaura.com" className="text-emerald-600 hover:underline">hello@luckyaura.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-semibold text-gray-700">Instagram</p>
                  <a href="https://www.instagram.com/_luckyaura" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">@_luckyaura</a>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-2">Wholesale / B2B Enquiries</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Interested in bulk orders or white-label products? We offer custom formulations, personalized packaging, and dedicated support.</p>
              <a href="https://wa.me/918870199716" target="_blank" rel="noreferrer" className="inline-block mt-4 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors">
                Enquire on WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-2xl text-gray-900 mb-6">Send a Message</h2>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">✉️</div>
                <h3 className="font-semibold text-emerald-800 mb-1">Message Received!</h3>
                <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-emerald-600 text-sm hover:underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[['name', 'Name', 'text'], ['email', 'Email', 'email']].map(([field, label, type]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type={type} required value={form[field]}
                      onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea rows={5} required value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
