import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from "@faker-js/faker";
import * as jwt from 'jsonwebtoken';
import { createUser } from '../factories/users-factory';
import { createEnrollmentWithAddress } from '../factories/enrollments-factory';
import { createTicketType, createTicket } from '../factories/tickets-factory';
import { createHotel } from '../factories/hotels-factory';
import { createRoom } from '../factories/rooms-factory';
import { timeStamp } from 'console';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels authentication errors', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});

describe('GET /hotels when token is valid', () => {
    it('should respond with status 200 when user have an enrollment with paid ticket and hotel included', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
            Rooms: [
              {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                hotelId: hotel.id,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString(),
              }
            ]
          });
    })
    it("should respond with status 404 when user don't have an enrollment", async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })

    it("should respond with status 404 when user don't have a ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })

    it("should respond with status 404 when user did not select a hotel", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true, false);

        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })
    it("should respond with status 402 when user have an unpaid ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketType.id, "RESERVED");

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })
});

describe('GET /hotels/:hotelId authentication errors', () => {
    it('should respond with status 401 if no token is given', async () => {
        const user = await createUser();
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();

        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const user = await createUser();
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const enrollmentWithAdress = await createEnrollmentWithAddress(userWithoutSession);
        const ticketTypeWithHotel = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});

describe('GET /hotels/:hotelId when token is valid', () => {
    it('should respond with status 200 when user have an enrollment with paid ticket and hotel included', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
                Rooms: [
                    {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        hotelId: room.hotelId,
                        createdAt: room.createdAt.toISOString(),
                        updatedAt: room.updatedAt.toISOString(),
                    }
                ]
            })
    })
    it("should respond with status 404 when user don't have an enrollment", async () => {

        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })

    it("should respond with status 404 when user don't have a ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })

    it("should respond with status 404 when hotelId is not valid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketTypeWithHotel = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketTypeWithHotel.id, "PAID");

        const invalidHotelId = faker.datatype.bigInt();

        const response = await server.get(`/hotels/${invalidHotelId}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);

    })
    it("should respond with status 402 when user have an unpaid ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentWithAdress = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, false);
        await createTicket(enrollmentWithAdress.id, ticketType.id, "RESERVED");
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    })
});
