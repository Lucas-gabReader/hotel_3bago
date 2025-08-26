import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string }}) {
    try {
        const Hotel = await prisma.hotel.findUnique({
            where: { id: Number(params.id)},
            include: { quartos: true}
        })

        if (!Hotel) return NextResponse.json({ error: 'Hotel não encontrado' }, { status: 404 })
    
        return NextResponse.json(Hotel)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar hotel' }, { status: 500 })
        
    }
}

export async function PUT(req: Request, { params }: { params: { id: string}}) {
    try {
        const data = await req.json()
        const updated = await prisma.hotel.update({
            where: { id: Number(params.id) },
            data
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Erro ao atualizar hotal'}, { status: 500})
        
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string}}) {
    try {
        await prisma.hotel.delete({
            where: { id: Number(params.id) }
        })
        return NextResponse.json({ message: 'Hotel removido com sucesso' })
    } catch  {
        return NextResponse.json({ error: 'Erro ao remover hotel'}, { status: 500})
    }
}
