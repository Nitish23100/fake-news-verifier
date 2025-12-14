const express = require('express');
const router = express.Router();
const Verification = require('../models/Verification');

/**
 * @route   GET /api/history
 * @desc    Get all verification records, sorted by most recent
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const history = await Verification.find({}).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({ message: 'Server error while fetching history.' });
  }
});

module.exports = router;