const COLLECTION_NAME = 'labels';

const LABEL_SCHEMA_FIELDS = {
    name: 'string', 
    foundedYear: 'number', 
    country: 'string', 
    headquarters: 'string', 
    ceo: 'string', 
    website: 'string', 
    genres: 'array',
    description: 'string'
};

module.exports = {
    COLLECTION_NAME,
    LABEL_SCHEMA_FIELDS
};