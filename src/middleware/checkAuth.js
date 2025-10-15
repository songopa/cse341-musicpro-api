
module.exports = (req, res, next) => {
    // Be defensive: req.oidc may be undefined if the auth middleware isn't loaded or configured
    if (req && req.oidc && typeof req.oidc.isAuthenticated === 'function' && req.oidc.isAuthenticated()) {
        return next();
    }
    const err = new Error('Unauthorized, please login to access this resource');
    err.status = 401;
    next(err);

    // return res.status(401).json({ error: 'Unauthorized, please login to access this resource' });
};