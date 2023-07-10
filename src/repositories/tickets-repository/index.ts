import { prisma } from '@/config';
import { Prisma } from "@prisma/client";
import * as querystring from "querystring";

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

async function getPaymentInfoFromDB(ticketId: string | querystring.ParsedUrlQueryInput | string[] | querystring.ParsedUrlQueryInput[]){
    return await prisma.payment.findFirst({
        where:{
            ticketId: Number(ticketId)
        }
    });
}

async function createTicket(data: Prisma.TicketUncheckedCreateInput){
    return await prisma.ticket.create({
        data
    });
}

async function findTicket(ticketTypeId: number){
    return await prisma.ticket.findFirst({
        where: {
            ticketTypeId
        }
    });
} 
const ticketsRepository = {
    getTicketTypes,
    getUserTicket,
    getUserTicketType,
    getPaymentInfoFromDB,
    createTicket,
    findTicket
};

export default ticketsRepository;