# Fake News Verifier 🔍

A full-stack application for verifying news articles using AI-powered fact-checking and real-time news search.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start Guide

**New to the project?** Check out [QUICK_START.md](QUICK_START.md) for a 5-minute setup guide.

```bash
# 1. Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# 2. Install & run backend.
cd backend && npm install && npm run dev

# 3. Install & run frontend (new terminal)
cd frontend && npm install && npm run dev

# 4. Open http://localhost:5173
```

## 📋 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **ML/AI**: Python + HuggingFace
- **APIs**: SERP API (news search), HuggingFace (fact-checking)

## Features

- **Fact-Checking**: AI-powered verification using HuggingFace models
- **Real-Time News Search**: Fetches recent articles via SERP API
- **Multi-Source Analysis**: Compares claims against multiple news sources
- **Verification History**: MongoDB-backed history with localStorage fallback
- **Priority Scoring**: Ranks articles by relevance and credibility

## API Endpoints

### Fact-Check News
```bash
curl -X POST http://localhost:5001/api/news-agent/fact-check \
  -H "Content-Type: application/json" \
  -d '{"newsText": "Your claim to verify"}'
```

### Analyze News
```bash
curl -X POST http://localhost:5001/api/news-agent/analyze \
  -H "Content-Type: application/json" \
  -d '{"userInput": "Topic to search"}'
```

### Get History
```bash
curl http://localhost:5001/api/history
```

## Architecture

```
User Input → React Frontend (Port 5173)
    ↓
Express Backend (Port 5001)
    ↓
├─ NewsService (SERP API) → Fetches real news
├─ NewsAgent (HuggingFace) → AI fact-checking
└─ MongoDB → Stores verification history
```

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get running in 5 minutes
- **[API Documentation](docs/API.md)** - Complete endpoint reference
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Contributing](docs/CONTRIBUTING.md)** - How to contribute
- **[Security](SECURITY.md)** - Security best practices ⚠️

## 🔒 Security

⚠️ **IMPORTANT**: Read [SECURITY.md](SECURITY.md) for critical security information.

- Never commit `.env` files
- Rotate API keys if exposed
- Use IP whitelisting for MongoDB
- Keep dependencies updated

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) first.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- SERP API for news search capabilities
- HuggingFace for AI models
- MongoDB Atlas for database hosting
