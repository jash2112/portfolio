import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number) {
  if (price === 0) return 'Free'
  return `$${price}`
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function generateCertNumber() {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 900000) + 100000
  return `PAWCERT-${year}-${rand}`
}

export function getLevelColor(level: string) {
  const colors: Record<string, string> = {
    basic:        'bg-green-100 text-green-800 border-green-200',
    standard:     'bg-blue-100 text-blue-800 border-blue-200',
    professional: 'bg-purple-100 text-purple-800 border-purple-200',
    expert:       'bg-amber-100 text-amber-800 border-amber-200',
  }
  return colors[level] ?? 'bg-gray-100 text-gray-800'
}

export function getPetEmoji(petType: string) {
  const emojis: Record<string, string> = {
    dog: '🐕', cat: '🐈', bird: '🐦', rabbit: '🐇', fish: '🐟', reptile: '🦎', general: '🐾',
  }
  return emojis[petType] ?? '🐾'
}
