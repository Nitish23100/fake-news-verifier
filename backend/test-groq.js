require('dotenv').config();
const Groq = require('groq-sdk');

console.log('Testing Groq API...');
console.log('API Key loaded:', process.env.GROQ_API_KEY ? 'YES (length: ' + process.env.GROQ_API_KEY.length + ')' : 'NO');
console.log('API Key starts with:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'N/A');

async function testGroq() {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    console.log('\nSending test request to Groq...');
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Hello from Groq!" in one sentence.' }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 50,
    });

    const text = completion.choices[0]?.message?.content || '';
    
    console.log('✅ SUCCESS! Response:', text);
    console.log('\n🎉 Groq API is working perfectly!');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  }
}

testGroq();
