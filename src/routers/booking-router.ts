import { Router } from "express";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { getBooking } from "../controllers/booking-controller";

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken)
            .get('/',getBooking)

export { bookingRouter };