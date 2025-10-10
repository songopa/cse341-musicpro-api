const { MongoClient, ObjectId } = require('mongodb');

/**
 * Genre Model - 8 Fields (Exceeds 7+ Requirement)
 * Responsible Team Member: Nehikhare Efehi
 */

class Genre {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('genres');
  }

  /**
   * Create indexes for better query performance
   */
  async createIndexes() {
    await this.collection.createIndex({ name: 1 }, { unique: true });
    await this.collection.createIndex({ popularityScore: -1 });
    await this.collection.createIndex({ originDecade: 1 });
  }

  /**
   * Validate genre data (8+ fields)
   */
  validateGenre(genreData) {
    const errors = [];

    // Field 1: name (required)
    if (!genreData.name || typeof genreData.name !== 'string' || genreData.name.trim().length === 0) {
      errors.push('Genre name is required and must be a non-empty string');
    } else if (genreData.name.trim().length > 50) {
      errors.push('Genre name cannot exceed 50 characters');
    }

    // Field 2: description (required)
    if (!genreData.description || typeof genreData.description !== 'string' || genreData.description.trim().length === 0) {
      errors.push('Description is required and must be a non-empty string');
    } else if (genreData.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    // Field 3: originDecade (required, enum)
    const validDecades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
    if (!genreData.originDecade || !validDecades.includes(genreData.originDecade)) {
      errors.push(`Origin decade must be one of: ${validDecades.join(', ')}`);
    }

    // Field 4: parentGenre (optional string)
    if (genreData.parentGenre && (typeof genreData.parentGenre !== 'string' || genreData.parentGenre.trim().length === 0)) {
      errors.push('Parent genre must be a non-empty string if provided');
    }

    // Field 5: characteristics (required array)
    if (!Array.isArray(genreData.characteristics) || genreData.characteristics.length === 0) {
      errors.push('Characteristics must be a non-empty array');
    } else {
      genreData.characteristics.forEach((char, index) => {
        if (!char || typeof char !== 'string' || char.trim().length === 0) {
          errors.push(`Characteristic ${index + 1} must be a non-empty string`);
        }
      });
    }

    // Field 6: popularArtists (required array)
    if (!Array.isArray(genreData.popularArtists) || genreData.popularArtists.length === 0) {
      errors.push('Popular artists must be a non-empty array');
    } else {
      genreData.popularArtists.forEach((artist, index) => {
        if (!artist || typeof artist !== 'string' || artist.trim().length === 0) {
          errors.push(`Popular artist ${index + 1} must be a non-empty string`);
        }
      });
    }

    // Field 7: subgenres (optional array)
    if (genreData.subgenres && !Array.isArray(genreData.subgenres)) {
      errors.push('Subgenres must be an array if provided');
    }

    // Field 8: popularityScore (optional number, default 50)
    if (genreData.popularityScore !== undefined) {
      const score = Number(genreData.popularityScore);
      if (isNaN(score) || score < 1 || score > 100) {
        errors.push('Popularity score must be a number between 1 and 100');
      }
    }

    return errors;
  }

  /**
   * Prepare genre data for database insertion
   */
  prepareGenreData(genreData) {
    return {
      name: genreData.name.trim(),
      description: genreData.description.trim(),
      originDecade: genreData.originDecade,
      parentGenre: genreData.parentGenre ? genreData.parentGenre.trim() : null,
      characteristics: genreData.characteristics.map(char => char.trim()),
      popularArtists: genreData.popularArtists.map(artist => artist.trim()),
      subgenres: genreData.subgenres ? genreData.subgenres.map(sub => sub.trim()) : [],
      popularityScore: genreData.popularityScore || 50,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Create a new genre
   */
  async create(genreData) {
    const validationErrors = this.validateGenre(genreData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const preparedData = this.prepareGenreData(genreData);
    
    try {
      const result = await this.collection.insertOne(preparedData);
      return { ...preparedData, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Genre name already exists');
      }
      throw error;
    }
  }

  /**
   * Get all genres with optional filtering and pagination
   */
  async findAll(filters = {}, options = {}) {
    const query = {};
    
    // Apply filters
    if (filters.name) {
      query.name = new RegExp(filters.name, 'i');
    }
    if (filters.originDecade) {
      query.originDecade = filters.originDecade;
    }
    if (filters.parentGenre) {
      query.parentGenre = new RegExp(filters.parentGenre, 'i');
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sort = options.sortBy ? 
      { [options.sortBy]: options.sortOrder === 'desc' ? -1 : 1 } : 
      { popularityScore: -1 };

    const genres = await this.collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await this.collection.countDocuments(query);

    return {
      genres,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Find genre by ID
   */
  async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid genre ID format');
    }
    
    const genre = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!genre) {
      throw new Error('Genre not found');
    }
    
    return genre;
  }

  /**
   * Update genre by ID
   */
  async updateById(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid genre ID format');
    }

    const validationErrors = this.validateGenre(updateData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const preparedData = this.prepareGenreData(updateData);
    preparedData.updatedAt = new Date();

    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: preparedData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Genre not found');
      }

      return await this.findById(id);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Genre name already exists');
      }
      throw error;
    }
  }

  /**
   * Delete genre by ID
   */
  async deleteById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid genre ID format');
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      throw new Error('Genre not found');
    }

    return { message: 'Genre deleted successfully' };
  }
}

module.exports = Genre;
