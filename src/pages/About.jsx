import React from 'react'
import { Link } from 'react-router-dom'

const About = () => (
  <div className="animate-fade-up">
    <section className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white py-24 text-center px-4">
      <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">Our Story</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold mb-5">About <span className="text-yellow-300 italic">Lucky Aura</span></h1>
      <p className="text-emerald-100 max-w-2xl mx-auto text-lg">A journey towards pure, organic, and nature-powered beauty.</p>
    </section>

    <section className="py-20 bg-white px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl text-gray-900 mb-6">Our Story</h2>
        <p className="text-gray-500 text-lg leading-relaxed mb-6">
          Lucky Aura was born from a simple belief — nature has the power to heal, nourish, and enhance our natural beauty. In a world filled with chemical-heavy products, we wanted to create a safer, more natural alternative for everyday skincare and haircare.
        </p>
        <p className="text-gray-500 text-lg leading-relaxed">
          Our formulations are inspired by traditional Ayurvedic wisdom and combined with modern techniques to deliver products that are gentle, effective, and suitable for all skin and hair types.
        </p>
      </div>
    </section>

    <section className="py-20 bg-emerald-50 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl text-gray-900 text-center mb-14">Our Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🌿', title: 'Nature First', desc: 'We carefully select botanical ingredients, herbs, and essential oils that work in harmony with your skin and hair.' },
            { icon: '🧴', title: 'Safe & Gentle', desc: 'Our products are free from parabens, sulphates, and harsh chemicals, making them safe for daily use by everyone.' },
            { icon: '✨', title: 'Visible Results', desc: 'Consistent use helps restore glow, strength, and natural balance — you will see and feel the difference.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-sm">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-white px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl text-gray-900 mb-8">What Makes Lucky Aura Different?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Made with natural and herbal ingredients', 'Cruelty-free and ethically sourced', 'Suitable for all skin and hair types', 'Inspired by Ayurvedic and herbal traditions', 'Carefully crafted for visible and long-lasting results', 'Free from SLS, Parabens, and harsh chemicals'].map(item => (
            <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gray-900 text-white py-20 text-center px-4">
      <h2 className="font-display text-3xl mb-5">Our Promise to You</h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
        At Lucky Aura, we promise to deliver products that are safe, effective, and rooted in nature. Your skin and hair deserve the best — we're committed to honest formulations you can trust every day.
      </p>
      <Link to="/products" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-10 py-4 rounded-full transition-colors">
        Explore Products
      </Link>
    </section>
  </div>
)

export default About
