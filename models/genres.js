const mongoose = require('mongoose');
const winston = require('winston');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        maxlength : 20,
        required : true,
        enum : ['Action','Adventure','Comedy','Horror','Suspence','Thriller','History','Superheroes',
            'Fantastic','Fantasy','Supernatural']
    }
});

function validationElement(req) {
    const schema = {
        name : Joi.string().min(3).max(20)
            .valid('Action','Adventure','Comedy','Horror','Suspence','Thriller','History','Superheroes',
            'Fantastic','Fantasy','Supernatural').required()
    }
    return Joi.validate(req, schema);
}

const Genre = mongoose.model('Genre', genreSchema);

async function getGenres() {
    return await Genre.find().sort({ name : 1 });
}

async function getGenreById(id) {
    try {
        return await Genre.findById(id);
    }
    catch (ex) {
        winston.error(ex.message, ex);
        return ex.error;
    }
}

async function newGenre(genreName) {
    try {
        const genre = new Genre({
            name : genreName
        });
        const result = await genre.save();
        return result;
    }
    catch (exception) {
        winston.info(exception.message);
        return exception.error;
    }
}

async function editGenre(req) {
    try {
        return await Genre.findByIdAndUpdate(req.params.id, {
            name : req.body.name
        },
        { new : true });
    }
    catch (ex) {
        winston.error(ex.message, ex);
        return ex.error;
    }
}

async function deleteGenre(id) {
    try {
        return await Genre.findByIdAndDelete(id);
    }
    catch (ex) {
        winston.error(ex.message, ex);
        return ex.error;
    }
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.newGenre = newGenre;
module.exports.getGenres = getGenres;
module.exports.getGenreById = getGenreById;
module.exports.validationElement = validationElement;
module.exports.editGenre = editGenre;
module.exports.deleteGenre = deleteGenre;