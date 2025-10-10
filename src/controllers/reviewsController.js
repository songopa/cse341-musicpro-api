const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { COLLECTION_NAME, REVIEW_SCHEMA_FIELDS } = require('../models/Review');

/////////////////////////////////////////////////////////////////////////////
// DATA VALIDATION START
//////////////////////////////////////////////////////////////////////////////

const validateReviewData = (review) => {
    const requiredFields = Object.keys(REVIEW_SCHEMA_FIELDS);

    for (const field of requiredFields) {
        if (!(field in review) || review[field] === null || review[field] === undefined) {
            return { isValid: false, status: 400, message: `Missing required field: ${field}.` };
        }
    }

    if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
        return { isValid: false, status: 400, message: 'Invalid rating. Must be a number between 1 and 5.' };
    }

    if (typeof review.isVerified !== 'boolean') {
        return { isValid: false, status: 400, message: 'isVerified must be a boolean.' };
    }
    
    return { isValid: true };
};

/////////////////////////////////////////////////////////////////////////////
// DATA VALIDATION END
//////////////////////////////////////////////////////////////////////////////

exports.getAll = async (req, res, next) => {
    try {
        const db = getDb();
        const items = await db.collection(COLLECTION_NAME).find().toArray();
        res.json(items);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const db = getDb();
        const item = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(req.params.id) });
        
        if (!item) return res.status(404).json({ message: 'Review not found' }); 
        
        res.json(item);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    const validation = validateReviewData(req.body);
    if (!validation.isValid) {
        return res.status(validation.status).json({ error: validation.message });
    }

    try {
        const db = getDb();
        const result = await db.collection(COLLECTION_NAME).insertOne(req.body);
        
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    const validation = validateReviewData(req.body);
    if (!validation.isValid) {
        return res.status(validation.status).json({ error: validation.message });
    }
    
    try {
        const db = getDb();
        const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: 'after' }
        );
        
        if (!result.value) return res.status(404).json({ message: 'Review not found' }); 
        
        res.json(result.value);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Review not found' });
        
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        next(err);
    }
};
