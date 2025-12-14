const express = require('express');
const NewsAgent = require('../services/newsAgent');
const router = express.Router();

// Create news agent instance
const newsAgent = new NewsAgent();

/**
 * @route   POST /api/news-agent/analyze
 * @desc    Search and analyze news based on user input
 * @access  Public
 */
router.post('/analyze', async (req, res) => {
  try {
    const { userInput, language, pageSize, from, to } = req.body;

    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: 'User input is required'
      });
    }

    const result = await newsAgent.searchAndAnalyzeNews(userInput, {
      language,
      pageSize: pageSize ? parseInt(pageSize) : 15,
      from,
      to
    });

    res.json(result);
  } catch (error) {
    console.error('News agent analysis error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news-agent/fact-check
 * @desc    Fact-check a piece of news content
 * @access  Public
 */
router.post('/fact-check', async (req, res) => {
  try {
    const { newsText, sources = [] } = req.body;

    if (!newsText) {
      return res.status(400).json({
        success: false,
        message: 'News text is required for fact-checking'
      });
    }

    const result = await newsAgent.factCheck(newsText, sources);
    res.json(result);
  } catch (error) {
    console.error('Fact-check error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/news-agent/compare
 * @desc    Compare multiple news articles on the same topic
 * @access  Public
 */
router.post('/compare', async (req, res) => {
  try {
    const { topic, articles } = req.body;

    if (!topic || !articles || !Array.isArray(articles) || articles.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Topic and at least 2 articles are required for comparison'
      });
    }

    const result = await newsAgent.compareNews(topic, articles);
    res.json(result);
  } catch (error) {
    console.error('News comparison error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/news-agent/history
 * @desc    Get news agent conversation history
 * @access  Public
 */
router.get('/history', (req, res) => {
  try {
    const history = newsAgent.getHistory();
    res.json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/news-agent/history
 * @desc    Clear news agent conversation history
 * @access  Public
 */
router.delete('/history', (req, res) => {
  try {
    newsAgent.clearHistory();
    res.json({
      success: true,
      message: 'News agent history cleared successfully'
    });
  } catch (error) {
    console.error('Clear history error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;