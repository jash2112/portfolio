'use client'

import Link from 'next/link'
import { Award, BookOpen, Clock, TrendingUp, Star, ChevronRight, PlayCircle, CheckCircle2 } from 'lucide-react'
import { SAMPLE_COURSES, SAMPLE_MODULES } from '@/lib/data'
import { getLevelColor, getPetEmoji, formatDuration, cn } from '@/lib/utils'

// Mock user data — in production comes from session + DB
const MOCK_USER = {
  name: 'Sarah',
  email: 'sarah@example.com',
  avatar: 'SK',
}

const MOCK_ENROLLMENTS = [
  { courseId: '1', progress: 40, status: 'active' },
  { courseId: '4', progress: 100, status: 'completed' },
]

const MOCK_CERTS = [
  { id: 'PAWCERT-2024-038291', courseName: 'Bird Owner Basics', level: 'basic', petType: 'bird', issuedAt: '15 March 2024', score: 88 },
]

export default function DashboardPage() {
  const enrolledCourses = MOCK_ENROLLMENTS.map(e => ({
    ...e,
    course: SAMPLE_COURSES.find(c => c.id === e.courseId)!,
  })).filter(e => e.course)

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: BookOpen, color: 'text-brand-600 bg-brand-100' },
    { label: 'Certificates Earned', value: MOCK_CERTS.length, icon: Award, color: 'text-amber-600 bg-amber-100' },
    { label: 'Hours Learned', value: '3.2h', icon: Clock, color: 'text-blue-600 bg-blue-100' },
    { label: 'Avg Quiz Score', value: '88%', icon: TrendingUp, color: 'text-purple-600 bg-purple-100' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {MOCK_USER.name} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Continue your certification journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/courses" className="btn-primary text-sm">
              <BookOpen className="w-4 h-4" /> Browse Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-900">My Courses</h2>
              <Link href="/courses" className="text-sm text-brand-600 hover:underline">Browse more →</Link>
            </div>

            <div className="space-y-4">
              {enrolledCourses.map(({ course, progress, status }) => (
                <div key={course.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {getPetEmoji(course.petType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
                        {status === 'completed' && (
                          <span className="badge bg-brand-100 text-brand-700 text-xs flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                      <span className={cn('badge border text-xs', getLevelColor(course.level))}>
                        {course.level}
                      </span>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                          <span>Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    {status === 'completed' ? (
                      <Link href={`/certificate/${course.slug}`} className="btn-primary text-xs py-2 px-4">
                        <Award className="w-3.5 h-3.5" /> View Certificate
                      </Link>
                    ) : (
                      <Link href={`/courses/${course.slug}`} className="btn-primary text-xs py-2 px-4">
                        <PlayCircle className="w-3.5 h-3.5" /> Continue
                      </Link>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{formatDuration(course.duration)}
                    </span>
                  </div>
                </div>
              ))}

              {enrolledCourses.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-gray-500 text-sm mb-4">You haven't enrolled in any courses yet.</p>
                  <Link href="/courses" className="btn-primary text-sm">Browse Courses</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Certificates */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">My Certificates</h3>
                <Award className="w-5 h-5 text-amber-500" />
              </div>

              {MOCK_CERTS.length > 0 ? (
                <div className="space-y-3">
                  {MOCK_CERTS.map(cert => (
                    <Link key={cert.id} href={`/certificate/${cert.id}`}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-brand-50 rounded-xl border border-amber-100 hover:shadow-sm transition-shadow">
                      <div className="text-2xl">{getPetEmoji(cert.petType)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">{cert.courseName}</div>
                        <div className="text-xs text-gray-400">{cert.issuedAt} · {cert.score}% score</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Complete a course to earn your first certificate.</p>
                </div>
              )}
            </div>

            {/* Recommended next */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Recommended Next</h3>
              <div className="space-y-3">
                {SAMPLE_COURSES.slice(1, 3).map(course => (
                  <Link key={course.id} href={`/courses/${course.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="text-2xl">{getPetEmoji(course.petType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{course.title}</div>
                      <div className="text-xs text-gray-400 capitalize">{course.level} · {course.price === 0 ? 'Free' : `$${course.price}`}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick tip */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-bold text-sm mb-1">Pet Care Tip of the Day</h3>
              <p className="text-brand-100 text-xs leading-relaxed">
                Dogs should eat 2-3% of their body weight daily. Always provide fresh water and avoid feeding 30 minutes before or after exercise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
