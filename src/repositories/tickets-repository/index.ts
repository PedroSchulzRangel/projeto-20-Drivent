import { prisma } from '@/config';

async function getTicketTypes(){
    return prisma.ticketType.findMany();
}

const ticketsRepository = {
    getTicketTypes
};

export default ticketsRepository;