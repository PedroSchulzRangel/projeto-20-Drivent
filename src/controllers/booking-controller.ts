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

export async function createBooking(req: AuthenticatedRequest, res: Response){
    
    const {userId} = req;

    const {roomId} = req.body;

    try{
        const bookingId = await bookingService.createBooking(userId, roomId);

        res.status(httpStatus.OK).send(bookingId);

    } catch (error){
        if(error.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        if(error.name === 'forbiddenError'){
            return res.status(httpStatus.FORBIDDEN).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response){
    
    const {userId} = req;

    const bookingId = Number(req.params.bookingId);

    const {roomId} = req.body;

    try{
        const newBookingId = await bookingService.updateBooking(bookingId, roomId, userId);

        res.status(httpStatus.OK).send(newBookingId);

    } catch (error){
        if(error.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        if(error.name === 'forbiddenError'){
            return res.status(httpStatus.FORBIDDEN).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}