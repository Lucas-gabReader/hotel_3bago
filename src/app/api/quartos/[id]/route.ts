import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{id: string }>}) {
    const { id } = await context.params;
    try {
        const quarto = await prisma.quarto.findUnique({
            where: { id: Number(id) },
            include: { hotel: true }
        })

        if (!quarto) return NextResponse.json({error: 'Quarto não encontrado' }, { status: 404 })
            
        return NextResponse.json(quarto)
    } catch  {
        return NextResponse.json({ error: 'Erro ao buscar quarto'}, {status: 500})
    }    
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }>}) {
    const { id } = await context.params;
    try {
        const data = await req.json()
        const updated = await prisma.quarto.update({
            where: { id: Number(id)},
            data
        })
        return NextResponse.json(updated)
    } catch  {
        return NextResponse.json({ error: 'Erro ao atualizar quarto' }, { status: 500 })
    }
}

export async function  DELETE(_: Request, context: { params: Promise<{id: string }>}) {
    const { id } = await context.params;
    try {
        // Check if quarto has any related reservas
        const reservasCount = await prisma.reserva.count({
            where: { quartoId: Number(id) }
        });
        
        if (reservasCount > 0) {
            return NextResponse.json({ 
                error: 'Não é possível remover o quarto porque existem reservas associadas a ele. Remova primeiro as reservas relacionadas.' 
            }, { status: 400 });
        }
        
        await prisma.quarto.delete({
            where: { id: Number(id)}
        })
        return NextResponse.json({ message: 'Quarto removido com sucesso'})
    } catch (error) {
        console.error('Error deleting quarto:', error);
        return NextResponse.json({ error: 'Erro ao remover quarto' }, { status: 500 })
    }   
}
