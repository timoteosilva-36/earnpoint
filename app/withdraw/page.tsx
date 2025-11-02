"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Profile {
  id: string
  name: string
  email: string
  balance: number
  pix_key?: string
}

export default function WithdrawPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [pixKey, setPixKey] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (data) {
          setProfile(data)
          if (data.pix_key) {
            setPixKey(data.pix_key)
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [router, supabase])

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const withdrawAmount = Number.parseFloat(amount)

      if (!withdrawAmount || withdrawAmount <= 0) {
        throw new Error("Digite um valor válido")
      }

      if (withdrawAmount > (profile?.balance || 0)) {
        throw new Error("Saldo insuficiente")
      }

      if (!pixKey) {
        throw new Error("Digite uma chave PIX")
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Não autenticado")

      // Create withdrawal request
      await supabase.from("withdrawal_requests").insert({
        user_id: user.id,
        amount: withdrawAmount,
        pix_key: pixKey,
      })

      // Update user balance
      const newBalance = (profile?.balance || 0) - withdrawAmount
      await supabase.from("profiles").update({ balance: newBalance, pix_key: pixKey }).eq("id", user.id)

      setSuccess(true)
      setAmount("")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar saque")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Saque Solicitado!</h2>
            <p className="text-gray-600 mb-4">Sua solicitação foi recebida. Você receberá o valor em breve via PIX.</p>
            <p className="text-sm text-gray-500">Redirecionando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4">
          ← Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Saque</CardTitle>
            <CardDescription>Converta seus pontos em dinheiro real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Como funciona:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cada ponto vale R$ 0,10</li>
                <li>• Valor mínimo de saque: R$ 10,00</li>
                <li>• Não há taxa de saque</li>
                <li>• O dinheiro chega via PIX em até 24 horas</li>
              </ul>
            </div>

            {/* Balance */}
            {profile && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Saldo Disponível</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {profile.balance.toFixed(2)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pontos</p>
                  <p className="text-2xl font-bold text-gray-900">{(profile.balance / 0.1).toFixed(0)}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pix">Chave PIX (CPF, Email, Telefone ou Aleatória)</Label>
                <Input
                  id="pix"
                  type="text"
                  placeholder="Sua chave PIX"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor para Sacar (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="10"
                  placeholder="Mínimo: R$ 10,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {amount && (
                  <p className="text-xs text-gray-600">= {(Number.parseFloat(amount) / 0.1).toFixed(0)} pontos</p>
                )}
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading || !profile || profile.balance < 10}>
                {isLoading ? "Processando..." : "Solicitar Saque"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
