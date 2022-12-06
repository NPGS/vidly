const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = new mongoose.Schema({
    name : { type : String, minlength : 2, maxlength : 50, required : true },
    email : { type : String, minlength : 10, maxlength : 100, unique : true, required : true },
    password : { type : String, minlength : 8, maxlength : 1024, required : true },
    isAdmin : { type : Boolean, default : false }
});

userSchema.methods.authenticationToken = function () {
    const token = jwt.sign({ _id : this._id, isAdmin : this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateInputs(req) {
    const schema = {
        name : Joi.string().min(2).max(50).required(),
        email : Joi.string().min(10).max(100).email().required(),
        password : Joi.string().min(8).max(16).required(),
        isAdmin : Joi.boolean()
    }
    return Joi.validate(req, schema);
}

function validateUserId(id) {
    const idIsValid = Joi.objectId();
    return Joi.validate(id, idIsValid);
}

async function getUsers() {
    return await User.find().sort('name');
}

async function getUserById(id) {
    return await User.findById(id);
}

async function addNewUser(req) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPsw = await bcrypt.hash(req.password, salt);
        const user = new User({
            name : req.name,
            email : req.email,
            password : hashedPsw,
            isAdmin : req.isAdmin
        });
        const result = await user.save();
        return result;
    }
    catch (e) {
        console.log(e.error);
        return e;
    }
}
// serve metodo edit
async function deleteUser(id) {
    return await User.findByIdAndDelete(id);
}

// LOGIN
function validateLogin(req) {
    const schema = {
        email : Joi.string().min(10).max(100).email().required(),
        password : Joi.string().min(8).max(16).required()
    }
    return Joi.validate(req, schema);
}

async function login(req) {
    try {
        const user = await User.findOne({ email : req.email });
        const decripted = await bcrypt.compare(req.password, user.password);
        if (!decripted) return undefined;
        return user;
    }
    catch (ex) {
        console.log('error:', ex);
        return ex;
    }
}

module.exports.User = User;
module.exports.getUsers = getUsers;
module.exports.getUserById = getUserById;
module.exports.addNewUser = addNewUser;
module.exports.deleteUser = deleteUser;
module.exports.validateInputs = validateInputs;
module.exports.validateUserId = validateUserId;
module.exports.validateLogin = validateLogin;
module.exports.login = login;