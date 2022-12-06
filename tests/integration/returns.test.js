let server;
let rentedBy;
let movieRented;
let user;
let token;
let rental;
const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rentals');
const { User } = require('../../models/users');

const endpoint = '/vidly/api/returns';
const tokenName = 'x-auth-token';

async function getPostResponse(token, obj) {
    return await request(server)
        .post(endpoint)
        .set(tokenName, token)
        .send(obj);
}

async function getPutResponse(path, id, token, obj) {
    return await request(server)
        .put(endpoint + path + id)
        .set(tokenName, token)
        .send(obj);
}

function makeToken(isAdmin) {
    user = new User({ isAdmin });
    token = user.authenticationToken();
    return token;
}

describe('/vidly/api/returns/', () => {
    beforeEach(async () => {
        server = require('../../index');
        rentedBy = mongoose.Types.ObjectId();
        movieRented = mongoose.Types.ObjectId();
        rental = new Rental({
            rentedBy,
            movieRented,
            dateStart: Date.now(),
            dateReturn: '',
            valuePaid: 14.99
        });
    });

    afterEach(async () => {
        await Rental.remove({});
        await server.close();
    });

    describe('POST /', () => {       
        it('should get status 401 when token is not provided', async () => {
            const res = await getPostResponse('', { rentedBy, movieRented });
            expect(res.status).toBe(401);
        });

        it('should get status 403 if user isn\'t the admin', async () => {
            const res = await getPostResponse(makeToken(false), { rentedBy, movieRented });
            expect(res.status).toBe(403);
        });

        it('should get status 400 when customer ID is not provided', async () => {
            const res = await getPostResponse(makeToken(true), { movieRented });
            expect(res.status).toBe(400);
        });

        it('should return status 400 when movie ID is not provided', async () => {
            const res = await getPostResponse(makeToken(true), { rentedBy });
            expect(res.status).toBe(400);
        });

        it('should return 404 if no rental is found with customer/movie id combo', async () => {
            const res = await getPostResponse(makeToken(true), { rentedBy, movieRented });
            expect(res.status).toBe(404);
        });

        it('should return status 400 if rental were already processed', async () => {
            rental.dateReturn = Date.now();
            const newRental = await rental.save();
            const res = await getPostResponse(makeToken(true), {
                rentedBy: newRental.rentedBy._id,
                movieRented: newRental.movieRented._id
            });
            expect(res.status).toBe(400);
        });

        it('should return status 200 for valid request', async () => {
            const newRental = await rental.save();
            const res = await getPostResponse(makeToken(true), {
                rentedBy: newRental.rentedBy._id,
                movieRented: newRental.movieRented._id
            });
            expect(res.status).toBe(200)
        });
    });

});