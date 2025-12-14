export const applyDesignTokens = async () => {
  try {
    // Try to fetch design.json, but provide fallbacks if it fails
    let design;
    try {
      const response = await fetch('/design.json');
      design = await response.json();
    } catch (fetchError) {
      console.warn('Could not load design.json, using fallback tokens');
      // Fallback design tokens
      design = {
        colors: {
          primary: { orange: '#FF6B35', orangeHover: '#E55A2B' },
          secondary: { blue: '#4A90E2', green: '#7ED321' },
          neutral: { white: '#FFFFFF', black: '#000000', lightGray: '#F5F5F5', mediumGray: '#CCCCCC', darkGray: '#666666' },
          background: { primary: '#000000', secondary: '#1A1A1A' },
          text: { primary: '#FFFFFF', secondary: '#CCCCCC' }
        },
        typography: {
          fontFamilies: { heading: "'Inter', 'Helvetica Neue', Arial, sans-serif", body: "'Inter', 'Helvetica Neue', Arial, sans-serif" },
          fontWeights: { light: '300', regular: '400', medium: '500', semibold: '600', bold: '700' }
        },
        spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
        effects: {
          borderRadius: { small: '4px', medium: '8px', large: '12px' },
          shadows: { small: '0 2px 4px rgba(0,0,0,0.1)', medium: '0 4px 8px rgba(0,0,0,0.15)', large: '0 8px 16px rgba(0,0,0,0.2)' }
        }
      };
    }
    
    const root = document.documentElement;
    
    // Colors
    Object.entries(design.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });
    Object.entries(design.colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });
    Object.entries(design.colors.neutral).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value);
    });
    Object.entries(design.colors.background).forEach(([key, value]) => {
      root.style.setProperty(`--color-background-${key}`, value);
    });
    Object.entries(design.colors.text).forEach(([key, value]) => {
      root.style.setProperty(`--color-text-${key}`, value);
    });
    
    // Typography
    Object.entries(design.typography.fontFamilies).forEach(([key, value]) => {
      root.style.setProperty(`--font-family-${key}`, value);
    });
    Object.entries(design.typography.fontWeights).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value);
    });
    
    // Spacing
    Object.entries(design.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Effects
    Object.entries(design.effects.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });
    Object.entries(design.effects.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
  } catch (error) {
    console.error('Failed to load design tokens:', error);
  }
};