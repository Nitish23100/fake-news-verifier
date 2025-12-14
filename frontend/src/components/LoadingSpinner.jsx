const LoadingSpinner = ({ size = '24px', color = '#FF6B35' }) => {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: size,
          height: size,
          border: `2px solid transparent`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          display: 'inline-block'
        }}
      />
    </>
  );
};

export default LoadingSpinner;