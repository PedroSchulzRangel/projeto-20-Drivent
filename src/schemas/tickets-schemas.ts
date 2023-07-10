import joi from "joi";
import {ticketBody} from "@/protocols";

export const ticketSchema = joi.object<ticketBody>({
    ticketTypeId: joi.number().integer().required()
});