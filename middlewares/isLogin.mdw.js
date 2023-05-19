export default function (req, res, next) {
    if (req.session.auth === false) {
        return res.redirect('/account/login');
    }
    next();
}