'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/scan', label: 'Scan', icon: ScanIcon },
  { href: '/groceries', label: 'Groceries', icon: CartIcon },
  { href: '/pantry', label: 'Pantry', icon: PantryIcon },
  { href: '/suggestions', label: 'Tips', icon: SparkleIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-violet-400'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className={`relative ${active ? 'scale-110' : ''} transition-transform`}>
                {active && (
                  <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md scale-150" />
                )}
                <Icon size={22} active={active} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" strokeLinecap="round" />
    </svg>
  );
}

function ScanIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? 'currentColor' : 'none'} fillOpacity={0.3} />
      <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? 'currentColor' : 'none'} fillOpacity={0.3} />
      <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? 'currentColor' : 'none'} fillOpacity={0.3} />
      <circle cx="17.5" cy="17.5" r="2.5" fill={active ? 'currentColor' : 'none'} />
    </svg>
  );
}

function CartIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fillOpacity={active ? 0.25 : 0} />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function PantryIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" fillOpacity={active ? 0.2 : 0} />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function SparkleIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
