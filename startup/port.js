module.exports = function(app) {
    const port = process.env.PORT || 3000;  // valore porta prestabilito o assegnato tramite variabile d'ambiente
    return app.listen(port);   // il server si mette in ascolto della porta assegnata
}