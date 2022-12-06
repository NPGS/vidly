const { Genre } = require('../../models/genres');
const { User } = require('../../models/users');
const request = require('supertest');
const mongoose = require('mongoose');

let server;

const endpoint = '/vidly/api/genres';
const tokenName = 'x-auth-token';

function createUser(boolRole) {
    return new User({
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin : boolRole
    });
}

async function sendInfo(token, genre) {
    return await request(server)
        .post(endpoint)
        .set(tokenName, token)
        .send({ name: genre });
}

async function editInfo(id, token, genre) {
    return await request(server)
        .put(endpoint + '/' + id)
        .set(tokenName, token)
        .send({ name: genre });
}

async function deleteInfo(id, token) {
    return await request(server)
        .delete(endpoint + '/' + id)
        .set(tokenName, token)
        .send({ _id: id});
}

describe('/vidly/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });

    describe('GET /', () => {
        it('should get 404 status error for empty DB', async () => {
            const res = await request(server).get(endpoint);
            expect(res.status).toBe(404);
        });

        it('should return the list of genres', async () => {
            await Genre.collection.insertMany([
                { name: 'Action' },
                { name: 'Horror' }
            ]);

            const res = await request(server).get(endpoint);
            expect(res.body.some(v => v.name === 'Action')).toBeTruthy();
            expect(res.body.some(v => v.name === 'Horror')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre of given ID', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const genre = await Genre.findOne({ name: 'genre1' });
            const res = await request(server).get(endpoint + '/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 error for genre not found', async () => {
            const genre = new Genre({ name: 'genre1' });
            const res = await request(server).get(endpoint + '/' + genre._id);
            expect(res.status).toBe(404);
            expect(res.body).toMatchObject({});
        });
    });

    describe('POST /', () => {
        it('should get error 401 for authentication failed', async () => {
            const res = await sendInfo('', 'newGenre');
            expect(res.status).toBe(401);
        });

        it('should get status 403 forbidden for invalid authorization', async () => {
            const user = new User();
            const token = user.authenticationToken();
            const res = await sendInfo(token, 'newGenre');
            expect(res.status).toBe(403);
        });

        it('should get error 400 for bad request', async () => {
            const user = new User({ isAdmin: true });
            const token = user.authenticationToken();
            const res = await sendInfo(token, 'newGenre');
            expect(res.status).toBe(400);
        });

        it('should get status 200 for succesful insert of new genre', async () => {
            const user = new User({ isAdmin: true });
            const token = user.authenticationToken();
            const res = await sendInfo(token, 'Fantasy');
            expect(res.status).toBe(200);
        });

    });

    describe('PUT /', () => {
        it('should return status 401 for token not provided', async () => {
            const genre = await new Genre({ name: 'Fantasy' }).save();
            const res = await editInfo(genre._id, '', 'Horror');
            expect(res.status).toBe(401);
        });

        it('should return status 403 unhautorized user', async () => {
            const genre = await new Genre({ name: 'Fantasy' }).save();
            const user = createUser(false);
            const token = user.authenticationToken();
            const res = await editInfo(genre._id, token, 'Horror');
            expect(res.status).toBe(403);
        });

        it('should return status 400 when input genre does not match the enum values', async () => {
            const genre = await new Genre({ name: 'Fantasy' }).save();
            const user = createUser(true);
            const token = user.authenticationToken();
            const res = await editInfo(genre._id, token, 'wrong genre');
            expect(res.status).toBe(400);
        });

        it('should return status 200 when input genre is within the enum values', async () => {
            const genre = await new Genre({ name: 'Fantasy' }).save();
            const user = createUser(true);
            const token = user.authenticationToken();
            const res = await editInfo(genre._id, token, 'History');
            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /', () => {
        it('should return status 400 for bad genre Id sended', async () => {
            const user = createUser(true);
            const token = user.authenticationToken();
            const res = await deleteInfo('hfg7edte43swhfg7edte43sw', token);
            expect(res.status).toBe(404);
        });

        it('should return status 200 when deleting the genre of given Id', async () => {
            const genreList = await Genre.insertMany([
                { name: 'Fantasy'},
                { name: 'Action'},
                { name: 'Horror'}
            ]);
            const genre = genreList[0];
            const user = createUser(true);
            const token = user.authenticationToken();
            const res = await deleteInfo(genre._id, token);
            expect(genre).toMatchObject(genreList[0]);
            expect(res.status).toBe(200);
        });
    });
});