const express = require('express');
const router = express.Router();
const auth = require('../custom_middleware/auth');
const admin = require('../custom_middleware/admin');
const asyncWrapper = require('../custom_middleware/asyncWrapper');
const Joi = require('joi');
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');

function validateId(req) {
    const schema = {
        rentedBy: Joi.objectId().required(),
        movieRented: Joi.objectId().required()
    }
    return Joi.validate(req, schema);
}

router.post('/', [auth, admin], asyncWrapper(async (req,res) => {
    // controllo Id cliente
    if (!req.body.rentedBy)
       return res.status(400).send('Error! Customer ID not provided');
    // controllo Id film
    if (!req.body.movieRented)
        return res.status(400).send('Error! Movie ID not provided');

    // controllare se l'affitto esiste
    let rental = await Rental.lookup(req.body.rentedBy, req.body.movieRented);
    if (!rental) return res.status(404).send('No rental found with this customer/movie combo');

    // se l'affitto esiste, controllare se è stato chiuso precedentemente
    if (rental.dateReturn) return res.status(400).send('Selected rental were already closed.');

    // si chiude l'affito assegnando data di ritorno e incrementando di +1 la scorta del film
    rental.dateReturn = Date.now();
    rental = await rental.save();
    await Movie.update({ _id: rental.movieRented._id },
        { $inc: { numberInStock: 1 } }
    );
    return res.send(rental);
}));

module.exports = router;