const error = require('../custom_middleware/error');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const returns = require('../routes/returns');

module.exports = function(app, express) {
    app.use(express.json());
    app.use(express.static('resources'));
    app.use(express.urlencoded({extended : true}));
    app.use('/vidly/api/genres', genres);
    app.use('/vidly/api/customers', customers);
    app.use('/vidly/api/movies', movies);
    app.use('/vidly/api/rentals', rentals);
    app.use('/vidly/api/users', users);
    app.use('/vidly/api/returns', returns);
    app.use(error); // middleware per gestione errori: si usa dopo le chiamate degli endpoint dell'app
}