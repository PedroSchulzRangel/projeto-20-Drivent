import {prisma} from '@/config';
import { TicketStatus, TicketType } from '@prisma/client';
import { CreateTicketParams } from '@/protocols';

async function getTicketTypes(){
    return await prisma.ticketType.findMany();
}

async function getUserTicket(enrollmentId: number){
    return await prisma.ticket.findFirst({
        where: {
            enrollmentId
        }
    });
}

async function getUserTicketType(ticketTypeId: number){
    return await prisma.ticketType.findFirst({
        where: {
            id: ticketTypeId
        }
    });
}

async function getPaymentInfoFromDB(ticketId: number){
    return await prisma.payment.findFirst({
        where:{
            ticketId
        }
    });
}

async function findTicket(ticketTypeId: number){
    return await prisma.ticket.findFirst({
        where: {
            ticketTypeId
        }
    });
}

async function findTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true
    },
  });
}

async function createTicket(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: ticket,
  });
}

async function findTickeyById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
    },
  });
}

async function findTickeWithTypeById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function ticketProcessPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

const ticketsRepository = {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket,
  findTickeyById,
  findTickeWithTypeById,
  ticketProcessPayment,
  getTicketTypes,
  getUserTicket,
  getUserTicketType,
  getPaymentInfoFromDB,
  findTicket
};
export default ticketsRepository;