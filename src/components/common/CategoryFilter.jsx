import React from 'react'

const CATEGORIES = ['All', 'Bodywash', 'FaceWash', 'Facegel', 'Haircare', 'Lipcare', 'Serum', 'SkinCream', 'Soap', 'Sunscreen', 'Scrub']

const CategoryFilter = ({ selected, onSelect, categories = CATEGORIES }) => (
  <div className="flex flex-wrap justify-center gap-2.5 mb-10">
    {categories.map(cat => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
          ${selected === cat
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
            : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'}`}
      >
        {cat}
      </button>
    ))}
  </div>
)

export default CategoryFilter
