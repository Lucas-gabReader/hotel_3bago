"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [role, setRole] = useState<"ADMIN" | "CLIENT">("CLIENT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!nome || !email || !senha) {
      setError("Por favor, preencha todos os campos")
      setLoading(false)
      return
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    const success = await register(nome, email, senha, role)
    
    if (success) {
      router.push("/")
    } else {
      setError("Erro ao criar conta. Tente novamente.")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Criar Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <Input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de conta:
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="CLIENT"
                    checked={role === "CLIENT"}
                    onChange={(e) => setRole(e.target.value as "ADMIN" | "CLIENT")}
                    className="mr-2"
                  />
                  Cliente
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="ADMIN"
                    checked={role === "ADMIN"}
                    onChange={(e) => setRole(e.target.value as "ADMIN" | "CLIENT")}
                    className="mr-2"
                  />
                  Administrador
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-500">
                Faça login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
