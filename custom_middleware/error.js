const winston = require('winston');
function manageErrors(err, req, res, next) {
//    winston.error(err.message, err);
    console.log(err);
    res.status(500).send('Something went wrong...');
}
module.exports = manageErrors;