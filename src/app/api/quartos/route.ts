import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const rooms = await prisma.quarto.findMany({
            include: { hotel:true }
        })
        return NextResponse.json(rooms)
    } catch (error) {
        return NextResponse.json({error: 'Erro ao buscar quartos'}, {status: 500})
        
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        await prisma.quarto.create({
            data
        })
    } catch (error) {
        return NextResponse.json({error:'Erro ao criar'}, {status: 500})
        
    }
}