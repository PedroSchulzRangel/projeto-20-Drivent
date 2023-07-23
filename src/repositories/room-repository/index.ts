import { prisma } from '@/config';

async function findRoomById(roomId: number){
    return prisma.room.findUnique({
        where: {
            id: roomId
        }
    });
}

async function updateRoomCapacity(roomId: number, roomCapacity: number){
    return prisma.room.update({
        where: { id: roomId },
        data:{ capacity: roomCapacity-1}
    });
}

const roomRepository = {
    findRoomById,
    updateRoomCapacity
}

export default roomRepository;