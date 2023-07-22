import { notFoundError } from "../../errors";
import bookingRepository from "../../repositories/booking-repository";

async function findOneBooking(userId: number){

    const reservation = await bookingRepository.findBookingByUserId(userId);

    if(!reservation) throw notFoundError();

    return {
        id: reservation.id,
        Room: reservation.Room
    }
}

const bookingService = {
    findOneBooking
}

export default bookingService;
