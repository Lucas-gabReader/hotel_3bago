import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET() {
   try {
    const hotels = await prisma.hotel.findMany({
        include: { quartos: true }
    })
    return NextResponse.json(hotels)
}   catch (error) {
    console.error('Erro ao buscar hotéis:', error)
    return NextResponse.json({ error: 'Erro ao buscar hotéis'}, { status: 500})
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        console.log('POST request data for hotel:', data)
        const hotel = await prisma.hotel.create({
            data
        })
        return NextResponse.json(hotel, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar hotel:', error)
        return NextResponse.json({ error: 'Erro ao criar hotel'}, {status: 500})
    }
}

