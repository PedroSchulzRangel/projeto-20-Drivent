import sessionRepository from "@/repositories/session-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, requestError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { paymentRequiredError } from "@/errors/payment-required-error";
import hotelsRepository from "../../repositories/hotels-repository";
import httpStatus from "http-status";

async function businessRules(token: string){

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
}

async function findAllHotels(token: string){

    await businessRules(token);

    const hotels = await hotelsRepository.findAllHotels();

    if(hotels.length === 0) throw notFoundError();

    return hotels;
}

async function findHotelById(token: string, hotelId: number){
    
    await businessRules(token);

    const hotel = await hotelsRepository.findHotelWithRoomsById(hotelId);

    if(!hotel) throw notFoundError();

    return hotel;
}
const hotelsService = {
    findAllHotels,
    findHotelById
};

export default hotelsService;
