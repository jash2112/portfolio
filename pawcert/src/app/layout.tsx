import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'PawCert — Pet Owner Certification',
    template: '%s | PawCert',
  },
  description:
    'Get certified as a responsible pet owner. Learn pet care, nutrition, first aid, and more through structured courses and earn an official PawCert certificate.',
  keywords: ['pet certification', 'pet care course', 'dog training', 'cat care', 'pet owner certificate', 'responsible pet owner'],
  openGraph: {
    type: 'website',
    siteName: 'PawCert',
    title: 'PawCert — Pet Owner Certification',
    description: 'Become a certified, confident pet owner.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
