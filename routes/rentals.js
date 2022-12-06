const { getRentals, getRentalById, setNewRental, validateRental } = require('../models/rentals');
const { getCustomerById } = require('../models/customers');
const { getMovieById } = require('../models/movies');
const asyncWrapper = require('../custom_middleware/asyncWrapper');
const auth = require('../custom_middleware/auth');
const admin = require('../custom_middleware/admin');
const objId = require('../custom_middleware/validateObjectId');
const express = require('express');
const router = express.Router();

router.get('/', auth, asyncWrapper(async (req,res) => {
    const list = await getRentals();
    if (!list || (list && list.length < 1)) return res.status(404).send('Nessun noleggio presente nel DB.');
    res.send(list);
}));

router.get('/:id', [auth, admin, objId], asyncWrapper(async (req,res) => {
    const rental = await getRentalById(req.params.id);
    if (!rental) res.status(404).send('Nessun noleggio trovato con tale ID.');
    res.send(rental);
}));

router.post('/', [auth, admin], asyncWrapper(async (req,res) => {
    const validation = validateRental(req.body);
    if (validation.error) return res.status(404).send(validation.error.details[0].message);

    // controllo se esiste il cliente con il dato id
    const customer = await getCustomerById(req.body.rentedById);
    if (!customer) return res.status(400).send('Nessun cliente corrisponde all\'ID selezionato.');

    // controllo se esiste il film con il dato id
    const movie = await getMovieById(req.body.movieRentedId);
    if (!movie) return res.status(400).send('Nessun film corrisponde all\'ID selezionato.');

    // controllo se per il film selezionato non ci sono scorte sufficienti
    if (movie.numberInStock < 1)
        return res.status(400).send(`Copie film "${movie.title}" attualmente terminate.`);

    // verifiche superate, registro il noleggio
    const newRental = await setNewRental(customer, movie);
    res.send(newRental);
}));

module.exports = router;