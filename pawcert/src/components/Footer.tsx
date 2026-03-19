import Link from 'next/link'
import { PawPrint } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <PawPrint className="w-5 h-5 text-brand-400" />
            PawCert
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Empowering pet owners with the knowledge and confidence to give their pets the best life.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Courses</h4>
          <ul className="space-y-2 text-sm">
            {['Dog Care', 'Cat Care', 'Bird Care', 'Rabbit Care', 'Pet First Aid', 'Multi-Pet'].map(c => (
              <li key={c}><Link href="/courses" className="hover:text-white transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {[['About', '/about'], ['Blog', '/blog'], ['Pricing', '/pricing'], ['For Shelters', '/shelters'], ['Partner With Us', '/partners']].map(([l, h]) => (
              <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies']].map(([l, h]) => (
              <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} PawCert. All rights reserved. Made with 🐾 for pet lovers.
      </div>
    </footer>
  )
}
