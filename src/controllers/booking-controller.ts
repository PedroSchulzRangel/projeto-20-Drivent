import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '../services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response){
    
   const {userId} = req;

    try{
        const booking = await bookingService.findOneBooking(userId);

        res.status(httpStatus.OK).send(booking);

    } catch (error){
        if(error.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}