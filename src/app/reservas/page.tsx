"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input"

type Quarto = {
  id: number
  numero: string
  hotelNome?: string
}

type Reserva = {
  id: number
  nomeHospede: string
  quartoId: number
  quartoNumero?: string
  createdAt: string
}

export default function ReservasPage() {
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])

  const [nomeHospede, setNomeHospede] = useState("")
  const [quartoId, setQuartoId] = useState<number | null>(null)

  const [editId, setEditId] = useState<number | null>(null)
  const [editNomeHospede, setEditNomeHospede] = useState("")
  const [editQuartoId, setEditQuartoId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/quartos").then(res => res.json()).then(setQuartos)
    fetch("/api/reservas").then(res => res.json()).then(setReservas)
  }, [])

  async function handleAddReserva() {
    if (!nomeHospede || !quartoId) return alert("Preencha todos os campos!")
    const res = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeHospede, quartoId }),
    })
    if (res.ok) {
      const novo = await res.json()
      setReservas([...reservas, { ...novo, quartoNumero: quartos.find(q => q.id === quartoId)?.numero }])
      setNomeHospede(""); setQuartoId(null)
    } else alert("Erro ao adicionar reserva.")
  }

  async function handleUpdateReserva(id: number) {
    if (!editNomeHospede || !editQuartoId) return alert("Preencha todos os campos!")
    const res = await fetch(`/api/reservas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeHospede: editNomeHospede, quartoId: editQuartoId }),
    })
    if (res.ok) {
      setReservas(reservas.map(r => r.id === id ? { ...r, nomeHospede: editNomeHospede, quartoId: editQuartoId, quartoNumero: quartos.find(q => q.id === editQuartoId)?.numero } : r))
      setEditId(null)
    }
  }

  async function handleDeleteReserva(id: number) {
    if (!confirm("Deseja realmente excluir esta reserva?")) return
    const res = await fetch(`/api/reservas/${id}`, { method: "DELETE" })
    if (res.ok) setReservas(reservas.filter(r => r.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="max-w-md">
        <CardHeader><CardTitle>Adicionar Reserva</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Nome do hóspede" value={nomeHospede} onChange={e => setNomeHospede(e.target.value)} />
          <Select onValueChange={val => setQuartoId(Number(val))} value={quartoId?.toString() || ""}>
            <SelectTrigger><SelectValue placeholder="Escolha o quarto" /></SelectTrigger>
            <SelectContent>
              {quartos.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.numero} - {q.hotelNome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleAddReserva}>Adicionar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Reservas Cadastradas</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ID</th>
                <th className="border-b p-2">Hóspede</th>
                <th className="border-b p-2">Quarto</th>
                <th className="border-b p-2">Criado em</th>
                <th className="border-b p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.id} className="hover:bg-gray-100">
                  <td className="border-b p-2">{r.id}</td>
                  <td className="border-b p-2">{editId === r.id ? <Input value={editNomeHospede} onChange={e => setEditNomeHospede(e.target.value)} /> : r.nomeHospede}</td>
                  <td className="border-b p-2">
                    {editId === r.id ?
                      <Select onValueChange={val => setEditQuartoId(Number(val))} value={editQuartoId?.toString() || ""}>
                        <SelectTrigger><SelectValue placeholder="Escolha o quarto" /></SelectTrigger>
                        <SelectContent>
                          {quartos.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.numero} - {q.hotelNome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      : r.quartoNumero
                    }
                  </td>
                  <td className="border-b p-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="border-b p-2 space-x-2">
                    {editId === r.id ?
                      <Button onClick={() => handleUpdateReserva(r.id)}>Salvar</Button>
                      : <Button onClick={() => {setEditId(r.id); setEditNomeHospede(r.nomeHospede); setEditQuartoId(r.quartoId)}}>Editar</Button>
                    }
                    <Button onClick={() => handleDeleteReserva(r.id)}>Excluir</Button>
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