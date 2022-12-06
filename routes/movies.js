const { getMovies, getMovieById, addNewMovie, removeMovie, validateInputs } = require('../models/movies');
const { getGenreById } = require('../models/genres');
const asyncWrapper = require('../custom_middleware/asyncWrapper');
const auth = require('../custom_middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', asyncWrapper(async (req,res) => {
    const list = await getMovies();
    if (!list || (list && list.length < 1)) return res.status(404).send('Nessun film presente nel DB.');
    res.send(list);
}));

router.get('/:id', asyncWrapper(async (req,res) => {
    const result = await getMovieById(req.params.id);
    if (!result) return res.status(404).send('Genere non trovato.');
    res.send(result);
}));

router.post('/', auth, asyncWrapper(async (req,res) => {
    const result = validateInputs(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const genre = await getGenreById(req.body.genreId);
    if (!genre) return res.status(400).send('Impossibile terminare l\'operazione: richiesta risorsa non esistente.');
    const newMovie = await addNewMovie(req.body, genre);
    res.send(newMovie);
}));

router.delete('/:id', auth, asyncWrapper(async (req,res) => {
    const result = await removeMovie(req.params.id);
    if (!result) return res.status(400).send('Impossibile terminare l\'operazione: ID non trovato');
    res.send(result);
}));

module.exports = router;