function checkAdmin(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('You don\'t have the authorization to perform this action.');
    next();
}
module.exports = checkAdmin;