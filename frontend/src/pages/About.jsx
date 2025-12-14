const About = () => {
  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: 'var(--spacing-xl)'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--spacing-xl)',
          color: 'var(--color-text-primary)'
        }}>
          About
        </h1>
        <div className="card">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-md)',
            color: 'var(--color-text-primary)'
          }}>
            Project Overview
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--spacing-md)'
          }}>
            This application helps verify the authenticity of news articles using advanced analysis techniques. 
            Built with the MERN stack and powered by AI-driven verification algorithms.
          </p>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: 'var(--spacing-sm)',
            color: 'var(--color-text-accent)'
          }}>
            Team
          </h3>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6
          }}>
            Developed by Nitish & Hritik - A group of passionate developers committed to fighting misinformation 
            through technology and promoting media literacy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About