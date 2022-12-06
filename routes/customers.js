const { getCustomers, getCustomerById, insertCustomer, editCustomer, deleteCustomer, validateInfo } = require('../models/customers');
const express = require('express');
const router = express.Router();

// definire metodi get, post, put e delete
router.get('/', async (req,res) => {
    const customers = await getCustomers();
    res.send(customers);
});

router.get('/:id', async (req,res) => {
    const customer = await getCustomerById(req.params.id);
    if (!customer) return res.status(404).send('Customer not found...');
    res.send(customer);
});

router.post('/', async (req,res) => {
    const validation = validateInfo(req.body);
    if (validation.error) return res.status(400).send(validation.error.details[0].message);
    const newCustomer = await insertCustomer(req.body);
    res.send(newCustomer);
});

router.put('/:id', async (req,res) => {
    const validation = validateInfo(req.body);
    if (validation.error) return res.status(400).send(validation.error.details[0].message);
    const result = await editCustomer(req);
    res.send(result);
});

router.delete('/:id', async (req,res) => {
    const result = await deleteCustomer(req.params.id);
    res.send(result);
});

module.exports = router;