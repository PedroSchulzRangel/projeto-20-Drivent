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
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

export async function getPaymentInfo(req: Request, res: Response){

    const {authorization} = req.headers;

    const token = authorization.replace("Bearer ","");
    
    const {ticketId} = req.query as string;

    const numTicketId = parseInt(ticketId);

    if(!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

    try{ const paymentInfo = await ticketsService.getTicketPayment(numTicketId, token);
    
    } catch (error){
        if(error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        if(error.name === "UnauthorizedError"){
            return res.status(httpStatus.UNAUTHORIZED).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}