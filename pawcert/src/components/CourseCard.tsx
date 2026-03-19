import Link from 'next/link'
import { Clock, Users, BookOpen, Star } from 'lucide-react'
import { formatPrice, formatDuration, getLevelColor, getPetEmoji, cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    slug: string
    title: string
    description: string
    petType: string
    level: string
    price: number
    duration: number
    rating?: number
    students?: number
    modules?: number
  }
  className?: string
}

export function CourseCard({ course, className }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className={cn('card group block', className)}>
      {/* Header with pet emoji */}
      <div className="h-36 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-6xl">
        {getPetEmoji(course.petType)}
      </div>

      <div className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('badge border text-xs', getLevelColor(course.level))}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
          <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">
            {course.petType}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-brand-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1.5 line-clamp-2">{course.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(course.duration)}</span>
          {course.modules && <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.modules} modules</span>}
          {course.students && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students.toLocaleString()}</span>}
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {course.rating && (
            <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {course.rating}
            </span>
          )}
          <span className={cn(
            'font-bold text-lg ml-auto',
            course.price === 0 ? 'text-brand-600' : 'text-gray-900'
          )}>
            {formatPrice(course.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
