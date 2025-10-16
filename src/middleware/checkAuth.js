
module.exports = (req, res, next) => {
    // Be defensive: req.oidc may be undefined if the auth middleware isn't loaded or configured
    if (req && req.oidc && typeof req.oidc.isAuthenticated === 'function' && req.oidc.isAuthenticated()) {
        return next();
    }
    
    // Return 401 immediately for unauthenticated requests
    return res.status(401).json({ 
        success: false,
        error: 'Unauthorized', 
        message: 'Please login to access this resource' 
    });
};