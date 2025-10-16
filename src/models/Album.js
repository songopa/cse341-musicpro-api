const Joi = require('joi');
const { ObjectId } = require('mongodb');

/**
 * Album Model - Full CRUD with Validation 
 * Responsible Team Member: Julius Songopa
 */

class Album {
    constructor() {
        // Initialization if needed
    }
    getCollection() {
        const { getDb } = require('../config/db');
        const db = getDb();
        return db.collection('albums');
    }
    /**
     * Validate album data using Joi(8+ fields)
     */
    validateAlbum(albumData) {
        const errors = [];
        const schema = Joi.object({
            title: Joi.string().max(100).required(),
            artist: Joi.string().max(100).required(),
            releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
            genre: Joi.string().max(50).required(),
            label: Joi.string().max(100).allow(null, ''),
            trackCount: Joi.number().integer().min(1).required(),
            duration: Joi.number().integer().min(1).required(),
            coverImageUrl: Joi.string().uri().allow(null, ''),
            description: Joi.string().max(1000).allow(null, ''),
            isCompilation: Joi.boolean().default(false)
        })
        const { error } = schema.validate(albumData, { abortEarly: false });
        if (error) {
            error.details.forEach(detail => {
                errors.push(detail.message);
            });
        }
        return errors;
    }
    /**
     * Prepare album data for database insertion
     */
    prepareAlbumData(albumData) {
        const now = new Date();
        return {
            title: albumData.title.trim(),
            artist: albumData.artist.trim(),
            releaseYear: albumData.releaseYear,
            genre: albumData.genre.trim(),
            label: albumData.label ? albumData.label.trim() : null,
            trackCount: albumData.trackCount,
            duration: albumData.duration,
            coverImageUrl: albumData.coverImageUrl ? albumData.coverImageUrl.trim() : null,
            description: albumData.description ? albumData.description.trim() : null,
            isCompilation: albumData.isCompilation !== undefined ? albumData.isCompilation : false,
            createdAt: now,
            updatedAt: now
        };
    }
    /**
     * Create a new album
     */
    async create(albumData) {
        try {
            // Validate input
            const validationErrors = this.validateAlbum(albumData);
            if (validationErrors.length > 0) {
                return { success: false, errors: validationErrors };
            }
            // Prepare data
            const preparedData = this.prepareAlbumData(albumData);
            // Insert into database
            const collection = this.getCollection();
            const result = await collection.insertOne(preparedData);
            return { success: true, album: { ...preparedData, _id: result.insertedId } };
        } catch (error) {
            return { success: false, errors: [error.message] };
        }
    }
    /**
     *Find all albums with optional sort and pagination
     */
    async findAll(filters = {}, options = {}) {
        try {
            const collection = this.getCollection();
            const query = {};
            // Apply filters
            if (filters.genre) {
                query.genre = new RegExp(`^${filters.genre.trim()}$`, 'i');
            }
            if (filters.releaseYear) {
                query.releaseYear = filters.releaseYear;
            }
            if (filters.artist) {
                query.artist = new RegExp(`^${filters.artist.trim()}$`, 'i');
            }
            if (filters.label) {
                query.label = new RegExp(`^${filters.label.trim()}$`, 'i');
            }
           
            // Pagination
            const page = parseInt(options.page) || 1;
            const limit = Math.min(parseInt(options.limit) || 10, 100);
            const skip = (page - 1) * limit;
            // Sorting
            const sortField = options.sortBy || 'name';
            const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
            const sort = { [sortField]: sortOrder };
            // Fetch data
            const albums = await collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
            const total = await collection.countDocuments(query);
            return {
                albums,
                pagination: { currentPage: page, pageSize: limit, total: total, totalPages: Math.ceil(total / limit) }
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Find album by ID
     */
    async findById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ID format', 400);
            }
            const collection = this.getCollection();
            
            const album = await collection.findOne({ _id: new ObjectId(id) });
            if (!album) {
               throw new Error ('Not found', 404);
            }
            return album;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *Find albums by artist
    */
    async findByArtist(artistName) {
        try {
            const collection = this.getCollection();
            const albums = await collection.find({ artist: new RegExp(`^${artistName.trim()}$`, 'i') }).toArray();
            return { success: true, albums };
        } catch (error) {
            return { success: false, errors: [error.message] };
        }
    }
    /**
     * Update album by ID
     */
    async update(albumId, updateData) {
        try {
            // Validate input
            const validationErrors = this.validateAlbum(updateData);
            if (validationErrors.length > 0) {
                return { success: false, errors: validationErrors };
            }

            const collection = this.getCollection();
            const existingAlbum = await collection.findOne({ _id: new ObjectId(albumId) });
            if (!existingAlbum) {
                return { success: false, errors: ['Album not found'] };
            }
            // Prepare updated data
            const preparedData = this.prepareAlbumData(updateData);
            preparedData.updatedAt = new Date();
            // Update in database
            await collection.updateOne({ _id: new ObjectId(albumId) }, { $set: preparedData });
            return { success: true, album: { ...existingAlbum, ...preparedData, _id: existingAlbum._id } };
        } catch (error) {
            return { success: false, errors: [error.message] };
        }
    }
    /**
     * Delete album by ID
     */
    async delete(albumId) {
        try {
            const collection = this.getCollection();
            const result = await collection.deleteOne({ _id: new ObjectId(albumId) });
            if (result.deletedCount === 0) {
                return { success: false, errors: ['Album not found'] };
            }
            return { success: true };
        } catch (error) {
            return { success: false, errors: [error.message] };
        }
    }

    
}

module.exports = Album;