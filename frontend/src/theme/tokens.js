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

    // Feature-Specific Colors for Dashboard
    features: {
      transactions: {
        light: {
          primary: '#10B981', // Green for transactions
          secondary: '#059669',
          background: '#D1FAE5',
          border: '#6EE7B7',
        },
        dark: {
          primary: '#34D399',
          secondary: '#10B981',
          background: '#064E3B',
          border: '#065F46',
        },
      },
      budget: {
        light: {
          primary: '#F59E0B', // Gold/Orange for budget
          secondary: '#D97706',
          background: '#FEF3C7',
          border: '#FCD34D',
        },
        dark: {
          primary: '#FBBF24',
          secondary: '#F59E0B',
          background: '#78350F',
          border: '#92400E',
        },
      },
      goals: {
        light: {
          primary: '#7C3AED', // Purple for goals
          secondary: '#6D28D9',
          background: '#EDE9FE',
          border: '#C4B5FD',
        },
        dark: {
          primary: '#A78BFA',
          secondary: '#8B5CF6',
          background: '#4C1D95',
          border: '#5B21B6',
        },
      },
      reports: {
        light: {
          primary: '#06B6D4', // Teal/Cyan for reports
          secondary: '#0891B2',
          background: '#CFFAFE',
          border: '#67E8F9',
        },
        dark: {
          primary: '#22D3EE',
          secondary: '#06B6D4',
          background: '#164E63',
          border: '#155E75',
        },
      },
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

    // Neutral Palette (Light Theme) - Enhanced Very Light Blue Theme
    light: {
      background: {
        primary: '#F0F8FF', // Alice blue - very light blue background
        secondary: '#E6F3FF', // Lighter sky blue
        tertiary: '#DBE9FF', // Soft blue
      },
      surface: {
        base: '#FAFCFF', // Almost white with blue tint
        elevated: '#F5F9FF', // Elevated soft blue
      },
      border: {
        light: '#D1E7FF', // Very light blue border
        medium: '#B8DAFF', // Light blue border
        dark: '#9CCAFF', // Medium blue border
      },
      text: {
        primary: '#000000', // Black text for light mode
        secondary: '#1F2937', // Dark gray text
        tertiary: '#374151', // Medium gray text
        disabled: '#9CA3AF', // Gray for disabled
      },
      accent: {
        primary: '#3B82F6', // Bright blue accent
        secondary: '#60A5FA', // Light blue accent
        tertiary: '#93C5FD', // Very light blue accent
        glow: 'rgba(59, 130, 246, 0.3)', // Soft blue glow
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
      accent: {
        primary: '#3385FF',
        secondary: '#9333EA',
        tertiary: '#0891B2',
        glow: 'rgba(51, 133, 255, 0.6)',
      },
    },
  },

  // ==================== GRADIENTS ====================
  gradients: {
    // Hero gradients for different themes
    hero: 'linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)', // Default
    heroLight: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Main light theme (Premium Blue)
    heroDark: '#1a1f2e', // Dark theme (consistent flat dark)
    
    // Card gradients
    card: 'linear-gradient(135deg, #FAFCFF 0%, #F5F9FF 100%)', // Very light blue cards
    cardDark: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    
    // Income/Expense
    income: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    expense: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    premium: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    
    // Glass effects
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    glassDark: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
    
    // Brand gradients
    gold: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    neonPurple: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',

    // Feature-specific gradients
    transactions: {
      light: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
      dark: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
      card: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    budget: {
      light: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
      dark: 'linear-gradient(135deg, #78350F 0%, #92400E 100%)',
      card: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
    goals: {
      light: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
      dark: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)',
      card: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    },
    reports: {
      light: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 50%, #A5F3FC 100%)',
      dark: 'linear-gradient(135deg, #164E63 0%, #155E75 100%)',
      card: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    },
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
