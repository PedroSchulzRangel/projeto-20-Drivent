import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from "@/services/tickets-service";
import {ticketBody} from "@/protocols";

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
    
    const ticketId = Number(req.query.ticketId);

    if(!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

    try{ const paymentInfo = await ticketsService.getTicketPayment(ticketId, token);
    
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

export async function postTickets(req: Request, res: Response){
    
    const {authorization} = req.headers;

    const token = authorization.replace("Bearer ","");

    try{
        const ticket = await ticketsService.postTickets(req.body, token);

        res.status(httpStatus.CREATED).send(ticket);
        
    } catch(error){
        if(error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND).send(error.message);
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
}