"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Hotel = {
  id: number
  nome: string
  endereco: string
  createdAt: string
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [nome, setNome] = useState("")
  const [endereco, setEndereco] = useState("")
  const [editId, setEditId] = useState<number | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editEndereco, setEditEndereco] = useState("")

  useEffect(() => {
    fetch("/api/hotels").then(res => res.json()).then(setHotels)
  }, [])

  async function handleAddHotel() {
    if (!nome || !endereco) return alert("Preencha todos os campos!")
    const res = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, endereco }),
    })
    if (res.ok) {
      const novo = await res.json()
      setHotels([...hotels, novo])
      setNome(""); setEndereco("")
    }
  }

  async function handleUpdateHotel(id: number) {
    const res = await fetch(`/api/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: editNome, endereco: editEndereco }),
    })
    if (res.ok) {
      setHotels(hotels.map(h => h.id === id ? { ...h, nome: editNome, endereco: editEndereco } : h))
      setEditId(null)
    }
  }

  async function handleDeleteHotel(id: number) {
    if (!confirm("Deseja realmente excluir este hotel?")) return
    const res = await fetch(`/api/hotels/${id}`, { method: "DELETE" })
    if (res.ok) {
      setHotels(hotels.filter(h => h.id !== id))
    } else {
      const errorData = await res.json()
      alert(errorData.error || "Erro ao excluir hotel")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="max-w-md">
        <CardHeader><CardTitle>Adicionar Hotel</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Nome do hotel" value={nome} onChange={e => setNome(e.target.value)} />
          <Input placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />
          <Button onClick={handleAddHotel}>Adicionar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Hotéis Cadastrados</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ID</th>
                <th className="border-b p-2">Nome</th>
                <th className="border-b p-2">Endereço</th>
                <th className="border-b p-2">Criado em</th>
                <th className="border-b p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map(h => (
                <tr key={h.id} className="hover:bg-gray-100">
                  <td className="border-b p-2">{h.id}</td>
                  <td className="border-b p-2">
                    {editId === h.id ? 
                      <Input value={editNome} onChange={e => setEditNome(e.target.value)} /> 
                      : h.nome
                    }
                  </td>
                  <td className="border-b p-2">
                    {editId === h.id ? 
                      <Input value={editEndereco} onChange={e => setEditEndereco(e.target.value)} /> 
                      : h.endereco
                    }
                  </td>
                  <td className="border-b p-2">{new Date(h.createdAt).toLocaleDateString()}</td>
                  <td className="border-b p-2 space-x-2">
                    {editId === h.id ? 
                      <Button onClick={() => handleUpdateHotel(h.id)}>Salvar</Button> 
                      : <Button onClick={() => {setEditId(h.id); setEditNome(h.nome); setEditEndereco(h.endereco)}}>Editar</Button>
                    }
                    <Button onClick={() => handleDeleteHotel(h.id)}>Excluir</Button>
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