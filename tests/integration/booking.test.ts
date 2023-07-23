import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from "@faker-js/faker";
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, 
    createTicketType, 
    createTicket, 
    createUser, 
    createHotel,
    createRoom,
    createBooking} from '../factories';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /booking - authentication errors",() => {
    it('should respond with status 401 if no token is given', async () => {
        
        const response = await server.get('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
});

describe("GET /booking - with valid authentication credentials",() => {
    it("Should respond with status 200 and with a reservation object", async () => {
        const user = await createUser();
        const token = generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true,false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        const booking = await createBooking(user.id, room.id);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            id: booking.id,
            Room: room
        });
    })

    it("Should respond with status 404 when user doesn't have a reservation", async () => {
        const user = await createUser();
        const token = generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true,false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();
        await createRoom(hotel.id);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })
})