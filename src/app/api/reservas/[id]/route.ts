import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{id: string}>}) {
    const { id } = await context.params;
    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: Number(id) },
            include: { hotel: true, quarto: true}
        })

        if (!reserva) return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 })
    
        return NextResponse.json(reserva)
        } catch {
        return NextResponse.json({ error: 'Erro ao buscar reserva'}, { status: 500})
    }
}

export async function PUT(req: Request, context: { params: Promise<{id: string}>}) {
    const { id } = await context.params;
    try {
        const requestData = await req.json()
        console.log('PUT request data:', requestData)
        
        const { nomeHospede, email, dataInicio, dataFim, quartoId, hotelId } = requestData
        
        const updateData: any = {
            cliente: nomeHospede,
            quartoId
        }
        
        // Only include fields that are provided
        if (email !== undefined) updateData.email = email
        if (dataInicio !== undefined) updateData.dataInicio = dataInicio
        if (dataFim !== undefined) updateData.dataFim = dataFim
        if (hotelId !== undefined) updateData.hotelId = hotelId
        
        const update = await prisma.reserva.update({
            where: { id: Number(id)},
            data: updateData
        })
        return NextResponse.json(update)
    } catch (error) {
        console.error('Erro ao atualizar reserva:', error)
        return NextResponse.json({ error: 'Erro ao atualizar reserva' }, { status: 500})
    }
}

export async function  DELETE(_: Request, context: { params: Promise<{id: string}>}) {
    const { id } = await context.params;
   try {
    await prisma.reserva.delete({
        where: { id: Number(id)}
    })
    return NextResponse.json({ message: 'Reserva removida com sucesso'})
   } catch {
    return NextResponse.json({ error: 'Erro ao remover reserva' }, { status: 500 })
   } 
}
