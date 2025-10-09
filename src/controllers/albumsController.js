const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

exports.getAll = async (req, res, next) => {
    try {
        const db = getDb();
        const items = await db.collection('albums').find().limit(100).toArray();
        res.json(items);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const db = getDb();
        const item = await db.collection('albums').findOne({ _id: new ObjectId(req.params.id) });
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
    } catch (err) {
        next(err);
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
