import { prisma } from '@/config';

async function findBookingByUserId(userId: number){
    return prisma.booking.findFirst({
        where: { userId },
        include: {
          Room: true,
        },
      });
}

async function createBooking(userId: number, roomId: number){
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function findBookingById(bookingId: number){
  return prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
}

async function updateBooking(bookingId: number, roomId: number){
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId }
  });
}
async function findBookingsByRoomId(roomId: number){
  return prisma.booking.findMany({
    where:{ roomId }
  });
}

const bookingRepository = {
    findBookingByUserId,
    createBooking,
    findBookingById,
    updateBooking,
    findBookingsByRoomId
}

export default bookingRepository;