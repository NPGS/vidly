const { User } = require('../../models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('authenticationToken', () => {
    it('should make an autentication token', () => {
        const payload = { _id: new mongoose.Types.ObjectId().toHexString() , isAdmin : false };
        const user = new User(payload);
        user.authenticationToken = function() {
            const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
            return token;
        };
        const token = user.authenticationToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});