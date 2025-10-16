const { MongoClient, ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

/**
 * Artist Model - 8 Fields (Exceeds 7+ Requirement)
 * Responsible Team Member: Nehikhare Efehi (covering for Letlotlo)
 * Note: Originally assigned to Letlotlo (Testing Lead)
 */

class Artist {
  constructor() {
    // Will be initialized when database connection is available
  }

  /**
   * Get database collection
   */
  getCollection() {
    const db = getDb();
    return db.collection('artists');
  }

  /**
   * Validate artist data (8+ fields)
   */
  validateArtist(artistData) {
    const errors = [];

    // Field 1: name (required)
    if (!artistData.name || typeof artistData.name !== 'string' || artistData.name.trim().length === 0) {
      errors.push('Artist name is required and must be a non-empty string');
    } else if (artistData.name.length > 100) {
      errors.push('Artist name cannot exceed 100 characters');
    }

    // Field 2: biography (required)
    if (!artistData.biography || typeof artistData.biography !== 'string' || artistData.biography.trim().length === 0) {
      errors.push('Artist biography is required and must be a non-empty string');
    } else if (artistData.biography.length > 1000) {
      errors.push('Artist biography cannot exceed 1000 characters');
    }

    // Field 3: genres (required array)
    if (!Array.isArray(artistData.genres) || artistData.genres.length === 0) {
      errors.push('Artist genres is required and must be a non-empty array');
    } else if (artistData.genres.some(genre => typeof genre !== 'string' || genre.trim().length === 0)) {
      errors.push('All genres must be non-empty strings');
    }

    // Field 4: activeYears (required)
    if (!artistData.activeYears || typeof artistData.activeYears !== 'string') {
      errors.push('Active years is required (e.g., "1990-2023" or "1990-present")');
    }

    // Field 5: country (required)
    if (!artistData.country || typeof artistData.country !== 'string' || artistData.country.trim().length === 0) {
      errors.push('Country is required and must be a non-empty string');
    }

    // Field 6: albums (required array)
    if (!Array.isArray(artistData.albums)) {
      errors.push('Albums must be an array');
    } else if (artistData.albums.some(album => typeof album !== 'string' || album.trim().length === 0)) {
      errors.push('All album names must be non-empty strings');
    }

    // Field 7: labels (optional array)
    if (artistData.labels && !Array.isArray(artistData.labels)) {
      errors.push('Labels must be an array');
    }

    // Field 8: socialMedia (optional object)
    if (artistData.socialMedia && typeof artistData.socialMedia !== 'object') {
      errors.push('Social media must be an object');
    }

    // Field 9: isActive (optional boolean, defaults to true)
    if (artistData.isActive !== undefined && typeof artistData.isActive !== 'boolean') {
      errors.push('isActive must be a boolean');
    }

    // Field 10: popularity (optional number, 1-100)
    if (artistData.popularity !== undefined) {
      if (typeof artistData.popularity !== 'number' || artistData.popularity < 1 || artistData.popularity > 100) {
        errors.push('Popularity must be a number between 1 and 100');
      }
    }

    return errors;
  }

  /**
   * Prepare artist data for database insertion
   */
  prepareArtistData(artistData) {
    const now = new Date();
    return {
      name: artistData.name.trim(),
      biography: artistData.biography.trim(),
      genres: artistData.genres.map(g => g.trim()),
      activeYears: artistData.activeYears.trim(),
      country: artistData.country.trim(),
      albums: artistData.albums ? artistData.albums.map(a => a.trim()) : [],
      labels: artistData.labels ? artistData.labels.map(l => l.trim()) : [],
      socialMedia: artistData.socialMedia || {},
      isActive: artistData.isActive !== undefined ? artistData.isActive : true,
      popularity: artistData.popularity || 50,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Create a new artist
   */
  async create(artistData) {
    try {
      // Validate input
      const validationErrors = this.validateArtist(artistData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const collection = this.getCollection();
      
      // Check for duplicate name
      const existingArtist = await collection.findOne({ name: new RegExp(`^${artistData.name.trim()}$`, 'i') });
      if (existingArtist) {
        throw new Error('Artist with this name already exists');
      }

      // Prepare and insert data
      const preparedData = this.prepareArtistData(artistData);
      const result = await collection.insertOne(preparedData);

      return {
        _id: result.insertedId,
        ...preparedData
      };
    } catch (error) {
      throw new Error(`Failed to create artist: ${error.message}`);
    }
  }

  /**
   * Find all artists with optional filtering
   */
  async findAll(filters = {}, options = {}) {
    try {
      const collection = this.getCollection();
      
      // Build query
      const query = {};
      if (filters.name) {
        query.name = new RegExp(filters.name, 'i');
      }
      if (filters.country) {
        query.country = new RegExp(filters.country, 'i');
      }
      if (filters.genre) {
        query.genres = { $in: [new RegExp(filters.genre, 'i')] };
      }
      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      // Pagination
      const page = parseInt(options.page) || 1;
      const limit = Math.min(parseInt(options.limit) || 10, 100);
      const skip = (page - 1) * limit;

      // Sorting
      const sortField = options.sortBy || 'name';
      const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
      const sort = { [sortField]: sortOrder };

      const artists = await collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await collection.countDocuments(query);

      return {
        artists,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch artists: ${error.message}`);
    }
  }

  /**
   * Find artist by ID
   */
  async findById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ID format', 400);
      }

      const collection = this.getCollection();
      const artist = await collection.findOne({ _id: new ObjectId(id) });

      if (!artist || artist == null) {
        throw new Error('Not found', 404);
      }

      return artist;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Update artist by ID
   */
  async updateById(id, updateData) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid artist ID format');
      }

      // Remove fields that shouldn't be updated
      const { _id, createdAt, ...dataToUpdate } = updateData;

      // Validate update data
      const validationErrors = this.validateArtist(dataToUpdate);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const collection = this.getCollection();

      // Check if artist exists
      const existingArtist = await collection.findOne({ _id: new ObjectId(id) });
      if (!existingArtist) {
        throw new Error('Artist not found');
      }

      // Check for duplicate name (excluding current artist)
      if (dataToUpdate.name) {
        const duplicateArtist = await collection.findOne({
          name: new RegExp(`^${dataToUpdate.name.trim()}$`, 'i'),
          _id: { $ne: new ObjectId(id) }
        });
        if (duplicateArtist) {
          throw new Error('Artist with this name already exists');
        }
      }

      // Prepare update data
      const preparedData = this.prepareArtistData({ ...existingArtist, ...dataToUpdate });
      delete preparedData.createdAt; // Preserve original creation date

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: preparedData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Artist not found');
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update artist: ${error.message}`);
    }
  }

  /**
   * Delete artist by ID
   */
  async deleteById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid artist ID format');
      }

      const collection = this.getCollection();
      
      // Check if artist exists
      const existingArtist = await collection.findOne({ _id: new ObjectId(id) });
      if (!existingArtist) {
        throw new Error('Artist not found');
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        throw new Error('Artist not found');
      }

      return { message: 'Artist deleted successfully', deletedArtist: existingArtist };
    } catch (error) {
      throw new Error(`Failed to delete artist: ${error.message}`);
    }
  }
}

module.exports = Artist;