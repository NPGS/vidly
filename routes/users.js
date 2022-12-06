const { User, getUsers, getUserById, addNewUser, deleteUser, validateInputs, validateUserId, validateLogin, login } = require('../models/users');
const auth = require('../custom_middleware/auth');
const admin = require('../custom_middleware/admin');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.get('/', async (req,res) => {
    const list = await getUsers();
    if (!list || (list && list.length < 1)) res.status(404).send('Nessun utente presente nel DB.');
    res.send(list);
});

router.get('/me', auth, async (req,res) => {
    const user = await getUserById(req.user._id);
    if (!user) return res.status(400).send('Token not provided or invalid.');
    res.send(user);
});

router.post('/', async (req,res) => {
    const validation = validateInputs(req.body);
    if (validation.error) return res.status(400).send(validation.error.details[0].message);
    let newUser = await User.findOne({ email : req.body.email });
    if (newUser) {
        console.log('Verifica email:', newUser.email);
        if (newUser.email === req.body.email) return res.status(400).send('Utente già registrato.');
    }
    newUser = await addNewUser(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    if (!newUser) return res.status(400).send('Errore di registrazione imprevisto.');
    const token = newUser.authenticationToken();
    res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'name', 'email', 'isAdmin']));
});

router.post('/login', async (req, res) => {
    const result = validateLogin(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const user = await login(req.body);
    if (!user) return res.status(400).send('Bad request!!! No such user is registered.');
    const token = user.authenticationToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', 'isAdmin']));
});

router.delete('/:id', [auth, admin], async (req, res) => {
    res.send('Admin entered the delete route!!');
});

module.exports = router;