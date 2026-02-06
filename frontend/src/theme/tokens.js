// 💎 MONIVUE Finance Tracker - Design Tokens
// Premium Design System - Single Source of Truth

export const tokens = {
  // ==================== COLORS ====================
  colors: {
    // Brand Colors - Light Mode (Mint & Teal)
    brand: {
      primary: '#14B8A6', // Teal
      primaryDark: '#0D9488',
      primaryLight: '#2DD4BF',
      primaryUltraLight: '#CCFBF1',
    },

    // Brand Colors - Dark Mode (Cyberpunk Gold & Neon Purple)
    brandDark: {
      primary: '#FFD700', // Cyberpunk Gold
      primaryDark: '#FFB800',
      primaryLight: '#FFED4E',
      purple: '#D946EF', // Intense Neon Purple
      purpleLight: '#F0ABFC',
      purpleDark: '#C026D3',
      neonPurple: '#E946F5', // Extra neon
      neonPink: '#FF10F0', // Neon pink
    },

    // Secondary Colors (Accent)
    accent: {
      purple: '#7C3AED',
      teal: '#06B6D4',
      green: '#10B981',
      gold: '#FFD700',
      neonPurple: '#D946EF',
      neonPink: '#FF10F0',
      cyberPurple: '#E946F5',
      electricBlue: '#00F0FF',
    },

    // Semantic Colors
    semantic: {
      success: {
        base: '#10B981',
        dark: '#059669',
        light: '#D1FAE5',
      },
      warning: {
        base: '#F59E0B',
        dark: '#D97706',
        light: '#FEF3C7',
      },
      error: {
        base: '#EF4444',
        dark: '#DC2626',
        light: '#FEE2E2',
      },
      info: {
        base: '#3B82F6',
        dark: '#2563EB',
        light: '#DBEAFE',
      },
    },

    // Light Theme Palette (Mint & Cream)
    light: {
      background: {
        primary: '#F0FDFA', // Mint cream
        secondary: '#FFFFFF',
        tertiary: '#CCFBF1', // Light teal
      },
      surface: {
        base: '#FFFFFF',
        elevated: '#FFFFFF',
      },
      border: {
        light: '#99F6E4',
        medium: '#5EEAD4',
        dark: '#2DD4BF',
      },
      text: {
        primary: '#134E4A', // Dark teal
        secondary: '#0F766E',
        tertiary: '#14B8A6',
        disabled: '#5EEAD4',
      },
      accent: {
        primary: '#14B8A6', // Teal
        secondary: '#06B6D4', // Cyan
        tertiary: '#10B981', // Emerald
      },
    },

    // Dark Theme Palette (Modern Dark)
    dark: {
      background: {
        primary: '#0f172a', // Dark slate - used for main content
        secondary: '#1e293b', // Slate gray
        tertiary: '#334155', // Medium slate
      },
      surface: {
        base: '#1e293b',
        elevated: '#334155',
      },
      border: {
        light: '#475569', // Gray border
        medium: '#64748b', // Medium gray
        dark: '#94a3b8', // Light gray
      },
      text: {
        primary: '#FFFFFF', // Pure white
        secondary: '#e2e8f0', // Light gray white
        tertiary: '#cbd5e1', // Softer white
        disabled: '#64748b',
      },
      accent: {
        primary: '#3b82f6', // Blue accent
        secondary: '#8b5cf6', // Purple accent
        tertiary: '#06b6d4', // Cyan accent
        glow: '#60a5fa', // Light blue glow
        neon: '#a78bfa', // Light purple
      },
    },
  },

  // ==================== GRADIENTS ====================
  gradients: {
    // Light Mode Gradients
    hero: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)', // Teal gradient
    heroLight: 'linear-gradient(135deg, #5EEAD4 0%, #22D3EE 100%)',
    card: 'linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 100%)',
    
    // Dark Mode Modern Gradients
    heroDark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Dark slate gradient
    heroDarkAlt: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', // Slate gradient
    cardDark: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    glowDark: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    neonPurpleDark: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    cyberpunk: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    
    // Universal
    income: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    expense: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    premium: 'linear-gradient(135deg, #FFD700 0%, #D946EF 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    glassDark: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.9) 100%)',
    neonPurple: 'linear-gradient(135deg, #D946EF 0%, #F0ABFC 100%)',
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFED4E 100%)',
  },

  // ==================== OPACITY LAYERS ====================
  opacity: {
    overlay: {
      dark: 'rgba(0, 0, 0, 0.4)',
      medium: 'rgba(0, 0, 0, 0.2)',
      light: 'rgba(0, 0, 0, 0.1)',
    },
    glass: {
      strong: 'rgba(255, 255, 255, 0.95)',
      medium: 'rgba(255, 255, 255, 0.85)',
      light: 'rgba(255, 255, 255, 0.7)',
      ultraLight: 'rgba(255, 255, 255, 0.5)',
    },
    glassDark: {
      strong: 'rgba(30, 41, 59, 0.95)',
      medium: 'rgba(30, 41, 59, 0.85)',
      light: 'rgba(30, 41, 59, 0.7)',
      ultraLight: 'rgba(30, 41, 59, 0.5)',
    },
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    // Font Family
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      mono: "'SF Mono', 'Monaco', 'Consolas', monospace",
    },

    // Font Weights
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    // Display Sizes (Hero Text)
    display: {
      1: { size: '72px', lineHeight: '76px', weight: 800, letterSpacing: '-0.02em' },
      2: { size: '60px', lineHeight: '64px', weight: 800, letterSpacing: '-0.02em' },
      3: { size: '48px', lineHeight: '52px', weight: 700, letterSpacing: '-0.02em' },
    },

    // Heading Sizes
    heading: {
      h1: { size: '40px', lineHeight: '44px', weight: 700, letterSpacing: '-0.01em' },
      h2: { size: '32px', lineHeight: '36px', weight: 700, letterSpacing: '-0.01em' },
      h3: { size: '28px', lineHeight: '32px', weight: 600, letterSpacing: '-0.01em' },
      h4: { size: '24px', lineHeight: '28px', weight: 600, letterSpacing: '-0.01em' },
      h5: { size: '20px', lineHeight: '24px', weight: 600, letterSpacing: '0' },
      h6: { size: '18px', lineHeight: '22px', weight: 600, letterSpacing: '0' },
    },

    // Body Sizes
    body: {
      large: { size: '18px', lineHeight: '28px', weight: 400 },
      regular: { size: '16px', lineHeight: '24px', weight: 400 },
      small: { size: '14px', lineHeight: '20px', weight: 400 },
      caption: { size: '12px', lineHeight: '16px', weight: 400 },
    },

    // Specialized Text
    button: { size: '16px', weight: 600, letterSpacing: '0.01em' },
    label: { size: '14px', weight: 500, letterSpacing: '0.01em' },
    input: { size: '16px', weight: 400 },
  },

  // ==================== SPACING (8-Point Grid) ====================
  spacing: {
    0: '0px',
    0.5: '4px',   // 0.5 unit
    1: '8px',     // 1 unit
    1.5: '12px',  // 1.5 unit
    2: '16px',    // 2 units
    3: '24px',    // 3 units
    4: '32px',    // 4 units
    5: '40px',    // 5 units
    6: '48px',    // 6 units
    8: '64px',    // 8 units
    10: '80px',   // 10 units
    12: '96px',   // 12 units
    16: '128px',  // 16 units
    20: '160px',  // 20 units
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    none: '0',
    sm: '4px',
    default: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  // ==================== SHADOWS ====================
  shadows: {
    // Light Theme Shadows
    light: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      default: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
      md: '0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)',
      xl: '0 12px 24px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
      '2xl': '0 16px 32px rgba(0, 0, 0, 0.14), 0 12px 24px rgba(0, 0, 0, 0.1)',
      '3xl': '0 24px 48px rgba(0, 0, 0, 0.16), 0 16px 32px rgba(0, 0, 0, 0.12)',
      '4xl': '0 32px 64px rgba(0, 0, 0, 0.18), 0 24px 48px rgba(0, 0, 0, 0.14)',
    },

    // Colored Shadows (Premium Effect)
    colored: {
      blue: '0 8px 32px rgba(0, 102, 255, 0.2)',
      purple: '0 8px 32px rgba(124, 58, 237, 0.2)',
      green: '0 8px 32px rgba(16, 185, 129, 0.2)',
      red: '0 8px 32px rgba(239, 68, 68, 0.2)',
      gold: '0 8px 32px rgba(245, 158, 11, 0.3)',
    },

    // Inner Shadows (Neumorphism)
    inner: {
      sm: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      md: 'inset 0 4px 8px rgba(0, 0, 0, 0.15)',
      lg: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    },
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
    '3xl': '1920px',
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: '150ms ease',
    base: '300ms ease',
    slow: '500ms ease',
    bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // ==================== Z-INDEX LAYERS ====================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
    notification: 1600,
  },

  // ==================== CONTAINER WIDTHS ====================
  container: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1024px',
    desktopMd: '1280px',
    desktopLg: '1440px',
    ultraWide: '1920px',
  },
};

// Helper functions for accessing tokens
export const getColor = (path) => {
  const keys = path.split('.');
  let value = tokens.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export const getSpacing = (multiplier) => tokens.spacing[multiplier];

export const getShadow = (type, variant = 'default') => {
  if (type === 'colored' || type === 'inner') {
    return tokens.shadows[type][variant];
  }
  return tokens.shadows.light[variant];
};

export default tokens;
