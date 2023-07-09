import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { getTicketsTypes } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter.get("/tickets/types",authenticateToken,getTicketsTypes);

export { ticketsRouter };