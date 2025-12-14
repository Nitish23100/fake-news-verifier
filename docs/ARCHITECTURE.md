# System Architecture

## Overview

The Fake News Verifier is a full-stack application that combines real-time news search with AI-powered fact-checking to verify claims and news articles.

## System Components

### 1. Frontend (React + Vite)

**Location**: `frontend/src/`

**Key Components**:
- `pages/VerifyNews.jsx` - Main verification interface
- `components/NewsForm.jsx` - Input form for claims
- `components/ResultCard.jsx` - Displays verification results
- `components/HistoryList.jsx` - Shows past verifications
- `components/NewsFeed.jsx` - Latest news display
- `utils/api.js` - API client for backend communication

**State Management**: React hooks (useState, useEffect)

**Styling**: CSS with design tokens

### 2. Backend (Node.js + Express)

**Location**: `backend/`

**Server**: `server.js`
- Express app on port 5001
- CORS enabled for frontend
- MongoDB connection with graceful fallback
- Route mounting for modular endpoints

**Routes** (`routes/`):
- `newsAgent.js` - AI-powered fact-checking endpoints
- `news.js` - Direct news search
- `history.js` - Verification history CRUD
- `verify.js` - Legacy verification endpoint
- `agent.js` - Generic agent operations

**Services** (`services/`):
- `newsAgent.js` - Orchestrates fact-checking workflow
- `newsService.js` - Handles SERP API integration
- `agent.js` - Base agent class for AI interactions
- `llmService.js` - HuggingFace API wrapper

**Models** (`models/`):
- `Verification.js` - MongoDB schema for verification history

### 3. Database (MongoDB Atlas)

**Collections**:
- `verifications` - Stores verification results
  ```javascript
  {
    newsText: String,
    verdict: String,
    details: String,
    keywords: [String],
    articles: [Object],
    createdAt: Date
  }
  ```

### 4. External APIs

**SERP API**:
- Purpose: Real-time news search
- Used by: `newsService.js`
- Rate limits: Depends on plan
- Fallback: Returns empty results on failure

**HuggingFace API**:
- Purpose: AI-powered text analysis
- Used by: `llmService.js` → `agent.js` → `newsAgent.js`
- Models: Configurable (likely text generation models)
- Fallback: Returns error message

## Data Flow

### Fact-Checking Flow

```
1. User submits claim
   ↓
2. Frontend: api.verifyNews(text)
   ↓
3. Backend: POST /api/news-agent/fact-check
   ↓
4. NewsAgent.factCheck(newsText)
   ↓
5. NewsService.getWeeklyTopNews(newsText)
   ├─ Generates search queries
   ├─ Calls SERP API
   └─ Returns ranked articles
   ↓
6. NewsAgent prepares analysis prompt
   ├─ Includes article summaries
   └─ Structures verification checklist
   ↓
7. Agent.processMessage(prompt)
   ├─ Calls HuggingFace API
   └─ Returns AI analysis
   ↓
8. Save to MongoDB (Verification model)
   ↓
9. Return result to frontend
   ↓
10. Display in ResultCard component
```

### News Analysis Flow

```
1. User enters topic
   ↓
2. Frontend: api.searchRecentNews(text)
   ↓
3. Backend: POST /api/news-agent/analyze
   ↓
4. NewsAgent.searchAndAnalyzeNews(userInput)
   ↓
5. NewsService.getWeeklyTopNews(userInput)
   ├─ Multi-query search strategy
   ├─ Priority scoring algorithm
   └─ Deduplication
   ↓
6. AI analysis of aggregated news
   ↓
7. Return articles + analysis
   ↓
8. Display in NewsFeed component
```

## Key Algorithms

### 1. Search Query Generation

**Location**: `newsService.js` → `generateSearchQueries()`

**Strategy**:
- Extracts key entities and topics
- Creates variations (with/without quotes)
- Adds temporal context
- Generates related search terms

