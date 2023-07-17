import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '../services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response){
    
    const {authorization} = req.headers;

    const token = authorization.replace("Bearer ","");

    try{
        const hotels = await hotelsService.findAllHotels(token);

        res.status(httpStatus.OK).send(hotels);

    } catch (error){
        if(error.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        if(error.name === 'PaymentRequiredError'){
            return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
        }
        res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response){

    const {authorization} = req.headers;

    const token = authorization.replace("Bearer ","");
    
    const hotelId = Number(req.params.hotelId);

    try{
        const hotel = await hotelsService.findHotelById(token,hotelId);

        res.status(httpStatus.OK).send(hotel);

    } catch (error){
        if(error.name === 'NotFoundError'){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        if(error.name === 'PaymentRequiredError'){
            return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
        }
        if(error.name === "RequestError"){
            return res.status(httpStatus.BAD_REQUEST).send(error.message);
        }
        res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
}