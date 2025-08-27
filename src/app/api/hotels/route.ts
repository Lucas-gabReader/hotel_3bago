import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET() {
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
        const hotel = await prisma.hotel.create({
            data
        })
        return NextResponse.json(hotel, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar hotel'}, {status: 500})
    }
}