**Example**:
```
Input: "Tesla recalls 2 million vehicles"
Output: [
  "Tesla recalls 2 million vehicles",
  "Tesla vehicle recall 2024",
  "Tesla safety recall",
  "Tesla NHTSA recall"
]
```

### 2. Article Priority Scoring

**Location**: `newsService.js` → `calculateArticlePriority()`

**Factors**:
- Query term matches in title (high weight)
- Query term matches in description (medium weight)
- Source credibility (configurable)
- Recency (time decay function)
- Content completeness

**Formula**:
```
priority = titleMatches * 3 + descMatches * 2 + recencyScore + sourceScore
```

### 3. Fact-Check Analysis

**Location**: `newsAgent.js` → `factCheck()`

**Process**:
1. Break claim into verifiable points
2. Compare each point to news evidence
3. List supporting facts
4. List contradicting facts
5. Check for exaggeration/clickbait
6. Assign verdict: VERIFIED | PARTIALLY VERIFIED | UNVERIFIED | FALSE
7. Calculate confidence percentage

## Error Handling

### Graceful Degradation

1. **MongoDB Unavailable**:
   - App continues without history
   - Frontend uses localStorage fallback
   - User sees warning message

2. **SERP API Failure**:
   - Returns empty article list
   - AI analysis notes lack of evidence
   - User informed of search failure

3. **HuggingFace API Failure**:
   - Returns error message
   - Articles still displayed
   - User can retry

### Error Propagation

```
Service Layer → Route Handler → Frontend
     ↓              ↓              ↓
  try/catch    res.status(500)  ErrorAlert
```

## Security Layers

1. **Environment Variables**: Sensitive credentials isolated
2. **CORS**: Restricts frontend origin
3. **Input Validation**: Prevents injection attacks
4. **Rate Limiting**: (Recommended for production)
5. **MongoDB**: Connection string with authentication
6. **API Keys**: Separate keys for dev/prod

## Performance Optimizations

### Current

1. **Parallel Search Queries**: Multiple SERP API calls
2. **Article Deduplication**: Removes duplicate URLs
3. **Priority Sorting**: Returns most relevant first
4. **Graceful Timeouts**: Prevents hanging requests

### Recommended

1. **Redis Caching**: Cache SERP API responses (1-hour TTL)
2. **Request Queuing**: Batch HuggingFace API calls
3. **Database Indexing**: Index on `createdAt`, `newsText`
4. **CDN**: Serve frontend assets
5. **Lazy Loading**: Load history on demand

## Scalability Considerations

### Current Bottlenecks

1. **SERP API Rate Limits**: Plan-dependent
2. **HuggingFace API**: Model inference time
3. **MongoDB**: Single cluster
4. **No Caching**: Repeated searches hit APIs

### Scaling Strategy

**Horizontal Scaling**:
- Deploy multiple backend instances
- Use load balancer (Nginx/AWS ALB)
- Implement sticky sessions for WebSocket (if added)

**Vertical Scaling**:
- Upgrade MongoDB cluster tier
- Use faster HuggingFace models
- Increase API rate limits

**Caching Layer**:
```
Request → Cache Check → Cache Hit? → Return
                ↓
              Cache Miss
                ↓
          API Call → Cache Store → Return
```

## Monitoring Points

1. **API Response Times**: Track SERP/HuggingFace latency
2. **Error Rates**: Monitor 4xx/5xx responses
3. **Database Performance**: Query execution times
4. **API Quota Usage**: Track remaining limits
5. **User Metrics**: Verifications per day, popular queries

## Future Enhancements

1. **Real-Time Updates**: WebSocket for live news feeds
2. **User Accounts**: Save personal verification history
3. **Source Credibility Scoring**: Rate news sources
4. **Trend Analysis**: Identify viral misinformation
5. **Browser Extension**: Verify news while browsing
6. **Multi-Language Support**: Translate and verify
7. **Image Verification**: Reverse image search
8. **Social Media Integration**: Check viral posts
