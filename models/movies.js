const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
    title : { type : String, minlength : 3, maxlength : 50, required : true },
    genre : {
        type: genreSchema,
        required : true,
    },
/*    genre : {
        _id : { type : mongoose.Schema.Types.ObjectId, ref : 'Genre', required : true },
        name : { type : String, required : true, minlength : 3, maxlength : 30 },
        required : true
    },*/
    numberInStock : { type : Number, min : 0, default : 0, required : true },
    dailyRentalRate : { type : Number, min : 0.0, default : 0.0, required : true }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateInputs(req) {
    const schema = {
        title : Joi.string().min(3).max(50).required(),
        genreId : Joi.string().required(),
    /*    genre : {
            _id : Joi.objectId().required(),
            name : Joi.string().min(3).max(30).required()
        },*/
        numberInStock : Joi.number().min(0).required(),
        dailyRentalRate : Joi.number().min(0.99).required()
    }
    return Joi.validate(req, schema);
}

async function getMovies() {
    return await Movie.find()
        .populate('genre', 'name')
        .sort('title');
}

async function getMovieById(id) {
    if (id.length === Number(24)) return await Movie.findById(id);
    else return undefined;
}

async function addNewMovie(req, genre) {
    const movie = new Movie({
        title : req.title,
        genre : {
            _id : genre._id,
            name : genre.name
        },
        numberInStock : req.numberInStock,
        dailyRentalRate : req.dailyRentalRate
    });
    const result = await movie.save();
    return result;
}

async function removeMovie(id) {
    if (id.length === Number(24)) return await Movie.findByIdAndRemove(id);
    else return undefined;
}

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.getMovies = getMovies;
module.exports.getMovieById = getMovieById;
module.exports.addNewMovie = addNewMovie;
module.exports.removeMovie = removeMovie;
module.exports.validateInputs = validateInputs;