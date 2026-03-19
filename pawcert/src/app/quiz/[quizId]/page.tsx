'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Clock } from 'lucide-react'
import { SAMPLE_MODULES } from '@/lib/data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string

  // Find quiz from sample data
  const module = SAMPLE_MODULES.find(m => m.quiz?.id === quizId)
  const quiz = module?.quiz

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  useEffect(() => {
    if (completed) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleFinish(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [completed])

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Quiz not found. <Link href="/courses" className="text-brand-600 ml-2 hover:underline">Back to courses</Link>
      </div>
    )
  }

  const questions = quiz.questions
  const question = questions[current]

  const handleSelect = (idx: number) => {
    if (showFeedback) return
    setSelected(idx)
  }

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)

    if (!showFeedback) {
      setShowFeedback(true)
      return
    }

    setShowFeedback(false)
    setSelected(null)

    if (current + 1 >= questions.length) {
      handleFinish(newAnswers)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handleFinish = (finalAnswers?: number[]) => {
    const ans = finalAnswers ?? answers
    const correct = questions.filter((q, i) => q.correctIndex === ans[i]).length
    const score = Math.round((correct / questions.length) * 100)
    setCompleted(true)
    // In real app: POST /api/quiz/submit
  }

  const score = completed
    ? Math.round((questions.filter((q, i) => q.correctIndex === answers[i]).length / questions.length) * 100)
    : 0
  const passed = score >= quiz.passMark

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // ── Completed screen ──────────────────────────────────────────────────────

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl',
            passed ? 'bg-brand-100' : 'bg-red-100'
          )}>
            {passed ? '🎉' : '😕'}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {passed ? 'You Passed!' : 'Not Quite'}
          </h1>
          <p className="text-gray-500 mt-2">
            {passed
              ? 'Congratulations! You demonstrated excellent knowledge.'
              : `You need ${quiz.passMark}% to pass. Keep practising!`}
          </p>

          {/* Score ring */}
          <div className={cn(
            'mx-auto mt-8 w-36 h-36 rounded-full border-8 flex items-center justify-center flex-col',
            passed ? 'border-brand-500' : 'border-red-400'
          )}>
            <div className={cn('text-4xl font-extrabold', passed ? 'text-brand-600' : 'text-red-500')}>
              {score}%
            </div>
            <div className="text-xs text-gray-400">Your score</div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            {questions.filter((q, i) => q.correctIndex === answers[i]).length} of {questions.length} correct
            {' · '}Pass mark: {quiz.passMark}%
          </div>

          {/* Answer review */}
          <div className="mt-8 text-left bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-4">Review Answers</h3>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex
              return (
                <div key={q.id} className={cn('p-3 rounded-xl text-sm', isCorrect ? 'bg-brand-50' : 'bg-red-50')}>
                  <div className="flex items-start gap-2">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <div className="font-medium text-gray-800">{q.text}</div>
                      {!isCorrect && (
                        <div className="text-red-600 mt-1">Your answer: {q.options[answers[i]]}</div>
                      )}
                      <div className={cn('mt-1', isCorrect ? 'text-brand-700' : 'text-brand-700 font-medium')}>
                        Correct: {q.options[q.correctIndex]}
                      </div>
                      {q.explanation && (
                        <div className="text-gray-500 mt-1 text-xs">{q.explanation}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            {passed ? (
              <Link href="/dashboard" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                View My Certificate
              </Link>
            ) : (
              <button onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setShowFeedback(false); setCompleted(false); setTimeLeft(300) }}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Retry Quiz
              </button>
            )}
            <Link href="/courses" className="btn-secondary w-full py-3.5 text-center">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz in progress ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-gray-500">{module?.title}</div>
            <div className="font-bold text-gray-900">Module Quiz</div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={timeLeft < 60 ? 'text-red-500 font-bold' : 'text-gray-700'}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-4">
            Question {current + 1} of {questions.length}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6 leading-snug">{question.text}</h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let style = 'border-gray-200 hover:border-brand-400 hover:bg-brand-50'
              if (selected === idx && !showFeedback) style = 'border-brand-500 bg-brand-50'
              if (showFeedback) {
                if (idx === question.correctIndex) style = 'border-brand-500 bg-brand-50'
                else if (selected === idx) style = 'border-red-400 bg-red-50'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3',
                    style
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0',
                    selected === idx && !showFeedback ? 'border-brand-500 text-brand-600 bg-white' : 'border-gray-300 text-gray-500'
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && idx === question.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0" />
                  )}
                  {showFeedback && selected === idx && idx !== question.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {showFeedback && question.explanation && (
            <div className="mt-5 bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm text-brand-800">
              <span className="font-semibold">Explanation: </span>{question.explanation}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={selected === null}
            className="btn-primary w-full mt-6 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!showFeedback ? 'Check Answer' : current + 1 < questions.length ? (
              <span className="flex items-center justify-center gap-2">Next Question <ArrowRight className="w-4 h-4" /></span>
            ) : 'Finish Quiz'}
          </button>
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {questions.map((_, i) => (
            <div key={i} className={cn(
              'w-2 h-2 rounded-full transition-all',
              i < current ? 'bg-brand-500' : i === current ? 'bg-brand-600 w-4' : 'bg-gray-200'
            )} />
          ))}
        </div>
      </div>
    </div>
  )
}
