const winston = require('winston');
const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        winston.error('FATAL ERROR!!! No private key is defined yet. Define one NOW!!!');
        process.exit(1);
    }
}