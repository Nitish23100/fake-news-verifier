# API Documentation

## Base URL
```
http://localhost:5001/api
```

## Endpoints

### 1. Fact-Check News

Verifies a news claim against recent credible sources.

**Endpoint**: `POST /news-agent/fact-check`

**Request Body**:
```json
{
  "newsText": "The claim you want to verify"
}
```

**Response**:
```json
{
  "success": true,
  "originalText": "The claim you want to verify",
  "factCheckReport": "Detailed AI analysis...",
  "newsArticlesFound": 5,
  "totalArticlesFound": 12,
  "uniqueArticlesFound": 8,
  "searchQueries": ["query1", "query2"],
  "searchPeriod": { "daysBack": 3 },
  "timestamp": "2025-10-22T..."
}
```

### 2. Analyze News Topic

Searches and analyzes recent news about a topic.

**Endpoint**: `POST /news-agent/analyze`

**Request Body**:
```json
{
  "userInput": "Topic to search for"
}
```

**Response**:
```json
{
  "success": true,
  "query": "Topic to search for",
  "totalArticlesFound": 15,
  "articlesAnalyzed": 10,
  "articles": [
    {
      "title": "Article headline",
      "source": { "name": "News Source" },
      "publishedAt": "2025-10-22T...",
      "description": "Article description",
      "url": "https://...",
      "priority": 8.5
    }
  ],
  "aiAnalysis": "Detailed analysis...",
  "searchQueries": ["query1", "query2"],
  "searchPeriod": { "daysBack": 7 }
}
```

### 3. Get Verification History

Retrieves past verification results.

**Endpoint**: `GET /history`

**Query Parameters**:
- `limit` (optional): Number of results (default: 50)

**Response**:
```json
[
  {
    "_id": "...",
    "newsText": "Verified claim",
    "verdict": "VERIFIED",
    "details": "Analysis details",
    "keywords": ["keyword1", "keyword2"],
    "articles": [...],
    "createdAt": "2025-10-22T..."
  }
]
```

### 4. Search News

Direct news search without AI analysis.

**Endpoint**: `POST /news/search`

**Request Body**:
```json
{
  "query": "Search term",
  "options": {
    "daysBack": 7,
    "maxResults": 10
  }
}
```

**Response**:
```json
{
  "success": true,
  "articles": [...],
  "totalResults": 25
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details (dev mode only)"
}
```

**Common Status Codes**:
- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `500`: Server error
- `503`: External API unavailable

## Rate Limits

Rate limits depend on your API provider plans:
- **SERP API**: Check your plan limits
- **HuggingFace**: Varies by model and plan

## Authentication

Currently no authentication required. Consider adding API keys for production deployment.
