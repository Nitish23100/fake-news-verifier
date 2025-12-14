require('dotenv').config();
const llmService = require('./services/llmService');

console.log('Testing LLM Service...\n');

async function testLLMService() {
  try {
    console.log('Test 1: Simple prompt');
    const result1 = await llmService.generateResponse('What is 2+2? Answer in one sentence.');
    console.log('Success:', result1.success);
    console.log('Response:', result1.data);
    console.log('Model:', result1.model);
    console.log('Provider:', result1.provider);
    
    console.log('\n---\n');
    
    console.log('Test 2: News verification prompt');
    const result2 = await llmService.generateResponse(
      'Analyze this claim: "The Earth is flat." Is this true or false? Provide a brief analysis.',
      { maxTokens: 200 }
    );
    console.log('Success:', result2.success);
    console.log('Response:', result2.data);
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLLMService();
