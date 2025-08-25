import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Quando } from "next/font/google";

export async function GET(_: Request, { params }: {params: {id: string }}) {
    try {
        const quarto = await prisma.quarto.findUnique({
            where: { id: Number(params.id) },
            include: { hotel: true }
        })

        if (!quarto) return NextResponse.json({error: 'Quarto não encontrado' }, { status: 404 })
            
        return NextResponse.json(quarto)
    } catch  {
        return NextResponse.json({ error: 'Erro ao buscar quarto'}, {status: 500})
    }    
}

export async function PUT(req: Request, { params }: {params: { id: string}}) {
    try {
        const data = await req.json()
        const updated = await prisma.quarto.update({
            where: { id: Number(params.id)},
            data
        })
        return NextResponse.json(updated)
    } catch  {
        return NextResponse.json({ error: 'Erro ao atualizar quarto' }, { status: 500 })
    }
}

export async function  DELETE(_: Request, { params }: { params: {id: string}}) {
 try {
    await prisma.quarto.delete({
        where: { id: Number(params.id)}
    })
    return NextResponse.json({ message: 'Quarto removido com sucesso'})
 } catch  {
    return NextResponse.json({ error: 'Erro ao remover quarto' }, { status: 500 })
 }   
}