"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

type Hotel = {
    id: number
    nome: string
}
  
type Quarto = {
    id: number
    numero: string
    tipo: string
    hotelId: number
    hotelNome?: string
    preco?: number
    createdAt: string
}
  
export default function QuartosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [quartos, setQuartos] = useState<Quarto[]>([])

    const [numero, setNumero] = useState("")
    const [tipo, setTipo] = useState("")
    const [hotelId, setHotelId] = useState<number | null>(null)

    // Permanecer o hotelId selecionado no localStorage para manter a seleção na revisita da página
    useEffect(() => {
      const savedHotelId = localStorage.getItem("selectedHotelId");
      if (savedHotelId) {
        setHotelId(Number(savedHotelId));
      }
    }, []);

    useEffect(() => {
      if (hotelId !== null) {
        localStorage.setItem("selectedHotelId", hotelId.toString());
      }
    }, [hotelId]);
    const [preco, setPreco] = useState<number | null>(null) 

    const [editId, setEditId] = useState<number | null>(null)
    const [editNumero, setEditNumero] = useState("")
    const [editTipo, setEditTipo] = useState("")
    const [editHotelId, setEditHotelId] = useState<number | null>(null)

    // carregar hotéis e quartos
    useEffect(() => {
      if (!loading) {
        if (!user || user.role !== "ADMIN") {
          router.push("/")
          return
        }
        fetch("/api/hotels").then(res => res.json()).then(setHotels)
        fetch("/api/quartos")
          .then(res => res.json())
          .then(data => {
            const mappedQuartos = data.map((q: any) => ({
              id: q.id,
              numero: q.numero,
              tipo: q.tipo,
              hotelId: q.hotelId,
              hotelNome: q.hotel?.nome,
              preco: q.preco,
              createdAt: q.createdAt
            }))
            setQuartos(mappedQuartos)
          })
      }
    }, [user, loading, router])

    async function handleAddQuarto() {
      if (!numero || !tipo || !hotelId) return alert("Preencha todos os campos!")

      const res = await fetch("/api/quartos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero, tipo, hotelId, preco: preco || 0 }),
      })

      if (res.ok) {
        const novo = await res.json()
        setQuartos([...quartos, { ...novo, hotelNome: hotels.find(h => h.id === hotelId)?.nome, preco: novo.preco }])
        setNumero(""); setTipo(""); setHotelId(null); setPreco(null)
      } else {
        alert("Erro ao adicionar quarto.")
      }
    }

    async function handleUpdateQuarto(id: number) {
      if (!editNumero || !editTipo || !editHotelId) return alert("Preencha todos os campos!")
      const res = await fetch(`/api/quartos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: editNumero, tipo: editTipo, hotelId: editHotelId }),
      })
      if (res.ok) {
        setQuartos(quartos.map(q => q.id === id ? { ...q, numero: editNumero, tipo: editTipo, hotelId: editHotelId, hotelNome: hotels.find(h => h.id === editHotelId)?.nome } : q))
        setEditId(null)
      }
    }

    async function handleDeleteQuarto(id: number) {
      if (!confirm("Deseja realmente excluir este quarto?")) return
      const res = await fetch(`/api/quartos/${id}`, { method: "DELETE" })
      if (res.ok) {
        setQuartos(quartos.filter(q => q.id !== id))
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Erro ao excluir quarto")
      }
    }

    if (loading) {
      return (
        <div className="p-6">
          <p>Carregando...</p>
        </div>
      )
    }

    if (!user || user.role !== "ADMIN") {
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Negado</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Você precisa ser um administrador para acessar esta página.</p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="p-6 space-y-6">
        <Card className="max-w-md">
          <CardHeader><CardTitle>Adicionar Quarto</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Número do quarto" value={numero} onChange={e => setNumero(e.target.value)} />
            <Input placeholder="Tipo (ex: Simples, Luxo)" value={tipo} onChange={e => setTipo(e.target.value)} />
            <Select onValueChange={val => setHotelId(Number(val))} value={hotelId?.toString() || ""}>
              <SelectTrigger><SelectValue placeholder="Escolha o hotel" /></SelectTrigger>
              <SelectContent>
                {hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.nome}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Preço" type="number" value={preco || ''} onChange={e => setPreco(Number(e.target.value))} />
            <Button onClick={handleAddQuarto}>Adicionar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quartos Cadastrados</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ID</th>
                <th className="border-b p-2">Número</th>
                <th className="border-b p-2">Tipo</th>
                <th className="border-b p-2">Hotel</th>
                <th className="border-b p-2">Preço</th>
                <th className="border-b p-2">Criado em</th>
                <th className="border-b p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {quartos.map(q => (
                <tr key={q.id} className="hover:bg-gray-100">
                  <td className="border-b p-2">{q.id}</td>
                  <td className="border-b p-2">{editId === q.id ? <Input value={editNumero} onChange={e => setEditNumero(e.target.value)} /> : q.numero}</td>
                  <td className="border-b p-2">{editId === q.id ? <Input value={editTipo} onChange={e => setEditTipo(e.target.value)} /> : q.tipo}</td>
                  <td className="border-b p-2">
                    {editId === q.id ?
                      <Select onValueChange={val => setEditHotelId(Number(val))} value={editHotelId?.toString() || ""}>
                        <SelectTrigger><SelectValue placeholder="Escolha o hotel" /></SelectTrigger>
                        <SelectContent>
                          {hotels.map(h => <SelectItem key={h.id} value={h.id.toString()}>{h.nome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      : q.hotelNome
                    }
                  </td>
                  <td className="border-b p-2">{q.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0,00"}</td>
                  <td className="border-b p-2">{new Date(q.createdAt).toLocaleDateString("pt-BR") || "Data Inválida"}</td>
                  <td className="border-b p-2 space-x-2">
                    {editId === q.id ?
                      <Button onClick={() => handleUpdateQuarto(q.id)}>Salvar</Button>
                      : <Button onClick={() => {setEditId(q.id); setEditNumero(q.numero); setEditTipo(q.tipo); setEditHotelId(q.hotelId)}}>Editar</Button>
                    }
                    <Button onClick={() => handleDeleteQuarto(q.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }
