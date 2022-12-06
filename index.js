// EXPRESS
const express = require('express'); // framework per la creazione del server
const app = express();  // instanzia l'app che andrà a servire i client

// STARTUP - IIFE
require('./startup/key')();     // controllo esistenza Secret Key per Json Web Token
require('./startup/exceptionsHandler')();   // gestisce errori e promise rejected oltre il contesto Express
require('./startup/database')();    // effettua la connessione al DB
require('./startup/routes')(app, express);  // endpoints dell'applicazione
require('./startup/prod')(app);     // protezione app

// PORT & LISTEN
const server = require('./startup/port')(app);  // mette in ascolto l'app con la porta assegnata

module.exports = server;