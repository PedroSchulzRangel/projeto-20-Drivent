import joi from "joi";
import { InputBookingBody } from "@/protocols";

export const bookingSchema = joi.object<InputBookingBody>({
    roomId: joi.number().integer().required()
});