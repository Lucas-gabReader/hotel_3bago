import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const rooms = await prisma.quarto.findMany({
            include: { hotel: true }
        });
        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar quartos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.numero || !data.tipo || !data.hotelId) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
        }

        const quarto = await prisma.quarto.create({
            data: {
                numero: data.numero,
                tipo: data.tipo,
                hotelId: data.hotelId,
                preco: data.preco || 0
            }
        });
        return NextResponse.json(quarto, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar quarto:', error);
        return NextResponse.json({ error: 'Erro ao criar quarto' }, { status: 500 });
    }
}
