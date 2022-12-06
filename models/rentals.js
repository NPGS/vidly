const Joi = require('Joi');
const mongoose = require('mongoose');
const { Movie } = require('./movies');

const rentalSchema = new mongoose.Schema({
    rentedBy: {
        type: new mongoose.Schema({
            isGold: Boolean,
            name: String,
            phone: String
        }),
        required : true
    },
    movieRented: {
        type: new mongoose.Schema({
            title: String,
            genre: { type: new mongoose.Schema({ name: String }) }
        }),
        required: true
    },
    dateStart: { type : Date, default : Date.now(), required : true },
    dateReturn: { type : Date },
    valuePaid: { type : Number, required : true, min : 0.99 }
})

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'rentedBy._id': customerId,
        'movieRented._id': movieId
    });
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(req) {
    const schema = {
        rentedById: Joi.string().required(),
        movieRentedId: Joi.string().required(),
    }
    return Joi.validate(req, schema);
}

async function getRentals() {
    return await Rental.find();
}

async function getRentalById(id) {
    return await Rental.findById(id);
}

async function setNewRental(user, movie) {
    let movieValue = movie.dailyRentalRate; // 'isGold = true' means 15% discount
    if (user.isGold) movieValue = movie.dailyRentalRate * 0.85;
    const newRental = new Rental({
        rentedBy: user,
        movieRented: movie,
        dateReturn: '',
        valuePaid: movieValue
    });
    const result = await newRental.save();
    if (result) {
        movie.numberInStock--;
        await Movie.findByIdAndUpdate(movie._id, movie, { new: true });
    }
    return result;
}

module.exports.Rental = Rental;
module.exports.getRentals = getRentals;
module.exports.getRentalById = getRentalById;
module.exports.setNewRental = setNewRental;
module.exports.validateRental = validateRental;