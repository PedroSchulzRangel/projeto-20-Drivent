import { prisma } from '@/config';

async function findAllHotels(){
    return await prisma.hotel.findMany();
}

async function findHotelWithRoomsById(id: number){
    return await prisma.hotel.findFirst({
        where: { id },
        include:{
            Rooms: true
        }
    })
}

const hotelsRepository = {
    findAllHotels,
    findHotelWithRoomsById
};

export default hotelsRepository;