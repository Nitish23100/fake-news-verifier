const axios = require('axios');

class NewsService {
    constructor() {
        this.apiKey = process.env.SERP_API_KEY;
        this.baseURL = 'https://serpapi.com/search';
    }

    async searchNews(query, options = {}) {
        const {
            language = 'en',
            sortBy = 'date', // date, relevance
            pageSize = 20,
            page = 1,
            from = null, // Date from (YYYY-MM-DD)
            to = null    // Date to (YYYY-MM-DD)
        } = options;

        if (!this.apiKey) {
            throw new Error('SerpAPI key is not configured');
        }

        if (!query || query.trim() === '') {
            throw new Error('Search query is required');
        }

        try {
            // Build SerpAPI parameters for Google News search
            const params = {
                engine: 'google',
                tbm: 'nws', // News search
                q: query,
                api_key: this.apiKey,
                num: Math.min(pageSize, 100), // SerpAPI max is 100
                start: (page - 1) * pageSize,
                hl: language,
                gl: language === 'en' ? 'us' : 'in', // Country code
                sort: sortBy === 'publishedAt' ? 'date' : 'relevance'
            };

            // Add date range if provided
            if (from && to) {
                const fromDate = new Date(from);
                const toDate = new Date(to);
                params.tbs = `cdr:1,cd_min:${fromDate.getMonth() + 1}/${fromDate.getDate()}/${fromDate.getFullYear()},cd_max:${toDate.getMonth() + 1}/${toDate.getDate()}/${toDate.getFullYear()}`;
            }

            const response = await axios.get(this.baseURL, { params });

            const newsResults = response.data.news_results || [];

            return {
                success: true,
                query: query,
                totalResults: newsResults.length,
                articles: newsResults.map(article => ({
                    title: article.title || 'No title',
                    description: article.snippet || article.summary || 'No description',
                    content: article.snippet || article.summary || '',
                    url: article.link,
                    urlToImage: article.thumbnail || null,
                    publishedAt: this.parseDate(article.date) || new Date().toISOString(),
                    source: {
                        name: article.source || 'Unknown Source',
                        id: article.source?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
                    },
                    author: article.author || null
                })),
                searchParams: {
                    query,
                    language,
                    sortBy,
                    pageSize,
                    page
                }
            };
        } catch (error) {
            console.error('SerpAPI Error:', error.response?.data || error.message);

            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            if (error.response?.status === 401) {
                throw new Error('Invalid SerpAPI key');
            }

            throw new Error(`Failed to fetch news: ${error.response?.data?.error || error.message}`);
        }
    }

