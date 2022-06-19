function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/signin');
}
function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/login');
    }
    return next();
}
module.exports = {
    checkAuth: checkAuth,
    checkNotAuth: checkNotAuth
}