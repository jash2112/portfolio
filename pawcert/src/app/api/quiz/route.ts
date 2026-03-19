import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SAMPLE_MODULES } from '@/lib/data'
import { generateCertNumber } from '@/lib/utils'

// POST /api/quiz — submit quiz answers, get result + cert if passed
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { quizId, answers } = await req.json()

  const module = SAMPLE_MODULES.find(m => m.quiz?.id === quizId)
  if (!module?.quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  const quiz = module.quiz
  const questions = quiz.questions

  // Score the answers
  const correct = questions.filter((q, i) => q.correctIndex === answers[i]).length
  const score = Math.round((correct / questions.length) * 100)
  const passed = score >= quiz.passMark

  // In production: save QuizAttempt to DB
  // If all modules passed: issue Certificate
  const certNumber = passed ? generateCertNumber() : null

  return NextResponse.json({
    score,
    passed,
    correct,
    total: questions.length,
    passMark: quiz.passMark,
    certNumber,
    feedback: questions.map((q, i) => ({
      questionId: q.id,
      correct: q.correctIndex === answers[i],
      correctAnswer: q.options[q.correctIndex],
      explanation: q.explanation,
    })),
  })
}
