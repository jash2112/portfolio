import Link from 'next/link'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'
import { CERT_LEVELS } from '@/lib/data'
import { cn } from '@/lib/utils'

const FAQ = [
  { q: 'Is the Basic certification really free?', a: 'Yes! The Basic level is completely free with no credit card required. You get a verified digital certificate immediately after passing.' },
  { q: 'What happens if I fail a quiz?', a: 'You can retake any quiz as many times as you need. We want you to actually learn, not just pass. There\'s no penalty for retrying.' },
  { q: 'Are the certificates recognised by vets?', a: 'Our certificates are designed as education credentials. Many vet clinics and pet boarding facilities recognise PawCert as a sign of a responsible owner.' },
  { q: 'Can I upgrade my certification level later?', a: 'Absolutely. You can upgrade at any time and the price difference is credited. Your progress carries over.' },
  { q: 'Do certifications expire?', a: 'Basic and Standard do not expire. Professional and Expert certifications are valid for 3 years, after which a short renewal quiz is required.' },
  { q: 'Is there a refund policy?', a: 'Yes — full refund within 30 days if you\'re not satisfied, no questions asked.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-brand-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" /> Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900">Invest in Your Pet's Wellbeing</h1>
          <p className="text-xl text-gray-500 mt-4">
            Start free. Upgrade when you're ready. One-time payment, lifetime access.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-4 py-10">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERT_LEVELS.map((level, i) => {
            const isPopular = level.id === 'standard'
            const isBest = level.id === 'professional'

            return (
              <div key={level.id} className={cn(
                'rounded-2xl border-2 p-6 flex flex-col relative',
                isPopular ? 'border-brand-500 shadow-xl shadow-brand-100' :
                isBest ? 'border-purple-400 shadow-xl shadow-purple-50' :
                'border-gray-200'
              )}>
                {(isPopular || isBest) && (
                  <div className={cn(
                    'absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full',
                    isPopular ? 'bg-brand-600' : 'bg-purple-600'
                  )}>
                    {level.badge}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{level.label}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{level.description}</p>
                </div>

                <div className="my-4">
                  {level.price === 0 ? (
                    <div className="text-4xl font-extrabold text-brand-600">Free</div>
                  ) : (
                    <div>
                      <div className="text-4xl font-extrabold text-gray-900">${level.price}</div>
                      <div className="text-gray-400 text-sm">one-time · lifetime access</div>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {level.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  href={level.price === 0 ? '/auth/signup' : `/checkout?level=${level.id}`}
                  className={cn(
                    'text-center py-3 rounded-xl font-semibold text-sm transition-all',
                    isPopular
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : isBest
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border-2 border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-700'
                  )}
                >
                  {level.price === 0 ? 'Start for Free' : `Get ${level.label}`}
                  <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Full Feature Comparison</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Feature</th>
                  {CERT_LEVELS.map(l => (
                    <th key={l.id} className="px-6 py-4 font-semibold text-center capitalize text-gray-700">{l.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Core pet care lessons', basic: true, standard: true, professional: true, expert: true },
                  { feature: 'Module quizzes', basic: true, standard: true, professional: true, expert: true },
                  { feature: 'Digital certificate', basic: true, standard: true, professional: true, expert: true },
                  { feature: 'Community access', basic: true, standard: true, professional: true, expert: true },
                  { feature: 'Breed-specific content', basic: false, standard: true, professional: true, expert: true },
                  { feature: 'PDF printable certificate', basic: false, standard: true, professional: true, expert: true },
                  { feature: 'Vet Q&A sessions', basic: false, standard: true, professional: true, expert: true },
                  { feature: 'Pet first aid module', basic: false, standard: false, professional: true, expert: true },
                  { feature: 'Behaviour & training', basic: false, standard: false, professional: true, expert: true },
                  { feature: 'Social media badge', basic: false, standard: false, professional: true, expert: true },
                  { feature: 'Multi-pet management', basic: false, standard: false, professional: false, expert: true },
                  { feature: 'Special needs care', basic: false, standard: false, professional: false, expert: true },
                  { feature: 'Lifetime access', basic: true, standard: true, professional: true, expert: true },
                  { feature: 'Expert community', basic: false, standard: false, professional: false, expert: true },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 text-gray-700">{row.feature}</td>
                    {(['basic', 'standard', 'professional', 'expert'] as const).map(level => (
                      <td key={level} className="px-6 py-3 text-center">
                        {row[level]
                          ? <CheckCircle2 className="w-5 h-5 text-brand-500 mx-auto" />
                          : <span className="text-gray-300 text-lg">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details key={i} className="bg-white border border-gray-100 rounded-xl group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:text-brand-700 list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center bg-brand-700">
        <div className="max-w-2xl mx-auto text-white">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-brand-200 mt-3">No credit card needed. Your Basic certification is completely free.</p>
          <Link href="/auth/signup" className="inline-block mt-8 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
            Start Free Today <ArrowRight className="w-5 h-5 inline" />
          </Link>
        </div>
      </section>
    </div>
  )
}
