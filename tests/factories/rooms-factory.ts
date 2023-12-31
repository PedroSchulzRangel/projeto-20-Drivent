import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createRoom(hotelId: number, capacity?: number){
    return prisma.room.create({
        data: {
            name: faker.name.findName(),
            capacity: capacity || faker.datatype.number(),
            hotelId
        }
    })
}