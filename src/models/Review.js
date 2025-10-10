const COLLECTION_NAME = 'reviews';

const REVIEW_SCHEMA_FIELDS = {
    albumId: 'string',
    userId: 'string',
    rating: 'number',
    reviewText: 'string',
    datePosted: 'string',
    isVerified: 'boolean',
    likesCount: 'number',
    isPublic: 'boolean'
};

module.exports = {
    COLLECTION_NAME,
    REVIEW_SCHEMA_FIELDS
};
