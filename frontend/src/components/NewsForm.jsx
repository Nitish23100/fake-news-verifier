import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

const NewsForm = ({ onSubmit, loading }) => {
  const [text, setText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
  }

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste news article text here..."
          style={{
            width: '100%',
            minHeight: '200px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
            borderRadius: '0.375rem',
            padding: '0.875rem 1rem',
            color: '#FFFFFF',
            fontSize: '1rem',
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            resize: 'vertical',
            marginBottom: '1rem',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#FF6B35'
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#333333'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={loading || !text.trim()}
          style={{
            backgroundColor: '#FF6B35',
            color: '#FFFFFF',
            padding: '0.875rem 2rem',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
            border: 'none',
            cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: (loading || !text.trim()) ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!loading && text.trim()) {
              e.target.style.backgroundColor = '#E55A2B'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && text.trim()) {
              e.target.style.backgroundColor = '#FF6B35'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }
          }}
        >
          {loading && <LoadingSpinner size="16px" color="#FFFFFF" />}
          {loading ? 'Verifying...' : 'Verify News'}
        </button>
      </form>
    </div>
  )
}

export default NewsForm;