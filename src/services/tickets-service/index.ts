import ticketsRepository from "@/repositories/tickets-repository";
import sessionRepository from "@/repositories/session-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import {notFoundError} from "@/errors/not-found-error";
import {unauthorizedError} from "@/errors/unauthorized-error";
import { ticketBody } from "@/protocols";
import { Prisma } from "@prisma/client";

async function getTickets(){
    return await ticketsRepository.getTicketTypes();
}

async function getUserTicket(token: string){

    const session = await sessionRepository.getSessionByToken(token);

    const {userId} = session;

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    
    if(!enrollment) throw notFoundError();

    const {id} = enrollment;

    const ticket = await ticketsRepository.getUserTicket(id);

    if(!ticket) throw notFoundError();

    const {ticketTypeId} = ticket;

    const ticketType = await ticketsRepository.getUserTicketType(ticketTypeId);

    return {
        id: ticket.id,
        status: ticket.status,
        ticketTypeId,
        enrollmentId: id,
        TicketType: ticketType,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    };
}

async function getTicketPayment(ticketId: number, token: string){

    const session = await sessionRepository.getSessionByToken(token);

    const {userId} = session;

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    
    if(!enrollment) throw notFoundError();

    const {id} = enrollment;

    const ticket = await ticketsRepository.getUserTicket(id);

    if(!ticket) throw notFoundError()

    if(ticket.id !== ticketId) throw unauthorizedError(); 

    const paymentInfo = await ticketsRepository.getPaymentInfoFromDB(ticketId);

    if(!paymentInfo) throw notFoundError();

    return paymentInfo;
}

async function postTickets(data: Prisma.TicketUncheckedCreateInput, token: string){

    const session = await sessionRepository.getSessionByToken(token);

    const {userId} = session;

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    
    if(!enrollment) throw notFoundError();

    const {id} = enrollment;

    const createdTicket = await ticketsRepository.createTicket(data);

    const ticket = await ticketsRepository.getUserTicket(id);

    const {ticketTypeId} = ticket;

    const ticketType = await ticketsRepository.getUserTicketType(ticketTypeId);

    return { 
        id: ticket.id,
        status: ticket.status,
        ticketTypeId,
        enrollmentId: id,
        TicketType: ticketType,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    };
}
const ticketsService = {
    getTickets,
    getUserTicket,
    getTicketPayment,
    postTickets
};

export default ticketsService;