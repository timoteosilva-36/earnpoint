"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: "Senha deve ter no mínimo 6 caracteres" }
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Senha deve conter pelo menos uma letra minúscula" }
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Senha deve conter pelo menos uma letra maiúscula" }
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "Senha deve conter pelo menos um número" }
    }
    return { valid: true }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || "Senha inválida")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem")
      setIsLoading(false)
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { name: formData.name },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
        })

        if (profileError) throw profileError
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao se cadastrar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Comece a ganhar pontos agora!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Mínimo 6 caracteres, com letras maiúsculas, minúsculas e números
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem conta?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
