// 💎 Theme Context & Provider for Dark Mode
import React, { createContext, useContext, useState, useEffect } from 'react';
import tokens from './tokens';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('monivue-theme');
    return savedTheme || 'light';
  });

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Switch to specific theme
  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  // Get current colors based on theme
  const colors = theme === 'light' ? tokens.colors.light : tokens.colors.dark;

  // Apply theme to document
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('monivue-theme', theme);

    // Apply theme class to body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);

    // Apply CSS custom properties for easy access
    const root = document.documentElement;
    
    // Background colors
    root.style.setProperty('--bg-primary', colors.background.primary);
    root.style.setProperty('--bg-secondary', colors.background.secondary);
    root.style.setProperty('--bg-tertiary', colors.background.tertiary);

    // Surface colors
    root.style.setProperty('--surface-base', colors.surface.base);
    root.style.setProperty('--surface-elevated', colors.surface.elevated);

    // Border colors
    root.style.setProperty('--border-light', colors.border.light);
    root.style.setProperty('--border-medium', colors.border.medium);
    root.style.setProperty('--border-dark', colors.border.dark);

    // Text colors
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-tertiary', colors.text.tertiary);
    root.style.setProperty('--text-disabled', colors.text.disabled);

    // Accent colors
    if (colors.accent) {
      root.style.setProperty('--accent-primary', colors.accent.primary);
      root.style.setProperty('--accent-secondary', colors.accent.secondary);
      root.style.setProperty('--accent-tertiary', colors.accent.tertiary);
      if (colors.accent.glow) {
        root.style.setProperty('--accent-glow', colors.accent.glow);
      }
    }

    // Brand colors (theme-dependent) 
    const brandColors = tokens.colors.brand;
    root.style.setProperty('--brand-primary', brandColors.primary);
    root.style.setProperty('--brand-primary-dark', brandColors.primaryDark);
    root.style.setProperty('--brand-primary-light', brandColors.primaryLight);
    
    // Theme-specific brand variations
    if (theme === 'dark') {
      root.style.setProperty('--brand-purple', colors.accent.secondary);
      root.style.setProperty('--brand-purple-light', colors.accent.glow);
    }

    // Semantic colors
    root.style.setProperty('--color-success', tokens.colors.semantic.success.base);
    root.style.setProperty('--color-warning', tokens.colors.semantic.warning.base);
    root.style.setProperty('--color-error', tokens.colors.semantic.error.base);
    root.style.setProperty('--color-info', tokens.colors.semantic.info.base);

    // Gradients
    root.style.setProperty('--gradient-hero', theme === 'light' ? tokens.gradients.heroLight : tokens.gradients.heroDark);
    root.style.setProperty('--gradient-card', theme === 'light' ? tokens.gradients.card : tokens.gradients.cardDark);
    root.style.setProperty('--gradient-income', tokens.gradients.income);
    root.style.setProperty('--gradient-expense', tokens.gradients.expense);
    root.style.setProperty('--gradient-glass', theme === 'light' ? tokens.gradients.glass : tokens.gradients.glassDark);
    root.style.setProperty('--gradient-gold', tokens.gradients.gold);
    root.style.setProperty('--gradient-neon-purple', tokens.gradients.neonPurple);

    // Feature-specific gradients
    root.style.setProperty('--gradient-transactions', theme === 'light' ? tokens.gradients.transactions.light : tokens.gradients.transactions.dark);
    root.style.setProperty('--gradient-transactions-card', tokens.gradients.transactions.card);
    root.style.setProperty('--gradient-budget', theme === 'light' ? tokens.gradients.budget.light : tokens.gradients.budget.dark);
    root.style.setProperty('--gradient-budget-card', tokens.gradients.budget.card);
    root.style.setProperty('--gradient-goals', theme === 'light' ? tokens.gradients.goals.light : tokens.gradients.goals.dark);
    root.style.setProperty('--gradient-goals-card', tokens.gradients.goals.card);
    root.style.setProperty('--gradient-reports', theme === 'light' ? tokens.gradients.reports.light : tokens.gradients.reports.dark);
    root.style.setProperty('--gradient-reports-card', tokens.gradients.reports.card);

    // Feature-specific colors
    const featureColors = tokens.colors.features;
    
    // Transactions colors
    root.style.setProperty('--transactions-primary', theme === 'light' ? featureColors.transactions.light.primary : featureColors.transactions.dark.primary);
    root.style.setProperty('--transactions-secondary', theme === 'light' ? featureColors.transactions.light.secondary : featureColors.transactions.dark.secondary);
    root.style.setProperty('--transactions-background', theme === 'light' ? featureColors.transactions.light.background : featureColors.transactions.dark.background);
    root.style.setProperty('--transactions-border', theme === 'light' ? featureColors.transactions.light.border : featureColors.transactions.dark.border);

    // Budget colors
    root.style.setProperty('--budget-primary', theme === 'light' ? featureColors.budget.light.primary : featureColors.budget.dark.primary);
    root.style.setProperty('--budget-secondary', theme === 'light' ? featureColors.budget.light.secondary : featureColors.budget.dark.secondary);
    root.style.setProperty('--budget-background', theme === 'light' ? featureColors.budget.light.background : featureColors.budget.dark.background);
    root.style.setProperty('--budget-border', theme === 'light' ? featureColors.budget.light.border : featureColors.budget.dark.border);

    // Goals colors
    root.style.setProperty('--goals-primary', theme === 'light' ? featureColors.goals.light.primary : featureColors.goals.dark.primary);
    root.style.setProperty('--goals-secondary', theme === 'light' ? featureColors.goals.light.secondary : featureColors.goals.dark.secondary);
    root.style.setProperty('--goals-background', theme === 'light' ? featureColors.goals.light.background : featureColors.goals.dark.background);
    root.style.setProperty('--goals-border', theme === 'light' ? featureColors.goals.light.border : featureColors.goals.dark.border);

    // Reports colors
    root.style.setProperty('--reports-primary', theme === 'light' ? featureColors.reports.light.primary : featureColors.reports.dark.primary);
    root.style.setProperty('--reports-secondary', theme === 'light' ? featureColors.reports.light.secondary : featureColors.reports.dark.secondary);
    root.style.setProperty('--reports-background', theme === 'light' ? featureColors.reports.light.background : featureColors.reports.dark.background);
    root.style.setProperty('--reports-border', theme === 'light' ? featureColors.reports.light.border : featureColors.reports.dark.border);

    // Glass opacity layers
    const glassTokens = theme === 'light' ? tokens.opacity.glass : tokens.opacity.glassDark;
    root.style.setProperty('--glass-strong', glassTokens.strong);
    root.style.setProperty('--glass-medium', glassTokens.medium);
    root.style.setProperty('--glass-light', glassTokens.light);
    root.style.setProperty('--glass-ultra-light', glassTokens.ultraLight);
  }, [theme, colors]);

  // Context value
  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    colors,
    tokens,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
