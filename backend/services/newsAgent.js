const Agent = require('./agent');
const newsService = require('./newsService');

class NewsAgent extends Agent {
  constructor() {
    super(
      'News Agent',
      `Read the user's claim and break it down into simple points.

Compare each point to the evidence from the news sources.

List the facts from the evidence that agree with the claim.

List the facts from the evidence that disagree with the claim.

Check if the claim uses exaggerated or clickbait words that the sources don't.

Based on your checklist, make a final decision.
      
      Always be objective, factual, and cite your sources when analyzing news.`
    );
  }

  async searchAndAnalyzeNews(userInput, options = {}) {
    try {
      // Step 1: Use the improved weekly top news search
      const newsResults = await newsService.getWeeklyTopNews(userInput, options);
      
      if (!newsResults.success || !newsResults.articles || newsResults.articles.length === 0) {
        return {
          success: false,
          message: newsResults.message || `No recent news articles found for "${userInput}"`,
          query: userInput,
          searchPeriod: newsResults.searchPeriod || { daysBack: 3 }
        };
      }

      // Step 2: Prepare detailed news summary for AI analysis
      const newsSummary = this.prepareDetailedNewsSummary(newsResults.articles);
      
      // Step 3: Enhanced AI analysis prompt with actual news data
      const analysisPrompt = `
You are analyzing the claim: "${userInput}"

Here are the ACTUAL RECENT NEWS ARTICLES found about this topic:

${newsSummary}

IMPORTANT: Base your analysis ONLY on the news articles provided above.

Analyze this claim step by step:

1. FACTUAL VERIFICATION:
   - Does the claim match what the news articles report?
   - Are there specific details confirmed or denied by the sources?
   - What exactly do the news sources say about this incident?

2. SOURCE ANALYSIS:
   - List the credible sources that reported on this
   - What are the publication dates of these articles?
   - Are these recent reports (within last few days)?

3. EVIDENCE COMPARISON:
   - Facts that SUPPORT the claim based on the articles
   - Facts that CONTRADICT the claim based on the articles
   - Missing details or context

4. FINAL VERDICT:
   - VERIFIED: If multiple credible sources confirm the incident
   - PARTIALLY VERIFIED: If some aspects are confirmed but details differ
   - UNVERIFIED: If no credible sources report this incident
   - FALSE: If sources explicitly deny or contradict the claim

Provide a clear, factual analysis based on the evidence provided.`;

      const aiAnalysis = await this.processMessage(analysisPrompt);
      
      return {
        success: true,
        query: userInput,
        totalArticlesFound: newsResults.totalArticlesFound || 0,
        articlesAnalyzed: newsResults.articles.length,
        articles: newsResults.articles,
        aiAnalysis: aiAnalysis.success ? aiAnalysis.message : 'Analysis not available',
        searchQueries: newsResults.searchQueries || [userInput],
        searchPeriod: newsResults.searchPeriod
      };

    } catch (error) {
      console.error('News analysis error:', error.message);
      return {
        success: false,
        message: `Failed to analyze news: ${error.message}`,
        query: userInput
      };
    }
  }

  prepareNewsSummary(articles) {
    return articles.map((article, index) => {
      return `
Article ${index + 1}:
Title: ${article.title}
Source: ${article.source.name}
Published: ${new Date(article.publishedAt).toLocaleDateString()}
Description: ${article.description || 'No description available'}
URL: ${article.url}
---`;
    }).join('\n');
  }

  prepareDetailedNewsSummary(articles) {
    if (!articles || articles.length === 0) {
      return "No news articles found.";
    }

    return articles.map((article, index) => {
      const publishedDate = new Date(article.publishedAt);
      const hoursAgo = Math.round((new Date() - publishedDate) / (1000 * 60 * 60));
      
      return `
ARTICLE ${index + 1}:
HEADLINE: ${article.title}
SOURCE: ${article.source.name}
PUBLISHED: ${publishedDate.toLocaleDateString()} (${hoursAgo} hours ago)
PRIORITY SCORE: ${article.priority || 'N/A'}
DESCRIPTION: ${article.description || 'No description available'}
CONTENT PREVIEW: ${article.content ? article.content.substring(0, 300) + '...' : 'No content preview'}
URL: ${article.url}
${'='.repeat(80)}`;
    }).join('\n');
  }

