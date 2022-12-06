const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold : {
        type : Boolean,
        default : false
    },
    name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 30
    },
    phone : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 10
    }
})

const Customer = mongoose.model('Customer', customerSchema);

// definire metodi per query e inserimento (opzionale?) e validazione (Joi)
async function getCustomers() {
    const customers = await Customer.find().sort('name').select('name isGold phone');
    console.log(customers);
    return customers;
}

async function getCustomerById(id) {
    try {
        const result = await Customer.findById(id);
        if (result != undefined) {
            console.log(result);
            return result;
        }
        else throw new Error('No Customer with selected Id...');
    }
    catch (excp) {
        console.log(excp.error);
        return excp.error;
    }
}

async function insertCustomer(request) {
    try {
        const customer = new Customer({
            isGold : request.isGold,
            name : request.name,
            phone : request.phone
        });
        const result = await customer.save();
        console.log(result);
        return result;
    }
    catch (excp) {
        console.log(excp.error);
        return excp.error;
    }
}

async function editCustomer(request) {
    try {
        const customer = await Customer.findByIdAndUpdate(request.params.id, {
            isGold : request.body.isGold,
            name : request.body.name,
            phone : request.body.phone
        }, { new : true });
        console.log(customer);
        return customer;
    }
    catch (excp) {
        console.log(excp.error);
        return excp.error;
    }
}

async function deleteCustomer(id) {
    try {
        const customer = await Customer.findByIdAndRemove(id);
        console.log('Deleted customer:', customer);
        return customer;
    }
    catch (excp) {
        console.log(excp.error);
        return excp.error;
    }
}

function validateInfo(request) {
    const schema = {
        isGold : Joi.boolean().required(),
        name : Joi.string().min(3).max(30).required(),
        phone : Joi.string().min(10).max(10)
    }
    return Joi.validate(request, schema);
}

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.validateInfo = validateInfo;
module.exports.getCustomers = getCustomers;
module.exports.getCustomerById = getCustomerById;
module.exports.insertCustomer = insertCustomer;
module.exports.editCustomer = editCustomer;
module.exports.deleteCustomer = deleteCustomer;