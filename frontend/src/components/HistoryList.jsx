const HistoryList = ({ history = [], onHistoryClick }) => {
  return (
    <div style={{
      backgroundColor: '#1A1A1A',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #333333'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: '#FFFFFF',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
      }}>
        Verification History
      </h3>
      {history.length === 0 ? (
        <p style={{ color: '#CCCCCC' }}>
          No verification history yet.
        </p>
      ) : (
        <div>
          {history.map((item) => (
            <div 
              key={item._id} 
              onClick={() => onHistoryClick && onHistoryClick(item)}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #333333',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                borderRadius: '0.375rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{ 
                color: '#999999',
                fontSize: '0.75rem',
                marginBottom: '0.25rem'
              }}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
              <div style={{ 
                color: '#CCCCCC',
                fontSize: '0.875rem'
              }}>
                {item.originalText.substring(0, 50) + (item.originalText.length > 50 ? '...' : '')}
              </div>
              <div style={{
                color: item.verdict === 'Not Found' ? '#FF6B35' : '#2DD4BF',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                fontWeight: 500
              }}>
                {item.verdict}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryList