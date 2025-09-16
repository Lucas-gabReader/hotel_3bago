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
  email?: string
  quartoId: number
  quartoNumero?: string
  createdAt: string
  stayDuration?: number
}

export default function ReservasPage() {
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])

  const [nomeHospede, setNomeHospede] = useState("")
  const [email, setEmail] = useState("")
  const [quartoId, setQuartoId] = useState<number | null>(null)
  const [dataInicio, setDataInicio] = useState<string>("")
  const [dataFim, setDataFim] = useState<string>("")

  const [editId, setEditId] = useState<number | null>(null)
  const [editNomeHospede, setEditNomeHospede] = useState("")
  const [editEmail, setEditEmail] = useState("")

  const [editQuartoId, setEditQuartoId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/quartos").then(res => res.json()).then(setQuartos)
    fetch("/api/reservas")
      .then(res => res.json())
      .then(data => {
        
        const mappedReservas = data.map((r: any) => ({
          id: r.id,
          nomeHospede: r.cliente, 
          email: r.email,
          quartoId: r.quartoId,
          quartoNumero: r.quarto?.numero, 
          createdAt: r.createdAt,
          stayDuration: r.stayDuration
        }))
        setReservas(mappedReservas)
      })
  }, [])

  
  useEffect(() => {
    if (editId !== null) {
      const reserva = reservas.find(r => r.id === editId)
      if (reserva) {
        setEditNomeHospede(reserva.nomeHospede)
        setEditEmail(reserva.email || "")
        setEditQuartoId(reserva.quartoId)
      }
    } else {
      setEditNomeHospede("")
      setEditEmail("")
      setEditQuartoId(null)
    }
  }, [editId, reservas])

async function handleAddReserva() {
  if (!nomeHospede || !quartoId || !dataInicio || !dataFim) return alert("Preencha todos os campos!")
  const res = await fetch("/api/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        nomeHospede, 
        quartoId, 
        dataInicio: new Date(dataInicio).toISOString(), 
        dataFim: new Date(dataFim).toISOString(),
        email: email 
    }),
  })
  if (res.ok) {
    const novo = await res.json()
    const mappedNovo = {
      ...novo,
      nomeHospede: nomeHospede,
      email: email,
      quartoNumero: quartos.find(q => q.id === quartoId)?.numero
    }
    setReservas([...reservas, mappedNovo])
    setNomeHospede(""); setQuartoId(null); setDataInicio(""); setDataFim("");
  } else alert("Erro ao adicionar reserva.")
}

  async function handleUpdateReserva(id: number) {
    if (!editNomeHospede || !editQuartoId) return alert("Preencha todos os campos!")
    const res = await fetch(`/api/reservas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeHospede: editNomeHospede, email: editEmail, quartoId: editQuartoId }),
    })
    if (res.ok) {
      setReservas(reservas.map(r => r.id === id ? { ...r, nomeHospede: editNomeHospede, email: editEmail, quartoId: editQuartoId, quartoNumero: quartos.find(q => q.id === editQuartoId)?.numero } : r))
      setEditId(null)
    } else {
      const errorData = await res.json()
      alert(errorData.error || "Erro ao atualizar reserva")
    }
  }

  async function handleDeleteReserva(id: number) {
    if (!confirm("Deseja realmente excluir esta reserva?")) return
    const res = await fetch(`/api/reservas/${id}`, { method: "DELETE" })
    if (res.ok) {
      setReservas(reservas.filter(r => r.id !== id))
    } else {
      const errorData = await res.json()
      alert(errorData.error || "Erro ao excluir reserva")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="max-w-md">
        <CardHeader><CardTitle>Adicionar Reserva</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="Nome do hóspede" value={nomeHospede} onChange={e => setNomeHospede(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Select onValueChange={val => setQuartoId(val ? Number(val) : null)} value={quartoId?.toString() || ""}>
            <SelectTrigger><SelectValue placeholder="Escolha o quarto" /></SelectTrigger>
            <SelectContent>
              {quartos.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.numero} - {q.hotelNome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" placeholder="Data de Início" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
          <Input type="date" placeholder="Data de Fim" value={dataFim} onChange={e => setDataFim(e.target.value)} />
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
                  <th className="border-b p-2">Email</th>
                  <th className="border-b p-2">Quarto</th>
                  <th className="border-b p-2">Duração (dias)</th>
                  <th className="border-b p-2">Criado em</th>
                  <th className="border-b p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(r => (
                  <tr key={r.id} className="hover:bg-gray-100">
                    <td className="border-b p-2">{r.id}</td>
                  <td className="border-b p-2">{editId === r.id ? <Input value={editNomeHospede || ""} onChange={e => setEditNomeHospede(e.target.value)} /> : r.nomeHospede}</td>
                  <td className="border-b p-2">{editId === r.id ? <Input value={editEmail || ""} onChange={e => setEditEmail(e.target.value)} /> : r.email}</td>
                  <td className="border-b p-2">
                    {editId === r.id ?
                      <Select onValueChange={val => setEditQuartoId(val ? Number(val) : null)} value={editQuartoId?.toString() || ""}>
                        <SelectTrigger><SelectValue placeholder="Escolha o quarto" /></SelectTrigger>
                        <SelectContent>
                          {quartos.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.numero} - {q.hotelNome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      : r.quartoNumero
                    }
                  </td>
                    <td className="border-b p-2">{r.stayDuration}</td>
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
