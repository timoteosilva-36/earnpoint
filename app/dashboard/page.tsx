"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Profile {
  id: string
  name: string
  email: string
  balance: number
}

interface Quiz {
  id: string
  title: string
  category: string
  description: string
  reward_points: number
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
        }

        const { data: quizzesData } = await supabase.from("quizzes").select("*")
        if (quizzesData) {
          setQuizzes(quizzesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EarnPoint</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {profile?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white">
            <CardContent className="pt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Seu Saldo</p>
                  <p className="text-4xl font-bold">R$ {(profile?.balance || 0).toFixed(2)}</p>
                  <p className="text-blue-100 text-sm mt-2">
                    {profile?.balance ? (profile.balance / 0.1).toFixed(0) : 0} pontos
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/quiz" className="block">
                    <Button size="lg" variant="secondary" className="w-full">
                      Fazer Quiz
                    </Button>
                  </Link>
                  <Link href="/withdraw" className="block">
                    <Button size="lg" variant="secondary" className="w-full">
                      Sacar
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes by Category */}
        <div className="space-y-8">
          {["matemática", "conhecimento", "política"].map((category) => {
            const categoryQuizzes = quizzes.filter((q) => q.category === category)
            if (categoryQuizzes.length === 0) return null

            return (
              <div key={category}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">{category}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryQuizzes.map((quiz) => (
                    <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <CardDescription>{quiz.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Ganhe até</span>
                            <span className="font-bold text-green-600">+{quiz.reward_points} pontos</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
