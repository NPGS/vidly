const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors'); // gestisce le eccezioni delle funzioni async nelle routes

module.exports = function() {
    // il processo gestisce le eccezioni non comprese nel blocco catch
    process.on('uncaughtException', (ex) => {
        console.error('GOT AN UNCAUGHT EXCEPTION');
        winston.error(ex.message, ex);
        process.exit(1);
    });

//    winston.handleExceptions(
//        new winston.transports.File({ filename : 'uncaughtException.log' }));
    
    // per le promise rejected non comprese in un try catch, si lancia un eccezione
    process.on('unhandledRejection', (ex) => { throw ex; });
    
//    winston.add(winston.transports.File, { filename : 'logfile.log' });
/*    winston.add(winston.transports.MongoDB, {
        db: 'mongodb://localhost/vidly',
        level : 'info'
    });*/
}