  async factCheck(newsText, sources = []) {
    // First, search for recent news about this claim
    const newsResults = await newsService.getWeeklyTopNews(newsText);
    
    let evidenceSection = '';
    if (newsResults.success && newsResults.articles && newsResults.articles.length > 0) {
      evidenceSection = `
RECENT NEWS EVIDENCE FOUND:
${this.prepareDetailedNewsSummary(newsResults.articles)}
`;
    } else {
      evidenceSection = `
SEARCH RESULTS: No recent news articles found about this claim in credible sources.
SEARCH PERIOD: Last 3-7 days
SEARCH QUERIES USED: ${newsResults.searchQueries ? newsResults.searchQueries.join(', ') : newsText}
`;
    }

    const factCheckPrompt = `
FACT-CHECK REQUEST: "${newsText}"

${evidenceSection}

${sources.length > 0 ? `
ADDITIONAL SOURCES PROVIDED:
${sources.map((source, i) => `${i + 1}. ${source.title} - ${source.source.name}`).join('\n')}
` : ''}

FACT-CHECK ANALYSIS:
Based on the evidence above, provide a comprehensive fact-check:

1. CLAIM VERIFICATION:
   - Is this claim supported by credible news sources?
   - What specific evidence supports or contradicts the claim?
   - Are there recent reports about this incident?

2. SOURCE CREDIBILITY:
   - Which credible news outlets have reported on this?
   - What are the publication dates of relevant articles?
   - Are these breaking news reports or older stories?

3. FACTUAL ACCURACY:
   - What are the confirmed facts based on the evidence?
   - What details are missing or unconfirmed?
   - Are there any contradictions in the reporting?

4. FINAL VERDICT:
   - VERIFIED: Multiple credible sources confirm the incident
   - PARTIALLY VERIFIED: Some aspects confirmed, details may vary
   - UNVERIFIED: No credible sources found reporting this
   - FALSE: Evidence contradicts or debunks the claim

5. CONFIDENCE LEVEL: Provide a percentage (0-100%) based on evidence quality

Provide a clear, evidence-based fact-check report.`;

    const factCheckResult = await this.processMessage(factCheckPrompt);
    
    // Calculate actual articles found for display
    const articlesCount = (newsResults.success && newsResults.articles) ? newsResults.articles.length : 0;
    
    return {
      success: factCheckResult.success,
      originalText: newsText,
      factCheckReport: factCheckResult.success ? factCheckResult.message : 'Fact-check analysis not available',
      newsArticlesFound: articlesCount,
      totalArticlesFound: newsResults.totalArticlesFound || 0,
      uniqueArticlesFound: newsResults.uniqueArticlesFound || 0,
      searchQueries: newsResults.searchQueries || [newsText],
      searchPeriod: newsResults.searchPeriod || { daysBack: 3 },
      sources: sources,
      timestamp: new Date().toISOString()
    };
  }

  async compareNews(topic, articles) {
    if (!articles || articles.length < 2) {
      return {
        success: false,
        message: 'At least 2 articles are required for comparison'
      };
    }

    const comparisonPrompt = `
Compare the following news articles about "${topic}":

${articles.map((article, index) => `
Article ${index + 1} (${article.source.name}):
Title: ${article.title}
Content: ${article.description}
Published: ${new Date(article.publishedAt).toLocaleDateString()}
---`).join('\n')}

Provide a comparison analysis including:
1. Common facts reported by all sources
2. Differences in reporting or emphasis
3. Unique information from each source
4. Potential bias or perspective differences
5. Overall consistency of the story across sources
6. Recommendations for readers`;

    const comparisonResult = await this.processMessage(comparisonPrompt);
    
    return {
      success: comparisonResult.success,
      topic: topic,
      articlesCompared: articles.length,
      comparisonAnalysis: comparisonResult.success ? comparisonResult.message : 'Comparison analysis not available',
      articles: articles
    };
  }
}

module.exports = NewsAgent;