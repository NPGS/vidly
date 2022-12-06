const { newGenre, getGenres, getGenreById, validationElement, editGenre, deleteGenre } = require('../models/genres');
const auth = require('../custom_middleware/auth');
const admin = require('../custom_middleware/admin');
const asyncWrapper = require('../custom_middleware/asyncWrapper');
const objId = require('../custom_middleware/validateObjectId');
const express = require('express');
const router = express.Router();

// GET ALL OBJS
router.get('/', asyncWrapper(async (req,res) => {
    const genres = await getGenres();
    if (!genres || (genres && genres.length < 1)) res.status(404).send('Nessun genere presente nel DB.');
    res.send(genres);
}));

// GET OBJ
router.get('/:id', objId, asyncWrapper(async (req,res) => {
    const element = await getGenreById(req.params.id);
    if (!element) return res.status(404).send('Risorsa non trovata');
    res.send(element);
}));

// ADD OBJ
router.post('/', [auth, admin], asyncWrapper(async (req,res) => {
    const result = validationElement(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const genre = await newGenre(req.body.name);
    res.send(genre);
}));

// EDIT OBJ
router.put('/:id', [auth, admin], objId, asyncWrapper(async (req,res) => {
    const result = validationElement(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const genre = await editGenre(req);
    if (!genre) return res.status(404).send('Risorsa non trovata');
    res.send(genre);
}));

// DELETE OBJ
router.delete('/:id', [auth, admin], objId, asyncWrapper(async (req,res) => {
    const element = await getGenreById(req.params.id);
    if (!element) return res.status(404).send('Risorsa non trovata');
    const result = await deleteGenre(element._id);
    res.send(result);
}));

module.exports = router;