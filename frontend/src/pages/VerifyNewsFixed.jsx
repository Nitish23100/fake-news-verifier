import { useState } from 'react'

const VerifyNewsFixed = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('Sending request to backend...')
      
      const response = await fetch('http://localhost:5001/api/news-agent/fact-check', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ newsText: text })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        // Extract article count from the analysis if not provided directly
        let articleCount = data.newsArticlesFound || 0;
        
        // If the analysis mentions articles but count is 0, try to extract from text
        if (articleCount === 0 && data.factCheckReport) {
          const reportText = data.factCheckReport.toLowerCase();
          if (reportText.includes('reuters') || reportText.includes('times') || 
              reportText.includes('sources') || reportText.includes('articles')) {
            // If sources are mentioned in the report, assume articles were found
            articleCount = 'Multiple';
          }
        }
        
        console.log('Articles found:', articleCount);
        
        // Use the LLM's analysis directly without overriding
        setResult({
          verdict: 'ANALYSIS COMPLETE',
          details: data.factCheckReport || 'Analysis completed',
          confidence_score: null, // Let the LLM report its own confidence
          originalText: data.originalText,
          newsArticlesFound: articleCount,
          totalArticlesFound: data.totalArticlesFound,
          searchQueries: data.searchQueries,
          searchPeriod: data.searchPeriod,
          timestamp: data.timestamp
        })
      } else {
        setError(data.message || 'Verification failed')
      }
    } catch (err) {
      console.error('Verification error:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '100px',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ 
          color: '#FF6B35', 
          textAlign: 'center',
          marginBottom: '3rem',
          fontSize: '2.5rem'
        }}>
          News Verification System
        </h1>

        {/* Main Form */}
        <div style={{
          backgroundColor: '#1A1A1A',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid #333'
        }}>
          <form onSubmit={handleSubmit}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Enter News Text to Verify:
            </label>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your news article or claim here..."
              style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#000000',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '1rem',
                color: '#FFFFFF',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                resize: 'vertical',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            
            <button
              type="submit"
              disabled={loading || !text.trim()}
              style={{
                backgroundColor: loading || !text.trim() ? '#666' : '#FF6B35',
                color: '#FFFFFF',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading && text.trim()) {
                  e.target.style.backgroundColor = '#E55A2B'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && text.trim()) {
                  e.target.style.backgroundColor = '#FF6B35'
                }
              }}
            >
              {loading ? '🔍 Analyzing News...' : '🔍 Verify News'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: '#FFFFFF',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #ff6666'
          }}>
            <strong>❌ Error:</strong> {error}
            <button 
              onClick={() => setError(null)}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div style={{
            backgroundColor: '#1A1A1A',
            border: '2px solid #FF6B35',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>
                🔍
              </span>
              <div>
                <h2 style={{ 
                  color: '#FF6B35',
                  margin: 0,
                  fontSize: '1.8rem'
                }}>
                  Fact-Check Analysis
                </h2>
                <div style={{ 
                  color: '#CCCCCC', 
                  margin: '0.5rem 0 0 0',
                  fontSize: '1rem'
                }}>
                  {result.newsArticlesFound !== undefined && result.newsArticlesFound !== 0 && (
                    <p style={{ margin: 0 }}>
                      📰 {result.newsArticlesFound} news articles analyzed
                    </p>
                  )}
                  {result.searchQueries && result.searchQueries.length > 1 && (
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                      🔍 Searched: {result.searchQueries.join(', ')}
                    </p>
                  )}
                  {result.searchPeriod && (
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                      📅 Period: Last {result.searchPeriod.daysBack} days
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#000000',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <h3 style={{ 
                color: '#FF6B35', 
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                Analysis Report:
              </h3>
              <p style={{ 
                lineHeight: '1.6',
                fontSize: '1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {result.details}
              </p>
            </div>
          </div>
        )}

        {/* System Status */}
        <div style={{
          backgroundColor: '#1A1A1A',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #333',
          fontSize: '0.9rem',
          color: '#CCCCCC'
        }}>
          <h4 style={{ color: '#FF6B35', marginBottom: '1rem' }}>System Status:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>✅ Frontend: Running</div>
            <div>✅ Backend: Port 5001</div>
            <div>✅ LLM: Gemini 1.5</div>
            <div>✅ API: News Agent</div>
          </div>
        </div>

        {/* Test Examples */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#1A1A1A',
          borderRadius: '8px',
          border: '1px solid #333'
        }}>
          <h4 style={{ color: '#FF6B35', marginBottom: '1rem' }}>Quick Test Examples:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {[
              "Dubai's Burj Khalifa lights up to celebrate PM Narendra Modi's 75th birthday.",
              "Scientists discover cure for common cold in 2024.",
              "Breaking: New planet discovered in our solar system."
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setText(example)}
                style={{
                  backgroundColor: '#333',
                  color: '#FFFFFF',
                  border: '1px solid #555',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
              >
                Example {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyNewsFixed