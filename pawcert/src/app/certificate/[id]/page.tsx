'use client'

import { useParams } from 'next/navigation'
import { Award, Download, Share2, CheckCircle2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// Mock certificate data — in production fetch from DB by cert number
const DEMO_CERT = {
  certNumber: 'PAWCERT-2024-038291',
  recipientName: 'Sarah K.',
  courseName: 'Dog Care Fundamentals',
  level: 'Basic',
  petType: 'Dog',
  emoji: '🐕',
  issuedDate: '15 March 2024',
  score: 96,
  verifyUrl: 'https://pawcert.com/verify/PAWCERT-2024-038291',
}

export default function CertificatePage() {
  const params = useParams()

  const cert = DEMO_CERT // In prod: fetch by params.id

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">← Back to Dashboard</Link>
          <div className="flex items-center gap-3">
            <button className="btn-ghost text-sm" onClick={() => window.print()}>
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button className="btn-ghost text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="certificate-page bg-white rounded-3xl shadow-xl border-4 border-brand-200 p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5 flex items-center justify-center text-[20rem] pointer-events-none select-none">
            🐾
          </div>

          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-3xl">🐾</div>
            <div className="text-left">
              <div className="font-black text-2xl text-brand-700">PawCert</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">Pet Owner Certification</div>
            </div>
          </div>

          <div className="text-gray-400 text-sm uppercase tracking-widest mb-4">Certificate of Completion</div>

          <h1 className="text-5xl font-black text-gray-900 mb-2">
            {cert.recipientName}
          </h1>

          <p className="text-gray-500 text-lg mb-8">
            has successfully completed
          </p>

          <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-2xl px-8 py-6 mb-8 border border-brand-100">
            <div className="text-5xl mb-3">{cert.emoji}</div>
            <div className="text-2xl font-bold text-gray-900">{cert.courseName}</div>
            <div className="mt-2">
              <span className="inline-block bg-brand-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                {cert.level} Certification
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8 text-center">
            <div>
              <div className="text-2xl font-extrabold text-brand-600">{cert.score}%</div>
              <div className="text-xs text-gray-400 mt-1">Quiz Score</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-700">{cert.issuedDate}</div>
              <div className="text-xs text-gray-400 mt-1">Date Issued</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-700">{cert.petType}</div>
              <div className="text-xs text-gray-400 mt-1">Pet Specialisation</div>
            </div>
          </div>

          {/* Signatures area */}
          <div className="flex items-end justify-between mt-8 pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="font-serif italic text-2xl text-gray-600 mb-1">Dr. Emily Chen</div>
              <div className="text-xs text-gray-400">Chief Veterinary Advisor</div>
              <div className="text-xs text-gray-400">PawCert</div>
            </div>

            <div>
              <Award className="w-20 h-20 text-brand-200 mx-auto" />
            </div>

            <div className="text-center">
              <div className="font-serif italic text-2xl text-gray-600 mb-1">James Park</div>
              <div className="text-xs text-gray-400">Co-founder & CEO</div>
              <div className="text-xs text-gray-400">PawCert</div>
            </div>
          </div>

          {/* Certificate number */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <div className="font-mono text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 inline-block">
              {cert.certNumber}
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 no-print">
          <CheckCircle2 className="w-8 h-8 text-brand-500 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm">This certificate is verified</div>
            <div className="text-xs text-gray-400 mt-0.5">
              Certificate ID: {cert.certNumber} · Issued by PawCert
            </div>
          </div>
          <a href={cert.verifyUrl} target="_blank" rel="noreferrer"
            className="btn-ghost text-sm text-brand-600">
            Verify <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Share to LinkedIn */}
        <div className="mt-4 bg-blue-50 rounded-2xl border border-blue-100 p-5 text-sm text-center no-print">
          <div className="font-semibold text-blue-900 mb-2">Share your achievement!</div>
          <p className="text-blue-600 text-xs mb-3">Let your network know you're a certified pet owner.</p>
          <div className="flex items-center justify-center gap-3">
            <button className="bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Share on LinkedIn
            </button>
            <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Share on X/Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
