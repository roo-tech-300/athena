import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'white' | 'neutral'
  fullPage?: boolean
  label?: string
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  fullPage = false,
  label
}) => {
  // Size mapping
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '40px',
    xl: '64px'
  }

  // Color mapping
  const colorMap = {
    primary: 'var(--color-primary)',
    white: '#FFFFFF',
    neutral: 'var(--color-gray-400)'
  }

  const spinnerSize = sizeMap[size]
  const spinnerColor = colorMap[variant]

  const loaderContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-4)',
      width: '100%',
      height: '100%'
    }}>
      <div
        className="loader-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid ${spinnerColor}20`, // Transparent version of the color
          borderTop: `3px solid ${spinnerColor}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {label && (
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: variant === 'white' ? 'white' : 'var(--color-gray-600)',
          letterSpacing: '0.05em'
        }}>
          {label}
        </span>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loader-full-page {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(249, 250, 251, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: inherit;
          width: 100%;
        }
      `}</style>
    </div>
  )

  if (fullPage) {
    return (
      <div className="loader-full-page">
        {loaderContent}
      </div>
    )
  }

  return (
    <div className="loader-container">
      {loaderContent}
    </div>
  )
}

export default Loader