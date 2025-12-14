const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');

/**
 * @route   GET /api/news
 * @desc    Get top general news headlines
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { country = 'us', category, pageSize = 20, page = 1 } = req.query;

    const result = await newsService.getTopHeadlines({
      country,
      category,
      pageSize: parseInt(pageSize),
      page: parseInt(page)
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching headlines:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news/search
 * @desc    Search for news based on user input
 * @access  Public
 */
router.post('/search', async (req, res) => {
  try {
    const { query, language, sortBy, pageSize, page, from, to } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const result = await newsService.searchNews(query, {
      language,
      sortBy,
      pageSize: pageSize ? parseInt(pageSize) : 20,
      page: page ? parseInt(page) : 1,
      from,
      to
    });

    res.json(result);
  } catch (error) {
    console.error('Error searching news:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news/related
 * @desc    Get news related to user input (more intelligent search)
 * @access  Public
 */
router.post('/related', async (req, res) => {
  try {
    const { userInput, language, pageSize, from, to } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await newsService.getRelatedNews(userInput, {
      language,
      pageSize: pageSize ? parseInt(pageSize) : 15,
      from,
      to
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching related news:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news/recent
 * @desc    Get recent news (last 30 days) related to user input
 * @access  Public
 */
router.post('/recent', async (req, res) => {
  try {
    const { userInput, language, pageSize, daysBack } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await newsService.getRecentNews(userInput, {
      language,
      pageSize: pageSize ? parseInt(pageSize) : 15,
      daysBack: daysBack ? parseInt(daysBack) : 30
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching recent news:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news/breaking
 * @desc    Get breaking news (last 7 days) related to user input
 * @access  Public
 */
router.post('/breaking', async (req, res) => {
  try {
    const { userInput, language, pageSize } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await newsService.getBreakingNews(userInput, {
      language,
      pageSize: pageSize ? parseInt(pageSize) : 10
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching breaking news:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news/weekly-top
 * @desc    Get top 5 prioritized news from last week (10 articles → sorted → top 5)
 * @access  Public
 */
router.post('/weekly-top', async (req, res) => {
  try {
    const { userInput, language } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await newsService.getWeeklyTopNews(userInput, {
      language: language || 'en'
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching weekly top news:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/news/date-check
 * @desc    Check current date calculation for debugging
 * @access  Public
 */
router.get('/date-check', (req, res) => {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  res.json({
    currentDate: currentDate.toISOString(),
    currentDateFormatted: currentDate.toISOString().split('T')[0],
    thirtyDaysAgo: thirtyDaysAgo.toISOString(),
    thirtyDaysAgoFormatted: thirtyDaysAgo.toISOString().split('T')[0],
    sevenDaysAgo: sevenDaysAgo.toISOString(),
    sevenDaysAgoFormatted: sevenDaysAgo.toISOString().split('T')[0],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    message: "These are the actual dates your system will use for news search"
  });
});

/**
 * @route   GET /api/news/search/:query
 * @desc    Quick search for news (GET method)
 * @access  Public
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { language, sortBy, pageSize = 20, page = 1 } = req.query;

    const result = await newsService.searchNews(query, {
      language,
      sortBy,
      pageSize: parseInt(pageSize),
      page: parseInt(page)
    });

    res.json(result);
  } catch (error) {
    console.error('Error searching news:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;