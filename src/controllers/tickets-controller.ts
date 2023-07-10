import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from "@/services/tickets-service";

export async function getTicketsTypes(req: Request, res: Response){
    try{
        const types = await ticketsService.getTickets();
        
        res.status(httpStatus.OK).send(types);

    } catch (error){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

export async function getUserTicket(req: Request, res: Response){
    
    const {authorization} = req.headers;

    const token = authorization.replace("Bearer ","");

    try{
        const ticket = await ticketsService.getUserTicket(token);
        
        res.status(httpStatus.OK).send(ticket);
        
    } catch (error){
        if(error.name === "NotFoundError"){
            res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}