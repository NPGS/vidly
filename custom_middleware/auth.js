const config = require('config');
const jwt = require('jsonwebtoken');

function authentication(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token provided.')
    try {
        const tokenDecoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = tokenDecoded;
        next();
    }
    catch (e) {
        console.error(e);
        res.status(400).send('Invalid token.');
    }
}

module.exports = authentication;