import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import {validateBody} from "@/middlewares/validation-middleware";
import {ticketSchema} from "@/schemas/tickets-schemas";
import { getTicketsTypes, getUserTicket, getPaymentInfo, postTickets } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);
ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);
ticketsRouter.get("/tickets",authenticateToken,getUserTicket);
ticketsRouter.post("/tickets",authenticateToken,validateBody(ticketSchema),postTickets);
ticketsRouter.get("/payments",authenticateToken,getPaymentInfo);

export { ticketsRouter };