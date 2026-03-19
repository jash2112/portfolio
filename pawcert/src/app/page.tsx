import Link from 'next/link'
import { ArrowRight, Shield, Award, BookOpen, CheckCircle2, Star, ChevronRight } from 'lucide-react'
import { CourseCard } from '@/components/CourseCard'
import { SAMPLE_COURSES, CERT_LEVELS, TESTIMONIALS, STATS, PET_TYPES } from '@/lib/data'

export default function HomePage() {
  const featuredCourses = SAMPLE_COURSES.slice(0, 3)

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-accent-50 pt-20 pb-28 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Award className="w-4 h-4" />
            Trusted by 12,400+ pet owners worldwide
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
            Become a <span className="text-brand-600">Certified</span>
            <br />Pet Owner
          </h1>

          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Take structured courses designed by vets and pet experts. Pass the quiz, earn your certificate, and give your pet the care they deserve.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/courses" className="btn-secondary text-base px-8 py-4">
              Browse Courses
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            {['No credit card required', 'Free basic certification', 'Vet-approved content'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />{t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating cert preview */}
        <div className="hidden lg:block absolute right-8 top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-64 rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-xl">🐕</div>
            <div>
              <div className="text-xs text-gray-500">Certificate Issued</div>
              <div className="font-bold text-sm text-gray-900">Dog Care — Professional</div>
            </div>
          </div>
          <div className="bg-brand-50 rounded-lg px-3 py-2 text-xs font-mono text-brand-700 text-center">
            PAWCERT-2024-038291
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>Sarah K.</span>
            <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-amber-400" /> 96% score</span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-brand-700 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold">{s.value}</div>
              <div className="text-brand-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PET TYPES ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-heading">Certifications for Every Pet</h2>
          <p className="section-sub mx-auto">
            Whether you have a playful pup or a silent gecko, we have a course tailored to your pet.
          </p>
          <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-4">
            {PET_TYPES.map(pt => (
              <Link
                key={pt.id}
                href={`/courses?pet=${pt.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition-all group"
              >
                <span className="text-4xl">{pt.emoji}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-700">{pt.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-heading">How PawCert Works</h2>
          <p className="section-sub mx-auto">Three simple steps to becoming a certified pet owner.</p>

          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: BookOpen, title: 'Choose a Course', desc: 'Pick your pet type and certification level. Start with a free Basic course or go straight to Professional.' },
              { step: '02', icon: Shield, title: 'Learn & Complete Modules', desc: 'Work through vet-approved lessons at your own pace. Videos, guides, and practical tips included.' },
              { step: '03', icon: Award, title: 'Pass the Quiz & Get Certified', desc: 'Score 70%+ on the module quizzes. Instantly receive your verified digital certificate.' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                <div className="text-brand-200 text-5xl font-black mb-4">{item.step}</div>
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-brand-700" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-heading">Popular Courses</h2>
              <p className="section-sub">Start with our most loved certifications.</p>
            </div>
            <Link href="/courses" className="btn-ghost text-brand-700 font-semibold">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold">Four Levels of Certification</h2>
          <p className="text-brand-200 text-lg mt-3 max-w-xl mx-auto">
            From free basics to expert-level mastery — choose the depth that matches your commitment.
          </p>

          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {CERT_LEVELS.map(level => (
              <div key={level.id} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 text-left hover:bg-white/20 transition-colors">
                {level.badge && (
                  <span className="inline-block bg-accent-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                    {level.badge}
                  </span>
                )}
                <div className="text-2xl font-extrabold">{level.label}</div>
                <div className="text-3xl font-black mt-1">
                  {level.price === 0 ? 'Free' : `$${level.price}`}
                </div>
                <p className="text-brand-200 text-sm mt-3 leading-relaxed">{level.description}</p>
                <ul className="mt-4 space-y-2">
                  {level.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-brand-100">
                      <CheckCircle2 className="w-4 h-4 text-brand-300 flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link href="/pricing" className="inline-block mt-10 btn-secondary border-white text-white hover:bg-white/10">
            View Full Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-heading">Pet Owners Love PawCert</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role} • {t.cert}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-r from-brand-50 to-accent-50 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">🐾</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Ready to Become a Certified Pet Owner?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of responsible pet owners. Start your first course today — it's free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
              Start Free Today <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/courses" className="text-brand-700 font-semibold hover:underline">
              Browse all courses →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