    parseDate(dateString) {
        if (!dateString) return null;

        try {
            // Handle various date formats from Google News
            if (dateString.includes('ago')) {
                // Handle "2 hours ago", "1 day ago", etc.
                const now = new Date();
                const match = dateString.match(/(\d+)\s+(minute|hour|day|week)s?\s+ago/i);
                if (match) {
                    const value = parseInt(match[1]);
                    const unit = match[2].toLowerCase();

                    switch (unit) {
                        case 'minute':
                            now.setMinutes(now.getMinutes() - value);
                            break;
                        case 'hour':
                            now.setHours(now.getHours() - value);
                            break;
                        case 'day':
                            now.setDate(now.getDate() - value);
                            break;
                        case 'week':
                            now.setDate(now.getDate() - (value * 7));
                            break;
                    }
                    return now.toISOString();
                }
            }

            // Try to parse as regular date
            const parsed = new Date(dateString);
            return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    }

    async getTopHeadlines(options = {}) {
        const {
            country = 'us',
            category = null, // business, entertainment, general, health, science, sports, technology
            pageSize = 20,
            page = 1
        } = options;

        if (!this.apiKey) {
            throw new Error('SerpAPI key is not configured');
        }

        try {
            // Use SerpAPI to get top news headlines
            const params = {
                engine: 'google',
                tbm: 'nws', // News search
                q: category ? `${category} news` : 'latest news',
                api_key: this.apiKey,
                num: Math.min(pageSize, 100),
                start: (page - 1) * pageSize,
                gl: country,
                sort: 'date'
            };

            const response = await axios.get(this.baseURL, { params });
            const newsResults = response.data.news_results || [];

            return {
                success: true,
                totalResults: newsResults.length,
                articles: newsResults.map(article => ({
                    title: article.title || 'No title',
                    description: article.snippet || article.summary || 'No description',
                    content: article.snippet || article.summary || '',
                    url: article.link,
                    urlToImage: article.thumbnail || null,
                    publishedAt: this.parseDate(article.date) || new Date().toISOString(),
                    source: {
                        name: article.source || 'Unknown Source',
                        id: article.source?.toLowerCase().replace(/\s+/g, '-') || 'unknown'
                    },
                    author: article.author || null
                }))
            };
        } catch (error) {
            console.error('SerpAPI Error:', error.response?.data || error.message);
            throw new Error(`Failed to fetch headlines: ${error.response?.data?.error || error.message}`);
        }
    }



    calculateArticlePriority(article, query) {
        let priority = 0;
        const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);

        // Normalize names for better matching
        const normalizedQuery = query.toLowerCase()
            .replace(/disha patni/g, 'disha patani')
            .replace(/patni/g, 'patani');

        const titleLower = (article.title || '').toLowerCase();
        const descLower = (article.description || '').toLowerCase();
        const contentLower = (article.content || '').toLowerCase();

        // Celebrity name matching (highest priority)
        if (titleLower.includes('disha patani') || titleLower.includes('disha patni')) {
            priority += 25;
        }
        if (descLower.includes('disha patani') || descLower.includes('disha patni')) {
            priority += 15;
        }

        // Incident keywords
        const incidentKeywords = ['firing', 'shooting', 'gunshots', 'attack', 'incident', 'security'];
        incidentKeywords.forEach(keyword => {
            if (titleLower.includes(keyword)) priority += 15;
            if (descLower.includes(keyword)) priority += 10;
        });

        // Location keywords
        const locationKeywords = ['home', 'residence', 'house', 'apartment'];
        locationKeywords.forEach(keyword => {
            if (titleLower.includes(keyword)) priority += 10;
            if (descLower.includes(keyword)) priority += 5;
        });

        // General query word matching
        queryWords.forEach(word => {
            if (titleLower.includes(word)) priority += 8;
            if (descLower.includes(word)) priority += 4;
        });

        // Source credibility bonus (Indian sources for Indian celebrity news)
        const credibleSources = [
            'times of india', 'hindustan times', 'india today', 'ndtv', 'zee news',
            'aaj tak', 'news18', 'republic', 'the hindu', 'indian express',
            'reuters', 'bbc', 'cnn', 'guardian', 'associated press'
        ];
        const sourceName = (article.source.name || '').toLowerCase();
        if (credibleSources.some(source => sourceName.includes(source))) {
            priority += 20;
        }

        // Extra bonus for Indian entertainment/news sources
        const entertainmentSources = ['bollywood hungama', 'pinkvilla', 'filmfare', 'etimes'];
        if (entertainmentSources.some(source => sourceName.includes(source))) {
            priority += 15;
        }

        // Recency bonus (critical for breaking news)
        const articleDate = new Date(article.publishedAt);
        const now = new Date();
        const hoursAgo = (now - articleDate) / (1000 * 60 * 60);

        if (hoursAgo <= 6) priority += 30;       // Last 6 hours - breaking news
        else if (hoursAgo <= 24) priority += 25; // Last 24 hours
        else if (hoursAgo <= 48) priority += 20; // Last 2 days
        else if (hoursAgo <= 72) priority += 15; // Last 3 days

        // Content quality bonus
        if (article.description && article.description.length > 150) {
            priority += 8;
        }
        if (article.content && article.content.length > 500) {
            priority += 5;
        }

        return priority;
    }

