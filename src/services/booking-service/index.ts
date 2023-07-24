import { notFoundError } from "../../errors";
import { forbiddenError } from "../../errors/forbidden-error";
import bookingRepository from "../../repositories/booking-repository";
import enrollmentRepository from "../../repositories/enrollment-repository";
import roomRepository from "../../repositories/room-repository";
import ticketsRepository from "../../repositories/tickets-repository";

async function findOneBooking(userId: number){

    const reservation = await bookingRepository.findBookingByUserId(userId);

    if(!reservation) throw notFoundError();

    return {
        id: reservation.id,
        Room: reservation.Room
    }
}

async function createBooking(userId: number, roomId: number){
    
    const room = await roomRepository.findRoomById(roomId);

    if(!room) throw notFoundError();

    if(room.capacity === 0) throw forbiddenError();

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    if(!enrollment) throw forbiddenError();

    const ticket = await ticketsRepository.getUserTicket(enrollment.id);

    if(!ticket) throw forbiddenError();

    const ticketType = await ticketsRepository.getUserTicketType(ticket.ticketTypeId);

    if(!ticketType) throw forbiddenError();

    if(!ticketType.isRemote && ticketType.includesHotel && ticket.status === 'PAID'){

        const booking = await bookingRepository.createBooking(userId, roomId);

        await roomRepository.updateRoomCapacity(roomId, room.capacity);

        return booking.id;

    } else {
        throw forbiddenError();
    }
}

async function updateBooking(bookingId: number, roomId: number, userId: number){
    
    const booking = await bookingRepository.findBookingByUserId(userId);

    if(!booking) throw forbiddenError();

    if(booking.id !== bookingId) throw forbiddenError();

    const oldRoomId = booking.roomId;

    const oldRoomCapacity = booking.Room.capacity;

    const room = await roomRepository.findRoomById(roomId);

    if(!room) throw notFoundError();

    if(room.capacity === 0) throw forbiddenError();

    const updatedBooking = await bookingRepository.updateBooking(bookingId, roomId);

    await roomRepository.increaseRoomCapacity(oldRoomId, oldRoomCapacity);

    await roomRepository.updateRoomCapacity(room.id, room.capacity);

    return updatedBooking.id;
}
const bookingService = {
    findOneBooking,
    createBooking,
    updateBooking
}

export default bookingService;
