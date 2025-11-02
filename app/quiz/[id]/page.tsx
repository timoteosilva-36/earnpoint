"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
  reward_points: number
}

export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await supabase.from("quizzes").select("*").eq("id", quizId).single()

        if (data) {
          setQuiz(data)
        }
      } catch (error) {
        console.error("Error fetching quiz:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <p className="text-red-600 mb-4">Quiz não encontrado</p>
            <Button onClick={() => router.push("/dashboard")}>Voltar ao Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const totalScore = Math.round((score / quiz.questions.length) * 100)
    const pointsEarned = Math.round((totalScore / 100) * quiz.reward_points)

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Quiz Completo!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Acertos:</span>
                <span className="font-bold">
                  {score}/{quiz.questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa:</span>
                <span className="font-bold">{totalScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pontos Ganhos:</span>
                <span className="font-bold text-green-600">+{pointsEarned}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">{quiz.title}</h2>
            <span className="text-sm text-gray-600">
              Pergunta {currentQuestion + 1}/{quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setAnswers([...answers, index])}
                className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                {option}
              </button>
            ))}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Anterior
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (answers[currentQuestion] === question.correct) {
                    setScore(score + 1)
                  }

                  if (currentQuestion === quiz.questions.length - 1) {
                    setShowResults(true)
                  } else {
                    setCurrentQuestion(currentQuestion + 1)
                  }
                }}
                disabled={!answers.hasOwnProperty(currentQuestion)}
              >
                {currentQuestion === quiz.questions.length - 1 ? "Finalizar" : "Próxima"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
