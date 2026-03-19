import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, Users, Star, CheckCircle2, PlayCircle, Award, ChevronRight } from 'lucide-react'
import { SAMPLE_COURSES, SAMPLE_MODULES } from '@/lib/data'
import { formatDuration, formatPrice, getLevelColor, getPetEmoji, cn } from '@/lib/utils'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return SAMPLE_COURSES.map(c => ({ slug: c.slug }))
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = SAMPLE_COURSES.find(c => c.slug === params.slug)
  if (!course) notFound()

  const modules = course.id === '1' ? SAMPLE_MODULES : []
  const isFree = course.price === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Link href="/courses" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-700">
            <ArrowLeft className="w-4 h-4" /> Back to courses
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="h-52 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center text-8xl mb-6">
              {getPetEmoji(course.petType)}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={cn('badge border text-xs', getLevelColor(course.level))}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
              <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{course.petType}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-3 leading-relaxed">{course.description}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 mt-5 text-sm text-gray-500">
              {course.rating && (
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {course.rating} rating
                </span>
              )}
              {course.students && <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students.toLocaleString()} students</span>}
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDuration(course.duration)}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.modules} modules</span>
            </div>

            {/* What you'll learn */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Essential pet care principles',
                  'Nutrition and feeding schedules',
                  'Health monitoring and warning signs',
                  'Grooming and hygiene basics',
                  'Behavioural understanding',
                  'Emergency first steps',
                  'Creating a safe environment',
                  'Building a relationship with your vet',
                ].slice(0, course.modules! * 1).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-5">Course Curriculum</h2>
              {modules.length > 0 ? (
                <div className="space-y-3">
                  {modules.map(mod => (
                    <details key={mod.id} className="group border border-gray-100 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">
                            {mod.order}
                          </div>
                          <span className="font-medium text-sm text-gray-900">{mod.title}</span>
                        </div>
                        <span className="text-xs text-gray-400">{mod.lessons.length} lessons + quiz</span>
                      </summary>
                      <div className="border-t border-gray-100 divide-y divide-gray-50">
                        {mod.lessons.map(lesson => (
                          <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                            <PlayCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 flex-1">{lesson.title}</span>
                            <span className="text-xs text-gray-400">{lesson.duration}m</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                          <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 flex-1">Module Quiz — {mod.quiz.passMark}% to pass</span>
                          <span className="text-xs text-gray-400">{mod.quiz.questions.length} questions</span>
                        </div>
                      </div>
                    </details>
                  ))}
                  {/* Remaining modules (placeholder) */}
                  {Array.from({ length: Math.max(0, course.modules! - modules.length) }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold">
                          {modules.length + i + 1}
                        </div>
                        <span className="font-medium text-sm text-gray-500">Module {modules.length + i + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">Enroll to unlock</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: course.modules! }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">{i + 1}</div>
                        <span className="font-medium text-sm text-gray-700">Module {i + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">3-4 lessons + quiz</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky CTA card */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-20">
              <div className="text-4xl font-extrabold text-gray-900 mb-1">
                {formatPrice(course.price)}
              </div>
              {!isFree && <p className="text-gray-400 text-sm line-through mb-4">${course.price * 1.5}</p>}

              <Link
                href={`/auth/signup?course=${course.slug}`}
                className="btn-primary w-full text-center py-3.5 text-base mt-3 block"
              >
                {isFree ? 'Start Free Course' : `Enroll — $${course.price}`}
              </Link>

              {!isFree && (
                <p className="text-center text-xs text-gray-400 mt-2">30-day money-back guarantee</p>
              )}

              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                {[
                  `${course.modules} modules`,
                  `${formatDuration(course.duration)} of content`,
                  'Certificate on completion',
                  'Lifetime access',
                  'Mobile + desktop',
                  ...(isFree ? [] : ['PDF printable certificate', 'Vet-reviewed content']),
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Certificate Level</div>
                <span className={cn('badge border text-sm py-1.5 px-3', getLevelColor(course.level))}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)} Certification
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
