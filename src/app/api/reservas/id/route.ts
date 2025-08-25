import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: {id: string}}) {
    try {
        const reserva = await prisma.reserva.findUnique({
            where: { id: Number(params.id) },
            include: { hotel: true, quarto: true}
        })

        if (!reserva) return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 })
    
        return NextResponse.json(reserva)
        } catch {
        return NextResponse.json({ error: 'Erro ao buscar reserva'}, { status: 404})
    }
}

export async function PUT(req: Request, { params }: { params: {id: string}}) {
    try {
        const data = await req.json()
        const update = await prisma.reserva.update({
            where: { id: Number(params.id)},
            data
        })
        return NextResponse.json(update)
    } catch {
        return NextResponse.json({ error: 'Erro ao atualizar reserva' }, { status: 500})
    }
}

export async function  DELETE(_: Request, { params } : { params: {id: String} }) {
   try {
    await prisma.reserva.delete({
        where: { id: Number(params.id)}
    })
    return NextResponse.json({ message: 'Reserva removida com sucesso'})
   } catch {
    return NextResponse.json({ error: 'Erro ao remover reserva' }, { status: 500 })
   } 
}