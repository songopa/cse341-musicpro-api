const { ObjectId } = require('mongodb');
const Artist = require('../models/Artist');

/**
 * Artist Controller - Full CRUD Operations
 * Responsible Team Member: Nehikhare Efehi (covering for Letlotlo)
 * Collection: Artists (10 fields - exceeds 7+ requirement)
 */

/**
 * @desc    Get all artists with optional filtering and pagination
 * @route   GET /api/artists
 * @access  Public
 */
const getAllArtists = async (req, res) => {
  try {
    const artist = new Artist();
    
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

    const result = await artist.findAll(filters, options);

    res.status(200).json({
      success: true,
      message: 'Artists retrieved successfully',
      data: result.artists,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error in getAllArtists:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single artist by ID
 * @route   GET /api/artists/:id
 * @access  Public
 */
const getArtistById = async (req, res) => {
  try {
    const artist = new Artist();
    const result = await artist.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Artist retrieved successfully',
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

/**
 * @desc    Create new artist
 * @route   POST /api/artists
 * @access  Private (requires authentication)
 */
const createArtist = async (req, res) => {
  try {
    const artist = new Artist();
    const result = await artist.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Artist created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in createArtist:', error);
    
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'Artist already exists',
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

/**
 * @desc    Update artist by ID
 * @route   PUT /api/artists/:id
 * @access  Private (requires authentication)
 */
const updateArtist = async (req, res) => {
  try {
    const artist = new Artist();
    const result = await artist.updateById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Artist updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateArtist:', error);
    
    if (error.message.includes('Invalid artist ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artist ID format',
        error: error.message
      });
    }
    
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    if (error.message.includes('Artist not found')) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
        error: error.message
      });
    }
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'Artist name already exists',
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

/**
 * @desc    Delete artist by ID
 * @route   DELETE /api/artists/:id
 * @access  Private (requires authentication)
 */
const deleteArtist = async (req, res) => {
  try {
    const artist = new Artist();
    const result = await artist.deleteById(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedArtist
    });
  } catch (error) {
    console.error('Error in deleteArtist:', error);
    
    if (error.message.includes('Invalid artist ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artist ID format',
        error: error.message
      });
    }
    
    if (error.message.includes('Artist not found')) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
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

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
};