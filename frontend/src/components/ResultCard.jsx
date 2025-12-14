import React from 'react';

// A helper component for displaying a single article.
const Article = ({ article }) => {
  const articleStyle = {
    padding: '1rem',
    border: '1px solid #333333',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    backgroundColor: '#000000'
  };

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#FFFFFF',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
  };

  const sourceStyle = {
    fontSize: '0.875rem',
    color: '#CCCCCC',
    marginTop: '0.5rem'
  };

  return (
    <div style={articleStyle}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <h3 style={titleStyle}>{article.title}</h3>
      </a>
      <p style={sourceStyle}>Source: {article.source.name} - Published: {new Date(article.publishedAt).toLocaleDateString()}</p>
    </div>
  );
};


const ResultCard = ({ result }) => {
  // result prop contains comprehensive verification data
  const { 
    verdict, details, confidence_score, match_score, user_keywords, best_match_source, 
    found_articles, search_timeframe, date_analysis, factual_claims, content_analysis, source_credibility 
  } = result;

  const cardStyle = {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: '0.75rem',
    padding: '2rem',
    marginTop: '2rem',
    border: '1px solid #333333',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
  };

  const headerStyle = {
    fontSize: '2rem',
    color: '#FFFFFF',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333333',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 700
  };

  const verdictStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#000000',
    borderRadius: '0.375rem',
    border: '1px solid #333333'
  };

  const getVerdictColor = (verdict) => {
    if (verdict?.toLowerCase().includes('likely true') || verdict?.toLowerCase().includes('verified')) {
      return '#2DD4BF'; // Green for true/verified
    }
    if (verdict?.toLowerCase().includes('likely false') || verdict?.toLowerCase().includes('suspicious') || verdict?.toLowerCase().includes('unreliable')) {
      return '#FF4444'; // Red for false/suspicious
    }
    if (verdict?.toLowerCase().includes('inconclusive') || verdict?.toLowerCase().includes('partially')) {
      return '#FF6B35'; // Orange for inconclusive
    }
    return '#CCCCCC'; // Gray for others
  };

  const verdictTextStyle = {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    color: getVerdictColor(verdict)
  };

  const detailsStyle = {
    fontSize: '1.125rem',
    color: '#CCCCCC',
    fontWeight: 400,
    marginBottom: '0.5rem',
    lineHeight: 1.5
  };

  const matchScoreStyle = {
    fontSize: '1rem',
    color: '#FFFFFF',
    fontWeight: 500
  };
  
  const keywordStyle = {
    display: 'inline-block',
    backgroundColor: '#333333',
    color: '#FF6B35',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    margin: '0 0.5rem 0.5rem 0',
    fontSize: '0.875rem',
    fontWeight: 500
  };

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>Verification Report</h2>
      
      {/* Verdict Section */}
      {verdict && (
        <div style={verdictStyle}>
          <div style={verdictTextStyle}>{verdict}</div>
          <div style={detailsStyle}>{details}</div>
          {confidence_score !== undefined && (
            <div style={matchScoreStyle}>
              Confidence Score: {confidence_score}%
              {match_score !== undefined && ` • Content Match: ${match_score}%`}
              {best_match_source && best_match_source !== 'N/A' && ` • Best Match: ${best_match_source}`}
            </div>
          )}
        </div>
      )}
      
      {/* Comprehensive Analysis Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Factual Claims Analysis */}
        {factual_claims && (
          <div style={{ padding: '1rem', backgroundColor: '#000000', borderRadius: '0.375rem', border: '1px solid #333333' }}>
            <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>Factual Claims</strong>
            <div style={{ marginTop: '0.5rem', color: '#CCCCCC', fontSize: '0.875rem' }}>
              <div>• Total claims: {factual_claims.total_claims || 0}</div>
              <div style={{ color: '#2DD4BF' }}>• Verified: {factual_claims.verified_claims || 0}</div>
              <div style={{ color: '#FF4444' }}>• Contradicted: {factual_claims.contradicted_claims || 0}</div>
              {factual_claims.verification_score !== undefined && (
                <div>• Verification score: {factual_claims.verification_score}%</div>
              )}
            </div>
          </div>
        )}

        {/* Content Analysis */}
        {content_analysis && (
          <div style={{ padding: '1rem', backgroundColor: '#000000', borderRadius: '0.375rem', border: '1px solid #333333' }}>
            <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>Content Analysis</strong>
            <div style={{ marginTop: '0.5rem', color: '#CCCCCC', fontSize: '0.875rem' }}>
              <div>• Suspicion score: {content_analysis.suspicion_score || 0}%</div>
              <div>• Readability: {content_analysis.readability_score || 'N/A'}</div>
              {content_analysis.red_flags && content_analysis.red_flags.length > 0 && (
                <div style={{ color: '#FF4444' }}>• Red flags: {content_analysis.red_flags.length}</div>
              )}
              {content_analysis.positive_indicators && content_analysis.positive_indicators.length > 0 && (
                <div style={{ color: '#2DD4BF' }}>• Positive signs: {content_analysis.positive_indicators.length}</div>
              )}
            </div>
          </div>
        )}

        {/* Source Credibility */}
        {source_credibility && (
          <div style={{ padding: '1rem', backgroundColor: '#000000', borderRadius: '0.375rem', border: '1px solid #333333' }}>
            <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>Source Credibility</strong>
            <div style={{ marginTop: '0.5rem', color: '#CCCCCC', fontSize: '0.875rem' }}>
              <div>• Credibility score: {source_credibility.credibility_score || 0}%</div>
              <div style={{ color: '#2DD4BF' }}>• High credibility: {source_credibility.high_credibility_sources || 0}</div>
              <div style={{ color: '#FF4444' }}>• Questionable: {source_credibility.questionable_sources || 0}</div>
            </div>
          </div>
        )}

        {/* Date Analysis */}
        {date_analysis && (
          <div style={{ padding: '1rem', backgroundColor: '#000000', borderRadius: '0.375rem', border: '1px solid #333333' }}>
            <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>Date Analysis</strong>
            <div style={{ marginTop: '0.5rem', color: '#CCCCCC', fontSize: '0.875rem' }}>
              {date_analysis.dates_found > 0 ? (
                <>
                  <div>• Found {date_analysis.dates_found} date(s)</div>
                  {date_analysis.most_recent_date && (
                    <div>• Recent: {date_analysis.most_recent_date}</div>
                  )}
                  <div>• Period: {search_timeframe}</div>
                </>
              ) : (
                <div>• No dates found - searched {search_timeframe}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Red Flags and Positive Indicators */}
      {content_analysis && (content_analysis.red_flags?.length > 0 || content_analysis.positive_indicators?.length > 0) && (
        <div style={{ marginBottom: '1.5rem' }}>
          {content_analysis.red_flags?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#FF4444', fontSize: '1rem' }}>⚠ Red Flags:</strong>
              <ul style={{ marginTop: '0.5rem', color: '#CCCCCC', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                {content_analysis.red_flags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
          
          {content_analysis.positive_indicators?.length > 0 && (
            <div>
              <strong style={{ color: '#2DD4BF', fontSize: '1rem' }}>✓ Positive Indicators:</strong>
              <ul style={{ marginTop: '0.5rem', color: '#CCCCCC', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                {content_analysis.positive_indicators.map((indicator, index) => (
                  <li key={index}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div>
        <strong style={{ color: '#FFFFFF', fontSize: '1.125rem' }}>Search Queries Used:</strong>
        <div style={{ marginTop: '0.5rem' }}>
          {user_keywords && user_keywords.map((kw, index) => <span key={index} style={keywordStyle}>{kw}</span>)}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {found_articles && found_articles.length > 0 ? (
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.125rem', marginBottom: '1rem' }}>Found {found_articles.length} Relevant Article(s) from News Sources:</h4>
            {found_articles.map((article, index) => (
              <Article key={index} article={article} />
            ))}
          </div>
        ) : (
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.125rem', marginBottom: '1rem' }}>Finding: No Corroborating Articles Found</h4>
            <p style={{ color: '#CCCCCC', lineHeight: '1.6' }}>
              The automated search did not find any recent articles from our indexed news sources matching the key topics of the text provided. This could indicate that the story is not being reported by mainstream news, which can be a red flag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;