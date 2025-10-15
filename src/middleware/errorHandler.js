module.exports = (err, req, res, next) => {
    //check request type to determine response format between HTML and JSON
    if (req.originalUrl.startsWith('/api/') || req.xhr || req.headers.accept.indexOf('json') > -1) {
        console.error(err);
        const status = err.status || 500;
        return res.status(status).json({ message: err.message || 'Internal Server Error' });
    }
    // Default to HTML response for regular requests
    res.render('error', {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV !== 'production' ? err : {}
    });
};
