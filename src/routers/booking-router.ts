import { Router } from "express";
import { authenticateToken, validateBody} from "@/middlewares";
import { bookingSchema } from "@/schemas";
import { createBooking, getBooking } from "../controllers/booking-controller";

const bookingRouter = Router();

bookingRouter.all('/*',authenticateToken)
            .get('/',getBooking)
            .post('/',validateBody(bookingSchema),createBooking)

export { bookingRouter };