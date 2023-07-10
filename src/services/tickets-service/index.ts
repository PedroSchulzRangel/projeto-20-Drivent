import ticketsRepository from "@/repositories/tickets-repository";
import sessionRepository from "@/repositories/session-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import {notFoundError} from "@/errors/not-found-error";

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
const ticketsService = {
    getTickets,
    getUserTicket
};

export default ticketsService;