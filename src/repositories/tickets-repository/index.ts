import { prisma } from '@/config';

async function getTicketTypes(){
    return await prisma.ticketType.findMany();
}

async function getUserTicket(enrollmentId: number){
    return await prisma.ticket.findFirst({
        where: {
            enrollmentId
        }
    });
}

async function getUserTicketType(ticketTypeId: number){
    return await prisma.ticketType.findFirst({
        where: {
            id: ticketTypeId
        }
    });
}

async function getPaymentInfoFromDB(ticketId: number){
    return await prisma.payment.findFirst({
        where:{
            ticketId
        }
    });
}

const ticketsRepository = {
    getTicketTypes,
    getUserTicket,
    getUserTicketType,
    getPaymentInfoFromDB
};

export default ticketsRepository;