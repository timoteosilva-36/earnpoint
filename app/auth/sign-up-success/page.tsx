"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Conta Criada!</CardTitle>
          <CardDescription>Seu cadastro foi feito com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Um email de confirmação foi enviado. Confirme seu email para ativar sua conta e começar a ganhar pontos!
          </p>
          <Link href="/auth/login" className="block">
            <Button className="w-full">Ir para Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
