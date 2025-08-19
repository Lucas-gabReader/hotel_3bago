import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { renderToString } from 'react-dom/server'

export async function Get() {
   try {
    const hotels = await prisma.hotel.findMany({
        include: { quartos: true }
    })
    return NextResponse.json(hotels)
}   catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar hotéis'}, { status: 500})
    }
}

    export async function POST(req: Request) {
        try {
            const data = await req.json()
            await prisma.hotel.create({
                data
            })
            
        } catch (error) {
            return NextResponse.json({ error: 'Erro ao criar hotel'}, {status: 500})
            
        }
        
    }

