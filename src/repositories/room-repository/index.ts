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

async function increaseRoomCapacity(roomId: number, roomCapacity: number){
    return prisma.room.update({
        where: { id: roomId },
        data:{ capacity: roomCapacity+1}
    });
}
const roomRepository = {
    findRoomById,
    updateRoomCapacity,
    increaseRoomCapacity
}

export default roomRepository;