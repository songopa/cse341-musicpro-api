const express = require('express');
require('dotenv').config();
const { auth } = require('express-openid-connect');
const path = require('path');
const { connectToDb } = require('./config/db');


const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

const authConfig = require('./config/auth');
app.use(auth(authConfig));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
    res.locals.user = (req && req.oidc && req.oidc.user) ? req.oidc.user : null;
    next();
});


// routes
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/auth', require('./routes/auth'));
app.use('/labels', require('./routes/labels'));
app.use('/genres', require('./routes/genres'));
app.use('/artists', require('./routes/artists'));
app.use('/albums', require('./routes/albums'));
app.use('/reviews', require('./routes/reviews'));
app.use('/api-docs', require('./routes/swagger'));


// Connect to DB unless running tests (tests mock DB operations)
if (process.env.NODE_ENV !== 'test') {
    connectToDb().catch(err => console.error('DB connect error', err));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app; 
