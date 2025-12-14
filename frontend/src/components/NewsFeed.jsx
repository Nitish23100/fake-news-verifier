import { useState, useEffect } from 'react';
import { getNews } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNews();
        // Ensure we have an array of articles
        const articlesArray = data?.articles || data || [];
        setArticles(Array.isArray(articlesArray) ? articlesArray : []);
      } catch (err) {
        console.error('NewsFeed error:', err);
        setError(err.message);
        setArticles([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <LoadingSpinner size="32px" />
        <p style={{ marginTop: '1rem', color: '#CCCCCC' }}>Loading news...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        color: '#FFFFFF',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
      }}>
        Latest News
      </h2>

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {Array.isArray(articles) && articles.length > 0 ? articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: '0.75rem',
                padding: '2rem',
                border: '1px solid #333333',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = '#FF6B35';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#333333';
              }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem'
                  }}
                />
              )}

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
                }}>
                  {article.title}
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#FF6B35',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  {article.source.name}
                </p>

                <p style={{
                  fontSize: '1rem',
                  color: '#CCCCCC',
                  lineHeight: 1.5,
                  flex: 1
                }}>
                  {article.description}
                </p>
              </div>
            </div>
          </a>
        )) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#CCCCCC',
            gridColumn: '1 / -1'
          }}>
            <p>No news articles available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;