import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const reservas = await prisma.reserva.findMany({
            include: { hotel: true, quarto: true }
        })
        return NextResponse.json(reservas)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar reservas'}, {status:500} )
        
    } 
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        await prisma.reserva.create({
            data
        })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar reserva' }, { status: 500 })
        
    }
    
}