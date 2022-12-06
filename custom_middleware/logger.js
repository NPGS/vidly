const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: '../logfile.log' })
    ]
});
/*
logger.log({
    level: 'info',
    message: 'Logger Test Message',
});

logger.log({
    level: 'error',
    message: 'Logger Error Message',
});
*/
module.exports = logger;