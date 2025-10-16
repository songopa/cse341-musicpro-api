const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { COLLECTION_NAME, LABEL_SCHEMA_FIELDS } = require('../models/Label');

/////////////////////////////////////////////////////////////////////////////
// DATA VALIDATION START
//////////////////////////////////////////////////////////////////////////////

const validateLabelData = (label) => {
    const requiredFields = Object.keys(LABEL_SCHEMA_FIELDS);

    for (const field of requiredFields) {
        if (!(field in label) || label[field] === null || label[field] === undefined) {
            return { isValid: false, status: 400, message: `Missing required field: ${field}.` };
        }
    }

    if (typeof label.foundedYear !== 'number' || label.foundedYear > new Date().getFullYear() || label.foundedYear < 1900) {
        return { isValid: false, status: 400, message: 'Invalid or future foundedYear (must be a number).' };
    }

    if (!Array.isArray(label.genres)) {
        return { isValid: false, status: 400, message: 'Genres must be an array.' };
    }
    
    return { isValid: true };
};

/////////////////////////////////////////////////////////////////////////////
// DATA VALIDATION END
//////////////////////////////////////////////////////////////////////////////

exports.getAll = async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.collection(COLLECTION_NAME).find().toArray();
        res.status(200).json({
            success: true,
            message: 'Labels retrieved successfully',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Invalid ID format'
            });
        }

        const db = getDb();
        const item = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(req.params.id) });
        
        if (!item) return res.status(404).json({ message: 'Record Label not found' }); 
        
        res.status(200).json({
            success: true,
            message: 'Labal retrieved successfully',
            data: item
        });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    const validation = validateLabelData(req.body);
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
    const validation = validateLabelData(req.body);
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
        
        if (!result.value) return res.status(404).json({ message: 'Record Label not found' }); 
        
        res.json(result.value);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Record Label not found' });
        
        res.json({ message: 'Record Label deleted successfully' });
    } catch (err) {
        next(err);
    }
};
