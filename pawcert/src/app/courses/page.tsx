'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { CourseCard } from '@/components/CourseCard'
import { SAMPLE_COURSES, PET_TYPES, CERT_LEVELS } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function CoursesPage() {
  const [petFilter, setPetFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = SAMPLE_COURSES.filter(c => {
    const matchesPet = petFilter === 'all' || c.petType === petFilter
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase())
    return matchesPet && matchesLevel && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
          <p className="text-gray-500 mt-2">Find the right certification for you and your pet.</p>

          {/* Search */}
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center gap-2 font-semibold text-gray-900 mb-5">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </div>

              <div className="mb-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pet Type</div>
                {[{ id: 'all', label: 'All Pets', emoji: '🐾' }, ...PET_TYPES].map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setPetFilter(pt.id)}
                    className={cn(
                      'w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      petFilter === pt.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <span>{pt.emoji}</span> {pt.label}
                  </button>
                ))}
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Level</div>
                {[{ id: 'all', label: 'All Levels' }, ...CERT_LEVELS].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLevelFilter(l.id)}
                    className={cn(
                      'w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors capitalize',
                      levelFilter === l.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Course grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-medium">No courses match your filters.</p>
                <button onClick={() => { setPetFilter('all'); setLevelFilter('all'); setSearch('') }}
                  className="mt-3 text-brand-600 text-sm hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
