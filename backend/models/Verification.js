const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  confidenceScore: {
    type: Number,
    default: 0,
  },
  matchScore: {
    type: Number,
    default: 0,
  },
  userKeywords: {
    type: [String],
    default: [],
  },
  bestMatchSource: {
    type: String,
    default: 'N/A',
  },
  searchTimeframe: {
    type: String,
    default: '30 days',
  },
  dateAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  factualClaims: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  contentAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  sourceCredibility: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // This automatically adds `createdAt` and `updatedAt` timestamps
}, { timestamps: true });

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;