    generateSearchQueries(userInput) {
        // Create multiple search variations for better results
        const queries = [];

        // Original query
        queries.push(userInput);

        // Handle common name variations
        let processedInput = userInput;

        // Fix common misspellings and variations
        processedInput = processedInput.replace(/disha patni/gi, 'Disha Patani');
        processedInput = processedInput.replace(/patni/gi, 'Patani');

        // Add corrected version if different
        if (processedInput !== userInput) {
            queries.push(processedInput);
        }

        // Add keyword variations
        if (userInput.toLowerCase().includes('firing')) {
            queries.push(processedInput.replace(/firing/gi, 'shooting'));
            queries.push(processedInput.replace(/firing/gi, 'gunshots'));
            queries.push(processedInput.replace(/firing/gi, 'attack'));
        }

        // Add location-specific searches
        if (userInput.toLowerCase().includes('home')) {
            queries.push(processedInput.replace(/home/gi, 'residence'));
            queries.push(processedInput.replace(/home/gi, 'house'));
        }

        return [...new Set(queries)]; // Remove duplicates
    }

    async getWeeklyTopNews(userInput, options = {}) {
        // Calculate date range for last 3 days (more recent for breaking news)
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 3); // Changed to 3 days for recent incidents

        const from = fromDate.toISOString().split('T')[0];
        const to = toDate.toISOString().split('T')[0];

        // Generate multiple search queries
        const searchQueries = this.generateSearchQueries(userInput);

        let allArticles = [];

        // Search with each query variation
        for (const query of searchQueries) {
            try {
                const result = await this.searchNews(query, {
                    sortBy: 'publishedAt', // Sort by most recent first for breaking news
                    pageSize: 15,
                    from: from,
                    to: to,
                    language: 'en',
                    ...options
                });

                if (result.success && result.articles) {
                    allArticles.push(...result.articles);
                }
            } catch (error) {
                // Search failed, continue with other queries
            }
        }

        // If no recent articles, expand search to last 7 days
        if (allArticles.length === 0) {
            fromDate.setDate(fromDate.getDate() - 4); // Total 7 days
            const expandedFrom = fromDate.toISOString().split('T')[0];

            for (const query of searchQueries) {
                try {
                    const result = await this.searchNews(query, {
                        sortBy: 'publishedAt',
                        pageSize: 15,
                        from: expandedFrom,
                        to: to,
                        language: 'en',
                        ...options
                    });

                    if (result.success && result.articles) {
                        allArticles.push(...result.articles);
                    }
                } catch (error) {
                    // Expanded search failed, continue with other queries
                }
            }
        }

        if (allArticles.length === 0) {
            return {
                success: false,
                message: `No recent news found for "${userInput}" or its variations`,
                query: userInput,
                searchQueries: searchQueries,
                searchPeriod: { from, to, daysBack: 3 }
            };
        }

        // Remove duplicates based on URL
        const uniqueArticles = allArticles.filter((article, index, self) =>
            index === self.findIndex(a => a.url === article.url)
        );

        // Calculate priority and sort articles
        const articlesWithPriority = uniqueArticles
            .map(article => ({
                ...article,
                priority: this.calculateArticlePriority(article, userInput),
                publishedDate: new Date(article.publishedAt)
            }))
            .sort((a, b) => {
                if (b.priority !== a.priority) return b.priority - a.priority;
                return b.publishedDate - a.publishedDate;
            })
            .slice(0, 5); // Get top 5

        return {
            success: true,
            query: userInput,
            searchQueries: searchQueries,
            totalArticlesFound: allArticles.length,
            uniqueArticlesFound: uniqueArticles.length,
            articlesAnalyzed: uniqueArticles.length,
            topArticlesSelected: articlesWithPriority.length,
            articles: articlesWithPriority.map(article => ({
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: article.source,
                author: article.author,
                priority: article.priority
            })),
            searchPeriod: { from, to, daysBack: 3, currentDate: to }
        };
    }


}

module.exports = new NewsService();