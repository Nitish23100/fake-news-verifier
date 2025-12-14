const express = require('express');
const Agent = require('../services/agent');
const router = express.Router();

// Create different agent instances
const agents = {
  general: new Agent('General Assistant', 'You are a helpful AI assistant that can answer questions and help with various tasks.'),
  newsAnalyzer: new Agent('News Analyzer', 'You are a news analysis expert. Analyze news articles for credibility, bias, and factual accuracy. Provide detailed analysis in JSON format.'),
  coder: new Agent('Code Assistant', 'You are a programming expert. Help with coding questions, debug issues, and provide code examples.')
};

// Chat with agent
router.post('/chat', async (req, res) => {
  try {
    const { message, agentType = 'general', options = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const agent = agents[agentType];
    if (!agent) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }

    const response = await agent.processMessage(message, options);
    res.json(response);
  } catch (error) {
    console.error('Agent chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent conversation history
router.get('/history/:agentType', (req, res) => {
  try {
    const { agentType } = req.params;
    const agent = agents[agentType];
    
    if (!agent) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }

    res.json({
      agentType,
      history: agent.getHistory()
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear agent history
router.delete('/history/:agentType', (req, res) => {
  try {
    const { agentType } = req.params;
    const agent = agents[agentType];
    
    if (!agent) {
      return res.status(400).json({ error: 'Invalid agent type' });
    }

    agent.clearHistory();
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test LLM connection
router.get('/test', async (req, res) => {
  try {
    const testAgent = new Agent('Test Agent', 'You are a test assistant. Respond with a simple greeting.');
    const response = await testAgent.processMessage('Hello, are you working?');
    
    res.json({
      status: 'LLM connection test',
      ...response
    });
  } catch (error) {
    console.error('LLM test error:', error);
    res.status(500).json({ 
      status: 'LLM connection test failed',
      error: error.message 
    });
  }
});

module.exports = router;