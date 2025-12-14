# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Security
- Created `.env.example` template for safe credential sharing
- Added comprehensive `SECURITY.md` with key rotation instructions
- Updated `.gitignore` to exclude all sensitive files and unwanted artifacts
- Documented security best practices in deployment guide

### Documentation
- Created `docs/API.md` - Complete API endpoint documentation
- Created `docs/ARCHITECTURE.md` - System architecture and data flow
- Created `docs/DEPLOYMENT.md` - Production deployment guide
- Created `docs/CONTRIBUTING.md` - Contribution guidelines
- Updated `README.md` with better project overview and quick start

### Cleanup
- Removed misplaced C++ competitive programming files (`dhehf.cpp`, `cc.cpp`)
- Removed `.cph/` directories and `.prob` files
- Cleaned up frontend directory structure

### Changed
- Updated `.gitignore` to exclude Python virtual environments
- Updated `.gitignore` to exclude competitive programming artifacts
- Improved README with architecture diagram and feature list

## [1.0.0] - Initial Release

### Added
- Full-stack fake news verification system
- React frontend with Vite
- Express backend with MongoDB
- SERP API integration for news search
- HuggingFace API integration for AI fact-checking
- Verification history with MongoDB storage
- Multi-query search strategy
- Article priority scoring algorithm
- AI-powered fact-check analysis
- News feed component
- Responsive UI design

### Features
- Fact-check news claims against recent sources
- Search and analyze news topics
- View verification history
- Compare multiple news sources
- Priority-ranked article results
- Graceful error handling
- MongoDB fallback to localStorage
