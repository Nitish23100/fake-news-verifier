require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const newsRoutes = require('./routes/news');
const verifyRoute = require('./routes/verify');
const historyRoute = require('./routes/history'); // Import history route
const agentRoute = require('./routes/agent'); // Import agent route
const newsAgentRoute = require('./routes/newsAgent'); // Import news agent route

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Continuing without database - verification will work but history won\'t be saved');
  }
};

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' })); // Frontend port
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Mount API routes
app.use('/api/news', newsRoutes);
app.use('/api/verify', verifyRoute);
app.use('/api/history', historyRoute); // Use the new history route
app.use('/api/agent', agentRoute); // Use the new agent route
app.use('/api/news-agent', newsAgentRoute); // Use the new news agent route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});