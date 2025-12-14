import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      height: '80px',
      backgroundColor: 'var(--color-background-secondary)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-xl)'
    }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-primary-orange)'
      }}>
        NewsVerify
      </div>
      {/* Desktop Menu */}
      <div className="desktop-menu" style={{ 
        display: 'flex', 
        gap: 'var(--spacing-xl, 32px)'
      }}>
        {[{to: '/', label: 'Home'}, {to: '/verify', label: 'Verify News'}, {to: '/about', label: 'About'}].map(({to, label}) => (
          <Link 
            key={to}
            to={to} 
            style={{
              color: 'var(--color-text-primary, #FFFFFF)',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 'var(--font-weight-medium, 500)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-orange, #FF6B35)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary, #FFFFFF)'}
          >
            {label}
          </Link>
        ))}
      </div>
      
      {/* Mobile Hamburger */}
      <button 
        className="mobile-hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-primary, #FFFFFF)',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        ☰
      </button>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-background-secondary)',
          padding: 'var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          boxShadow: 'var(--shadow-large)'
        }}>
          {[{to: '/', label: 'Home'}, {to: '/verify', label: 'Verify News'}, {to: '/about', label: 'About'}].map(({to, label}) => (
            <Link 
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              style={{
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 'var(--font-weight-medium)',
                padding: 'var(--spacing-sm)'
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar