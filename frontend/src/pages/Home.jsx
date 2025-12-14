import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-text-primary)'
        }}>
          Fake News Verifier
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          Verify the authenticity of news articles with our AI-powered tool
        </p>
        <button 
          className="btn-primary"
          onClick={() => navigate('/verify')}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Home