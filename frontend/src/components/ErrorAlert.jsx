const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#1A1A1A',
      border: '1px solid #FF6B35',
      borderRadius: '0.375rem',
      padding: '1rem',
      marginBottom: '1rem',
      color: '#FFFFFF',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: '#FF6B35', fontSize: '1.2rem' }}>⚠</span>
          <span>{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF6B35',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;