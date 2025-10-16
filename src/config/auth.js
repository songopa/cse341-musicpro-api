
module.exports = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET || 'a-very-secret-value',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH_CLIENT_ID || 'client-id',
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL || 'https://example.auth0.com',
    clientSecret: process.env.AUTH_SECRET,
    // Use query response_mode by default for local http development to avoid form_post issues
    authorizationParams: {
        response_type: process.env.OIDC_RESPONSE_TYPE || 'code',
        response_mode: process.env.OIDC_RESPONSE_MODE || 'query',
        scope: process.env.OIDC_SCOPES || 'openid profile email'
    }
};


