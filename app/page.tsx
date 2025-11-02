"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">💰</span>
            </div>
            <div>
              <CardTitle className="text-3xl">EarnPoint</CardTitle>
              <CardDescription>Ganhe reais fazendo tarefas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base text-gray-600">
            Responda quizzes, complete tarefas e converta seus pontos em dinheiro real. Quanto mais ativo, mais você
            ganha!
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+10</div>
              <div className="text-sm text-gray-600">Pontos por Quiz</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">R$ 0,10</div>
              <div className="text-sm text-gray-600">Por Ponto</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">Sem Taxa</div>
              <div className="text-sm text-gray-600">De Saque</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Como funciona:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  1
                </span>
                Crie sua conta com email
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  2
                </span>
                Responda quizzes de várias categorias
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  3
                </span>
                Acumule pontos e saque via PIX
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/auth/login" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up" className="flex-1">
              <Button className="w-full">Começar Agora</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
