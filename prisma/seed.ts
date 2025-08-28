import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient()

async function main(){
    const totalHoteis = 5
    const quartosPorHotel = 5
    const reservasPorHotel = 3

    for (let i = 0; i < totalHoteis; i++) {
        const hotel = await prisma.hotel.create({
            data: {
                nome: `${faker.company.name()} Hotel`,
                endereco: faker.location.streetAddress({ useFullAddress: true}),
            }
        })
        for (let q = 0; q < quartosPorHotel; q++) {
            const dataInicio = faker.date.soon({ days: 30 });
            const dataFim = faker.date.soon({ days: 40, refDate: dataInicio });

            const quarto = await prisma.quarto.create({
                data: {
                    numero: `${q + 101}`,
                    tipo: faker.helpers.arrayElement(['Standard', 'Luxo', 'Master', 'Premium']),
                    preco: faker.number.float({ min: 100, max:500, fractionDigits: 2}),
                    hotelId: hotel.id,
                    dataInicio, // Add start date
                    dataFim // Add end date
                }
            })

            for (let r = 0; r < reservasPorHotel; r++) {
                await prisma.reserva.create({
                    data: {
                        cliente: faker.person.fullName(),
                        email: faker.internet.email(),
                        dataInicio,
                        dataFim,
                        quartoId: quarto.id,
                        hotelId: hotel.id
                    }
                })
            }
        }
    }
    
    console.log(`✅ seed concluido: ${totalHoteis} hotéis, ${totalHoteis * quartosPorHotel} quartos e ${totalHoteis * quartosPorHotel * reservasPorHotel} reservas criadas!`)
}

main()
    .then(async () => {
        await prisma.$disconnect()   
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
