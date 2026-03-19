import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/enroll — enroll user in a course
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { courseId } = await req.json()
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 })
  }

  // In production: check course price, handle payment, create enrollment in DB
  // For MVP demo: just return success
  return NextResponse.json({
    success: true,
    enrollment: {
      userId: session.user.id,
      courseId,
      status: 'active',
      progress: 0,
      enrolledAt: new Date().toISOString(),
    },
  })
}
