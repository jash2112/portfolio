'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PawPrint, Mail, Lock, User, CheckCircle2 } from 'lucide-react'
import { PET_TYPES } from '@/lib/data'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', petType: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    // POST /api/auth/register
    setTimeout(() => { setLoading(false); window.location.href = '/dashboard' }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-brand-700 mb-6">
            <PawPrint className="w-6 h-6 text-brand-600" />
            PawCert
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start your pet certification journey for free</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${step >= s ? 'bg-brand-500' : 'bg-gray-200'}`} />
              <div className="text-xs text-gray-400 mt-1 text-center">{s === 1 ? 'Account' : 'Your Pet'}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                      placeholder="Min 8 characters"
                      minLength={8}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-3 mt-2">
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">What pet do you have? (pick one to start)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {PET_TYPES.map(pt => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setForm({ ...form, petType: pt.id })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          form.petType === pt.id
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 text-gray-600 hover:border-brand-300'
                        }`}
                      >
                        <span className="text-2xl">{pt.emoji}</span>
                        {pt.label}
                        {form.petType === pt.id && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-50 rounded-xl p-4 text-sm text-brand-700 text-center mt-2">
                  You can add more pet types later and take multiple certifications!
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 mt-2 disabled:opacity-60"
                >
                  {loading ? 'Creating account…' : 'Create Free Account'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700 py-2">
                  ← Back
                </button>
              </>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline">Terms</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>

        <p className="text-center text-sm text-gray-500 mt-3">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
