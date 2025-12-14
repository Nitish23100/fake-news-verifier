const Groq = require('groq-sdk');

class LLMService {
  constructor() {
    // Using Groq with Llama 3.1 - Fast, free, and reliable
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GROQ_API_KEY not found in environment variables');
      console.log('📝 Get your free API key at: https://console.groq.com/keys');
      throw new Error('GROQ_API_KEY is required');
    }
    
    this.groq = new Groq({ apiKey });
    this.model = 'llama-3.3-70b-versatile';
    
    console.log('✅ LLM Service initialized with Groq (Llama 3.3 70B)');
  }

  async generateResponse(prompt, options = {}) {
    const {
      maxTokens = 1000,
      temperature = 0.7
    } = options;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const text = completion.choices[0]?.message?.content || '';

      return {
        success: true,
        data: text,
        model: this.model,
        provider: 'groq'
      };
    } catch (error) {
      console.error('Groq API Error:', error.message);

      return {
        success: false,
        error: `AI API error: ${error.message}. Please check your API key.`
      };
    }
  }

  async chatCompletion(messages, options = {}) {
    // Convert messages to a single prompt
    const prompt = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => msg.content)
      .join('\n\n');
    
    return this.generateResponse(prompt, options);
  }
}

module.exports = new LLMService();
