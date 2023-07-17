import sessionRepository from "@/repositories/session-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { paymentRequiredError } from "@/errors/payment-required-error";
import hotelsRepository from "../../repositories/hotels-repository";

async function findAllHotels(token: string){

    const session = await sessionRepository.getSessionByToken(token);

    const {userId} = session;

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    
    if(!enrollment) throw notFoundError();

    const {id} = enrollment;

    const ticket = await ticketsRepository.getUserTicket(id);

    if(!ticket) throw notFoundError();

    const {status} = ticket;

    if(status === 'RESERVED') throw paymentRequiredError()

    const {ticketTypeId} = ticket;

    const ticketType = await ticketsRepository.getUserTicketType(ticketTypeId);

    const {includesHotel} = ticketType;

    const {isRemote} = ticketType;

    if(!includesHotel || isRemote) throw paymentRequiredError()

    const hotel = await hotelsRepository.findAllHotels();

    if(!hotel) throw notFoundError();

    return hotel;
}

const hotelsService = {
    findAllHotels
};

export default hotelsService;