import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(_: Request, context: { params: Promise<{ id: string }>}) {
    const { id } = await context.params;
    try {
        const Hotel = await prisma.hotel.findUnique({
            where: { id: Number(id)},
            include: { quartos: true}
        })

        if (!Hotel) return NextResponse.json({ error: 'Hotel não encontrado' }, { status: 404 })
    
        return NextResponse.json(Hotel)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar hotel' }, { status: 500 })
        
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }>}) {
    const { id } = await context.params;
    try {
        const data = await req.json()
        const updated = await prisma.hotel.update({
            where: { id: Number(id) },
            data
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Erro ao atualizar hotel'}, { status: 500})
        
    }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }>}) {
    const { id } = await context.params;
    try {
        // Check if hotel has any related quartos
        const quartosCount = await prisma.quarto.count({
            where: { hotelId: Number(id) }
        });
        
        // Check if hotel has any related reservas
        const reservasCount = await prisma.reserva.count({
            where: { hotelId: Number(id) }
        });
        
        if (quartosCount > 0 || reservasCount > 0) {
            return NextResponse.json({ 
                error: 'Não é possível remover o hotel porque existem quartos ou reservas associadas a ele. Remova primeiro os quartos e reservas relacionados.' 
            }, { status: 400 });
        }
        
        await prisma.hotel.delete({
            where: { id: Number(id) }
        })
        return NextResponse.json({ message: 'Hotel removido com sucesso' })
    } catch (error) {
        console.error('Error deleting hotel:', error);
        return NextResponse.json({ error: 'Erro ao remover hotel'}, { status: 500})
    }
}
