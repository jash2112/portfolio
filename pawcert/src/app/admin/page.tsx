// Admin / Founder Metrics Dashboard
// Access: /admin (protect with admin role check in production)

import { TrendingUp, Users, Award, DollarSign, BookOpen, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock metrics — wire to DB/analytics in production
const METRICS = {
  overview: [
    { label: 'Total Users', value: '12,481', change: '+18%', up: true, icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Monthly Revenue', value: '$8,430', change: '+23%', up: true, icon: DollarSign, color: 'text-brand-600 bg-brand-100' },
    { label: 'Certs Issued', value: '9,204', change: '+31%', up: true, icon: Award, color: 'text-amber-600 bg-amber-100' },
    { label: 'Course Completions', value: '4,102', change: '-4%', up: false, icon: BookOpen, color: 'text-purple-600 bg-purple-100' },
  ],
  funnel: [
    { stage: 'Visitors', value: 42000, pct: 100 },
    { stage: 'Sign-ups', value: 3200, pct: 7.6 },
    { stage: 'Course Started', value: 2100, pct: 5.0 },
    { stage: 'Course Completed', value: 980, pct: 2.3 },
    { stage: 'Certificate Earned', value: 880, pct: 2.1 },
    { stage: 'Paid Upgrade', value: 310, pct: 0.7 },
  ],
  revenue: [
    { level: 'Basic (Free)', users: 9800, revenue: 0 },
    { level: 'Standard ($29)', users: 1400, revenue: 40600 },
    { level: 'Professional ($79)', users: 780, revenue: 61620 },
    { level: 'Expert ($149)', users: 220, revenue: 32780 },
  ],
  petTypes: [
    { type: '🐕 Dog', pct: 45 },
    { type: '🐈 Cat', pct: 28 },
    { type: '🐦 Bird', pct: 10 },
    { type: '🐇 Rabbit', pct: 8 },
    { type: '🐟 Fish', pct: 5 },
    { type: '🦎 Reptile', pct: 4 },
  ],
  northStar: {
    metric: 'Certified Pet Owners (Monthly)',
    current: 880,
    target: 2000,
    pct: 44,
  },
  healthMetrics: [
    { label: 'DAU / MAU Ratio', value: '18%', status: 'yellow', note: 'Target: 25%' },
    { label: 'Course Completion Rate', value: '46%', status: 'green', note: 'Good (industry avg: 35%)' },
    { label: 'Free → Paid Conversion', value: '9.7%', status: 'green', note: 'Target: 10%' },
    { label: 'NPS Score', value: '62', status: 'green', note: 'Excellent (>50 = great)' },
    { label: 'Churn Rate', value: '3.2%', status: 'green', note: 'Monthly, Target <5%' },
    { label: 'Avg Revenue Per User', value: '$6.74', status: 'yellow', note: 'Target: $12' },
    { label: 'CAC (Customer Acq Cost)', value: '$8.20', status: 'green', note: 'LTV:CAC = 8.2x' },
    { label: 'Quiz Pass Rate', value: '71%', status: 'yellow', note: 'Review hard modules' },
  ],
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Founder Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Product metrics · Updated daily · March 2024</p>
        </div>

        {/* North Star Metric */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl p-6 text-white mb-8">
          <div className="text-brand-200 text-sm font-medium mb-1">North Star Metric</div>
          <div className="text-3xl font-extrabold mb-1">{METRICS.northStar.metric}</div>
          <div className="flex items-center gap-4 mt-3">
            <div>
              <span className="text-4xl font-black">{METRICS.northStar.current}</span>
              <span className="text-brand-200 text-lg ml-2">/ {METRICS.northStar.target} target</span>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-3">
            <div className="bg-accent-400 rounded-full h-3 transition-all" style={{ width: `${METRICS.northStar.pct}%` }} />
          </div>
          <div className="text-brand-200 text-xs mt-2">{METRICS.northStar.pct}% to monthly target</div>
        </div>

        {/* Overview KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {METRICS.overview.map(m => (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', m.color)}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{m.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{m.label}</div>
              <div className={cn('flex items-center gap-1 text-sm font-semibold mt-2', m.up ? 'text-brand-600' : 'text-red-500')}>
                {m.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {m.change} MoM
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Conversion Funnel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Conversion Funnel (Monthly)</h3>
            <div className="space-y-3">
              {METRICS.funnel.map((stage, i) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{stage.stage}</span>
                    <span className="text-gray-500">{stage.value.toLocaleString()} ({stage.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={cn('h-2 rounded-full', i === 0 ? 'bg-blue-400' : i < 3 ? 'bg-brand-400' : 'bg-amber-400')}
                      style={{ width: `${stage.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by level */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Revenue by Certification Level</h3>
            <div className="space-y-4">
              {METRICS.revenue.map(r => (
                <div key={r.level} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{r.level}</div>
                    <div className="text-xs text-gray-400">{r.users.toLocaleString()} users</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{r.revenue === 0 ? '—' : `$${r.revenue.toLocaleString()}`}</div>
                    {r.revenue > 0 && <div className="text-xs text-gray-400">total revenue</div>}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between font-bold">
                <span className="text-gray-900">Total Revenue</span>
                <span className="text-brand-600">$135,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Pet type breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Users by Pet Type</h3>
            <div className="space-y-3">
              {METRICS.petTypes.map(p => (
                <div key={p.type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{p.type}</span>
                    <span className="text-gray-500 font-medium">{p.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-brand-400 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health metrics */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5">Product Health Metrics</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {METRICS.healthMetrics.map(m => (
                <div key={m.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={cn(
                    'w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0',
                    m.status === 'green' ? 'bg-brand-500' :
                    m.status === 'yellow' ? 'bg-amber-400' : 'bg-red-400'
                  )} />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{m.label}</div>
                    <div className="text-lg font-bold text-gray-800">{m.value}</div>
                    <div className="text-xs text-gray-400">{m.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GTM actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-5">Current Sprint — GTM Actions</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'SEO Content', desc: 'Publish 4x breed-specific care guides targeting "how to care for [breed]" keywords. Target: 5k organic visits/mo by month 3.', status: 'in-progress', color: 'brand' },
              { title: 'Shelter Partnerships', desc: 'Email 50 local shelters with free Basic cert offer for new adopters. Target: 5 signed MOUs this quarter.', status: 'pending', color: 'blue' },
              { title: 'Referral Program', desc: 'Launch "Gift a cert" feature. $5 credit for referrer, 20% discount for referee. Target: 15% of signups via referral.', status: 'pending', color: 'purple' },
            ].map(a => (
              <div key={a.title} className={cn(
                'p-4 rounded-xl border-l-4',
                a.color === 'brand' ? 'border-brand-500 bg-brand-50' :
                a.color === 'blue' ? 'border-blue-400 bg-blue-50' : 'border-purple-400 bg-purple-50'
              )}>
                <div className="font-semibold text-gray-900 mb-1">{a.title}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{a.desc}</p>
                <span className={cn(
                  'inline-block mt-3 text-xs font-bold px-2 py-1 rounded-full',
                  a.status === 'in-progress' ? 'bg-brand-200 text-brand-800' : 'bg-gray-200 text-gray-600'
                )}>
                  {a.status === 'in-progress' ? '🟢 In Progress' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
