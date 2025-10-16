const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const Album = require('../models/Album')

exports.getAll = async (req, res, next) => {
    try {
        // Build filters from query parameters
        const filters = {};
        if (req.query.name) filters.name = req.query.name;
        if (req.query.country) filters.country = req.query.country;
        if (req.query.genre) filters.genre = req.query.genre;
        if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

        // Build options
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const album = new Album()
        const result = await album.findAll(filters, options);
        res.status(200).json({
            success: true,
            message: 'Albums retrieved successfully',
            data: result.albums,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const album = new Album()
        const result = await album.findById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({
            success: true,
            message: 'Album retrieved successfully',
            data: result
        });
    } catch (error) {

        if (error.message.includes('Invalid ID format')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format',
                error: error.message
            });
        }

        if (error.message.includes('Not found')) {
            return res.status(404).json({
                success: false,
                message: 'Not found',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.create = async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.collection('albums').insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.collection('albums').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body },
            { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ message: 'Not found' });
        res.json(result.value);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const db = getDb();
        const result = await db.collection('albums').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
        res.json({});
    } catch (err) {
        next(err);
    }
};
