# Contributing Guidelines

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/fake-news-verifier.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Set up environment variables (see `SECURITY.md`)
5. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Development Workflow

### Making Changes

1. **Write clean, readable code**
   - Follow existing code style
   - Add comments for complex logic
   - Use meaningful variable names

2. **Test your changes**
   - Test all affected endpoints
   - Verify frontend UI updates
   - Check error handling

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add source credibility scoring"
   git commit -m "fix: handle empty search results"
   git commit -m "docs: update API documentation"
   ```

### Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update CHANGELOG.md
4. Submit PR with clear description
5. Link related issues
6. Wait for review

## Code Style

### JavaScript/React

- Use ES6+ features
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Destructure props and objects
- Add PropTypes or TypeScript types

**Example**:
```javascript
// Good
const NewsCard = ({ title, source, publishedAt }) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString();
  
  return (
    <div className="news-card">
      <h3>{title}</h3>
      <p>{source.name} • {formattedDate}</p>
    </div>
  );
};

// Avoid
function NewsCard(props) {
  var date = new Date(props.publishedAt);
  return <div><h3>{props.title}</h3></div>;
}
```

### Backend

- Use async/await over callbacks
- Handle errors with try/catch
- Return consistent response formats
- Add JSDoc comments for functions

**Example**:
```javascript
/**
 * Searches for news articles based on query
 * @param {string} query - Search term
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Search results
 */
async searchNews(query, options = {}) {
  try {
    const results = await serpApi.search(query);
    return { success: true, articles: results };
  } catch (error) {
    console.error('Search failed:', error);
    return { success: false, message: error.message };
  }
}
```

## Project Structure

### Adding New Features

**Backend Route**:
1. Create route file in `backend/routes/`
2. Create service in `backend/services/`
3. Add model if needed in `backend/models/`
4. Mount route in `server.js`
5. Document in `docs/API.md`

**Frontend Component**:
1. Create component in `frontend/src/components/`
2. Add to relevant page in `frontend/src/pages/`
3. Update API client if needed in `frontend/src/utils/api.js`
4. Add styles following existing patterns

## Testing

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Fact-check returns results
- [ ] News search works
- [ ] History saves and loads
- [ ] Error messages display correctly
- [ ] Mobile responsive design works

### API Testing

```bash
# Test fact-check
curl -X POST http://localhost:5001/api/news-agent/fact-check \
  -H "Content-Type: application/json" \
  -d '{"newsText": "Test claim"}'

# Test news search
curl -X POST http://localhost:5001/api/news-agent/analyze \
  -H "Content-Type: application/json" \
  -d '{"userInput": "Test topic"}'

# Test history
curl http://localhost:5001/api/history
```

## Security

### Before Committing

- [ ] No API keys in code
- [ ] `.env` not committed
- [ ] No sensitive data in logs
- [ ] Input validation added
- [ ] Error messages don't leak info

### Security Checklist

1. **Never commit**:
   - `.env` files
   - API keys
   - Database credentials
   - Personal data

2. **Always validate**:
   - User inputs
   - API responses
   - Database queries
   - File uploads (if added)

3. **Use secure practices**:
   - HTTPS in production
   - Environment variables
   - Parameterized queries
   - CORS restrictions

## Documentation

### What to Document

1. **New API endpoints**: Add to `docs/API.md`
2. **Architecture changes**: Update `docs/ARCHITECTURE.md`
3. **Deployment steps**: Update `docs/DEPLOYMENT.md`
4. **Security concerns**: Update `SECURITY.md`
5. **User-facing features**: Update `README.md`

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows
- Keep examples up-to-date
- Link related documentation

## Common Issues

### Backend won't start

```bash
# Check Node version (should be 14+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat backend/.env
```

### Frontend can't connect

```bash
# Verify backend is running
curl http://localhost:5001/health

# Check CORS settings in backend/server.js
# Verify API_BASE_URL in frontend/src/utils/api.js
```

### MongoDB connection fails

```bash
# Check connection string format
# Verify IP whitelist in MongoDB Atlas
# Test connection with mongo shell
```

## Questions?

- Open an issue for bugs
- Start a discussion for feature ideas
- Check existing issues before creating new ones
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
