# Deployment Guide

## Pre-Deployment Checklist

- [ ] Rotate all API keys from development
- [ ] Set up production MongoDB cluster
- [ ] Configure CORS for production domain
- [ ] Set up environment variables on hosting platform
- [ ] Enable MongoDB IP whitelisting
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Add authentication (recommended)

## Environment Variables

### Required for Backend

```bash
PORT=5001
SERP_API_KEY=your_production_key
HUGGINGFACE_API_KEY=your_production_key
MONGO_URI=your_production_mongodb_uri
NODE_ENV=production
```

### Required for Frontend

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Backend Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SERP_API_KEY=your_key
heroku config:set HUGGINGFACE_API_KEY=your_key
heroku config:set MONGO_URI=your_uri

# Deploy
git subtree push --prefix backend heroku main
```

### Option 2: Railway

1. Connect your GitHub repository
2. Select the `backend` folder as root
3. Add environment variables in dashboard
4. Deploy automatically on push

### Option 3: DigitalOcean App Platform

1. Create new app from GitHub
2. Set build command: `cd backend && npm install`
3. Set run command: `node server.js`
4. Add environment variables
5. Deploy

## Frontend Deployment

### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Set environment variables in Vercel dashboard
```

### Option 2: Netlify

```bash
# Build the frontend
cd frontend
npm run build

# Deploy dist folder via Netlify CLI or drag-and-drop
```

### Option 3: GitHub Pages

```bash
# Update vite.config.js with base path
# Build and deploy to gh-pages branch
npm run build
npx gh-pages -d dist
```

## Database Setup (MongoDB Atlas)

1. Create production cluster
2. Set up database user with strong password
3. Configure IP whitelist (0.0.0.0/0 for cloud hosting)
4. Enable connection pooling
5. Set up automated backups
6. Monitor performance metrics

## Security Hardening

### Backend

1. **Add rate limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

2. **Add helmet for security headers**:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. **Configure CORS properly**:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

4. **Add request validation**:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/news-agent/fact-check',
  body('newsText').isString().isLength({ min: 10, max: 5000 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of handler
  }
);
```

### Frontend

1. **Update API base URL**:
```javascript
// frontend/src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
```

2. **Add error boundaries**
3. **Implement CSP headers**
4. **Sanitize user inputs**

## Monitoring

### Recommended Tools

- **Backend**: New Relic, Datadog, or Sentry
- **Database**: MongoDB Atlas built-in monitoring
- **Uptime**: UptimeRobot or Pingdom
- **Logs**: Papertrail or Loggly

### Health Check Endpoint

Add to `backend/server.js`:
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Scaling Considerations

1. **Caching**: Implement Redis for API response caching
2. **CDN**: Use Cloudflare for frontend assets
3. **Load Balancing**: Use platform-provided load balancers
4. **Database**: Enable MongoDB sharding for large datasets
5. **API Optimization**: Implement request queuing for external APIs

## Rollback Plan

1. Keep previous deployment tagged in git
2. Document rollback commands for your platform
3. Test rollback procedure in staging
4. Monitor error rates after deployment

## Post-Deployment

- [ ] Test all API endpoints
- [ ] Verify database connections
- [ ] Check error logging
- [ ] Monitor API rate limits
- [ ] Set up alerts for downtime
- [ ] Document production URLs
- [ ] Update README with live demo link
