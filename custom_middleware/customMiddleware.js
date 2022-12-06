const cstMiddlewares = {
    log(req, res, next) {
        console.log('First, dont hang...');
        next();
    },
    secondPass(req, res, next) {
        console.log('Second, dont hang...');
        next();
    },
    hangNow(req, res, next) {
        console.log('Third, hang here.');
    }
}
module.exports = cstMiddlewares;