import { Router } from "express";
import { authenticationRouter } from "./authentication-router";
import { enrollmentsRouter } from "./enrollments-router";
import { eventsRouter } from "./events-router";
import { ticketsRouter } from "./tickets-router";
import { usersRouter } from "./users-router";

const router = Router();

router.use(usersRouter);
router.use(authenticationRouter);
router.use(eventsRouter);
router.use(enrollmentsRouter);
router.use(ticketsRouter);

export default router;