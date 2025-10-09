const { auth } = require('express-openid-connect');

module.exports = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET || 'a-very-secret-value',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH_CLIENT_ID || 'client-id',
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL || 'https://example.auth0.com'
};
