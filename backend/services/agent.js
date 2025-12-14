const llmService = require('./llmService');

class Agent {
  constructor(name = 'Assistant', systemPrompt = '') {
    this.name = name;
    this.systemPrompt = systemPrompt || 'You are a helpful AI assistant.';
    this.conversationHistory = [];
  }

  async processMessage(userMessage, options = {}) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Prepare messages for LLM
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
      ];

      // Get response from LLM
      const response = await llmService.chatCompletion(messages, options);

      if (response.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data,
          timestamp: new Date()
        };

        // Add assistant response to history
        this.conversationHistory.push(assistantMessage);

        return {
          success: true,
          message: response.data,
          agent: this.name,
          model: response.model
        };
      } else {
        return {
          success: false,
          error: response.error
        };
      }
    } catch (error) {
      console.error('Agent processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }
}

module.exports = Agent;