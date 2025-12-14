const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const Verification = require('../models/Verification'); // Import the model

router.post('/', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text to verify is required.' });
  }

  // Use 'python' for Windows and pass environment variables
  const pythonProcess = spawn('python', ['../ml/src/verify_news.py'], {
    env: { ...process.env }
  });

  let resultData = '';
  let errorData = '';

  pythonProcess.stdin.write(JSON.stringify({ text }));
  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}: ${errorData}`);
      return res.status(500).json({ message: 'Error during verification', details: errorData });
    }
    
    // Log stderr as warnings, not errors (normal for debug/info messages)
    if (errorData) {
      console.log(`Python script warnings/info: ${errorData}`);
    }

    try {
      const result = JSON.parse(resultData);

      // Save the result to the database (if connected)
      try {
        const newVerification = new Verification({
          originalText: text,
          verdict: result.verdict,
          details: result.details,
          confidenceScore: result.confidence_score || 0,
          matchScore: result.match_score || 0,
          userKeywords: result.user_keywords || [],
          bestMatchSource: result.best_match_source || 'N/A',
          searchTimeframe: result.search_timeframe || '30 days',
          dateAnalysis: result.date_analysis || {},
          factualClaims: result.factual_claims || {},
          contentAnalysis: result.content_analysis || {},
          sourceCredibility: result.source_credibility || {}
        });
        await newVerification.save();
      } catch (dbError) {
        console.log('Database not available - skipping save');
      }

      res.json(result);
    } catch (parseError) {
      console.error('Error parsing Python script output:', parseError);
      res.status(500).json({ message: 'Error parsing verification result' });
    }
  });
});

module.exports = router;