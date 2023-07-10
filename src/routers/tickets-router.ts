import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { getTicketsTypes, getUserTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);
ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);
ticketsRouter.get("/tickets",authenticateToken,getUserTicket);

export { ticketsRouter };