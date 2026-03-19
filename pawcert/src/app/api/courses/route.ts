import { NextRequest, NextResponse } from 'next/server'
import { SAMPLE_COURSES } from '@/lib/data'

// GET /api/courses?pet=dog&level=basic
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pet = searchParams.get('pet')
  const level = searchParams.get('level')

  let courses = SAMPLE_COURSES

  if (pet && pet !== 'all') {
    courses = courses.filter(c => c.petType === pet)
  }
  if (level && level !== 'all') {
    courses = courses.filter(c => c.level === level)
  }

  return NextResponse.json({ courses, total: courses.length })
}
