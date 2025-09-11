import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const reservas = await prisma.reserva.findMany({
            include: { hotel: true, quarto: true }
        });
        return NextResponse.json(reservas);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar reservas' }, { status: 500 });
    } 
}

export async function POST(req: Request) {
    try {
        const requestData = await req.json();
        console.log('POST request data:', requestData);

        const { nomeHospede, email, dataInicio, dataFim, quartoId, hotelId } = requestData;

        // Calculate stay duration in days
        const startDate = new Date(dataInicio);
        const endDate = new Date(dataFim);
        const stayDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Get hotelId from quarto if not provided
        let finalHotelId = hotelId;
        if (!finalHotelId) {
            const quarto = await prisma.quarto.findUnique({
                where: { id: quartoId },
                select: { hotelId: true }
            });
            if (quarto) finalHotelId = quarto.hotelId;
        }

        const createData: any = {
            cliente: nomeHospede,
            quartoId,
            dataInicio: startDate,
            dataFim: endDate,
            stayDuration
        };

        // Only include fields that are provided
        if (email !== undefined) createData.email = String(email);
        if (finalHotelId !== undefined) createData.hotelId = finalHotelId;

        const reserva = await prisma.reserva.create({
            data: createData
        });
        return NextResponse.json(reserva, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        return NextResponse.json({ error: 'Erro ao criar reserva' }, { status: 500 });
    }
}
