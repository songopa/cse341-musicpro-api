const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

/**
 * Genre Controller - Full CRUD Operations
 * Responsible Team Member: Nehikhare Efehi
 * Collection: Genres (8+ fields - exceeds 7+ requirement)
 */

/**
 * @desc    Get all genres with optional filtering and pagination
 * @route   GET /api/genres
 * @access  Public
 */
const getAllGenres = async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('genres');
    
    // Build query filters
    const query = {};
    if (req.query.name) {
      query.name = new RegExp(req.query.name, 'i');
    }
    if (req.query.originDecade) {
      query.originDecade = req.query.originDecade;
    }
    if (req.query.parentGenre) {
      query.parentGenre = new RegExp(req.query.parentGenre, 'i');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortField = req.query.sortBy || 'popularityScore';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const genres = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await collection.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Genres retrieved successfully',
      data: genres,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch genres',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single genre by ID
 * @route   GET /api/genres/:id
 * @access  Public
 */
const getGenreById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid genre ID format'
      });
    }

    const db = getDb();
    const genre = await db.collection('genres').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!genre) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Genre not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Genre retrieved successfully',
      data: genre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch genre',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Validate genre data (8+ fields)
 */
const validateGenre = (genreData) => {
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
};

/**
 * @desc    Create new genre
 * @route   POST /api/genres
 * @access  Private (requires authentication)
 */
const createGenre = async (req, res) => {
  try {
    // Extract genre data from request body
    const genreData = {
      name: req.body.name,
      description: req.body.description,
      originDecade: req.body.originDecade,
      parentGenre: req.body.parentGenre,
      characteristics: req.body.characteristics,
      popularArtists: req.body.popularArtists,
      subgenres: req.body.subgenres || [],
      popularityScore: req.body.popularityScore || 50
    };

    // Validate data
    const validationErrors = validateGenre(genreData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Validation failed',
        details: validationErrors
      });
    }

    // Prepare data for insertion
    const preparedData = {
      name: genreData.name.trim(),
      description: genreData.description.trim(),
      originDecade: genreData.originDecade,
      parentGenre: genreData.parentGenre ? genreData.parentGenre.trim() : null,
      characteristics: genreData.characteristics.map(char => char.trim()),
      popularArtists: genreData.popularArtists.map(artist => artist.trim()),
      subgenres: genreData.subgenres.map(sub => sub.trim()),
      popularityScore: genreData.popularityScore,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = getDb();
    const result = await db.collection('genres').insertOne(preparedData);

    res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: { ...preparedData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating genre:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Genre name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create genre',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update genre by ID
 * @route   PUT /api/genres/:id
 * @access  Private (requires authentication)
 */
const updateGenre = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid genre ID format'
      });
    }

    // Extract update data from request body
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      originDecade: req.body.originDecade,
      parentGenre: req.body.parentGenre,
      characteristics: req.body.characteristics,
      popularArtists: req.body.popularArtists,
      subgenres: req.body.subgenres,
      popularityScore: req.body.popularityScore
    };

    // Validate data
    const validationErrors = validateGenre(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Validation failed',
        details: validationErrors
      });
    }

    // Prepare data for update
    const preparedData = {
      name: updateData.name.trim(),
      description: updateData.description.trim(),
      originDecade: updateData.originDecade,
      parentGenre: updateData.parentGenre ? updateData.parentGenre.trim() : null,
      characteristics: updateData.characteristics.map(char => char.trim()),
      popularArtists: updateData.popularArtists.map(artist => artist.trim()),
      subgenres: updateData.subgenres ? updateData.subgenres.map(sub => sub.trim()) : [],
      popularityScore: updateData.popularityScore || 50,
      updatedAt: new Date()
    };

    const db = getDb();
    const result = await db.collection('genres').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: preparedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Genre not found'
      });
    }

    const updatedGenre = await db.collection('genres').findOne({ _id: new ObjectId(req.params.id) });

    res.status(200).json({
      success: true,
      message: 'Genre updated successfully',
      data: updatedGenre
    });
  } catch (error) {
    console.error('Error updating genre:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Genre name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update genre',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete genre by ID
 * @route   DELETE /api/genres/:id
 * @access  Private (requires authentication)
 */
const deleteGenre = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid genre ID format'
      });
    }

    const db = getDb();
    const result = await db.collection('genres').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Genre not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Genre deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete genre',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
};
