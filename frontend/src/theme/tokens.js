// 💎 MONIVUE Finance Tracker - Design Tokens
// Premium Design System - Single Source of Truth

export const tokens = {
  // ==================== COLORS ====================
  colors: {
    // Brand Colors (Blue Gradient)
    brand: {
      primary: '#0066FF',
      primaryDark: '#0047B3',
      primaryLight: '#3385FF',
      primaryUltraLight: '#E6F2FF',
    },

    // Secondary Colors (Accent)
    accent: {
      purple: '#7C3AED',
      teal: '#06B6D4',
      green: '#10B981',
      gold: '#F59E0B',
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

    // Neutral Palette (Light Theme)
    light: {
      background: {
        primary: '#F8FAFC',
        secondary: '#FFFFFF',
        tertiary: '#F1F5F9',
      },
      surface: {
        base: '#FFFFFF',
        elevated: '#FFFFFF',
      },
      border: {
        light: '#E2E8F0',
        medium: '#CBD5E1',
        dark: '#94A3B8',
      },
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        tertiary: '#64748B',
        disabled: '#94A3B8',
      },
    },

    // Dark Theme Palette
    dark: {
      background: {
        primary: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
      },
      surface: {
        base: '#1E293B',
        elevated: '#334155',
      },
      border: {
        light: '#334155',
        medium: '#475569',
        dark: '#64748B',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
        disabled: '#64748B',
      },
    },
  },

  // ==================== GRADIENTS ====================
  gradients: {
    hero: 'linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)',
    card: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
    income: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    expense: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    premium: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    glassDark: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
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
