import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { getTicketsTypes, getUserTicket, getPaymentInfo } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);
ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);
ticketsRouter.get("/tickets",authenticateToken,getUserTicket);
ticketsRouter.get("/payments",authenticateToken,getPaymentInfo);

export { ticketsRouter };