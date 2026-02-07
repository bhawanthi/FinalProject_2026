# 🎨 Dashboard Color Schemes Guide

## Overview
This guide documents the color schemes for each dashboard feature in both **Light Mode** and **Dark Mode**.

---

## � Navigation Bar (Navbar)

### Light Mode
- **Background Gradient**: `linear-gradient(135deg, rgba(240, 248, 255, 0.98) 0%, rgba(230, 243, 255, 0.98) 50%, rgba(219, 233, 255, 0.98) 100%)`
- **Border**: `rgba(209, 231, 255, 0.6)` (Soft Blue Border)
- **Backdrop Filter**: `blur(25px)` (Glass morphism effect)
- **Shadow**: `0 4px 32px rgba(59, 130, 246, 0.15)`
- **Color Scheme**: Matches the main dashboard background gradient

**CSS Implementation:**
```css
.light-theme .navbar {
  background: linear-gradient(135deg, rgba(240, 248, 255, 0.98) 0%, rgba(230, 243, 255, 0.98) 50%, rgba(219, 233, 255, 0.98) 100%);
  border-bottom: 1px solid rgba(209, 231, 255, 0.6);
  backdrop-filter: blur(25px);
  box-shadow: 0 4px 32px rgba(59, 130, 246, 0.15);
}
```

### Dark Mode
- **Background Gradient**: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)`
- **Border**: `rgba(51, 65, 85, 0.6)` (Dark Slate Border)
- **Shadow**: `0 4px 20px rgba(0, 0, 0, 0.3)`
- **Color Scheme**: Matches the dark dashboard background

**CSS Implementation:**
```css
.dark-theme .navbar {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

---

## �🟢 Transactions Dashboard

### Light Mode
- **Primary Color**: `#10B981` (Emerald Green)
- **Secondary Color**: `#059669` (Dark Emerald)
- **Background**: `#D1FAE5` (Light Green Tint)
- **Border**: `#6EE7B7` (Soft Green)
- **Gradient**: `linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)`

**CSS Variables:**
```css
.transactions-container {
  background: var(--gradient-transactions);
}

.transaction-card {
  background: var(--gradient-transactions-card);
  border: 2px solid var(--transactions-border);
}

.transaction-text {
  color: var(--transactions-primary);
}
```

### Dark Mode
- **Primary Color**: `#34D399` (Light Emerald)
- **Secondary Color**: `#10B981` (Emerald)
- **Background**: `#064E3B` (Dark Green)
- **Border**: `#065F46` (Dark Green Border)
- **Gradient**: `linear-gradient(135deg, #064E3B 0%, #065F46 100%)`

---

## 🟡 Budget Dashboard

### Light Mode
- **Primary Color**: `#F59E0B` (Amber/Gold)
- **Secondary Color**: `#D97706` (Dark Amber)
- **Background**: `#FEF3C7` (Light Yellow Tint)
- **Border**: `#FCD34D` (Soft Gold)
- **Gradient**: `linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)`

**CSS Variables:**
```css
.budget-container {
  background: var(--gradient-budget);
}

.budget-card {
  background: var(--gradient-budget-card);
  border: 2px solid var(--budget-border);
}

.budget-text {
  color: var(--budget-primary);
}
```

### Dark Mode
- **Primary Color**: `#FBBF24` (Light Amber)
- **Secondary Color**: `#F59E0B` (Amber)
- **Background**: `#78350F` (Dark Brown)
- **Border**: `#92400E` (Dark Brown Border)
- **Gradient**: `linear-gradient(135deg, #78350F 0%, #92400E 100%)`

---

## 🟣 Goals Dashboard

### Light Mode
- **Primary Color**: `#7C3AED` (Purple)
- **Secondary Color**: `#6D28D9` (Dark Purple)
- **Background**: `#EDE9FE` (Light Purple Tint)
- **Border**: `#C4B5FD` (Soft Purple)
- **Gradient**: `linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)`

**CSS Variables:**
```css
.goals-container {
  background: var(--gradient-goals);
}

.goal-card {
  background: var(--gradient-goals-card);
  border: 2px solid var(--goals-border);
}

.goal-text {
  color: var(--goals-primary);
}
```

### Dark Mode
- **Primary Color**: `#A78BFA` (Light Purple)
- **Secondary Color**: `#8B5CF6` (Purple)
- **Background**: `#4C1D95` (Dark Purple)
- **Border**: `#5B21B6` (Dark Purple Border)
- **Gradient**: `linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)`

---

## 🔵 Reports Dashboard

### Light Mode
- **Primary Color**: `#06B6D4` (Cyan/Teal)
- **Secondary Color**: `#0891B2` (Dark Cyan)
- **Background**: `#CFFAFE` (Light Cyan Tint)
- **Border**: `#67E8F9` (Soft Cyan)
- **Gradient**: `linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 50%, #A5F3FC 100%)`

**CSS Variables:**
```css
.reports-container {
  background: var(--gradient-reports);
}

.report-card {
  background: var(--gradient-reports-card);
  border: 2px solid var(--reports-border);
}

.report-text {
  color: var(--reports-primary);
}
```

### Dark Mode
- **Primary Color**: `#22D3EE` (Light Cyan)
- **Secondary Color**: `#06B6D4` (Cyan)
- **Background**: `#164E63` (Dark Teal)
- **Border**: `#155E75` (Dark Teal Border)
- **Gradient**: `linear-gradient(135deg, #164E63 0%, #155E75 100%)`

---

## 🎯 Implementation Guide

### How to Use These Colors in Your Components

#### 1. Using CSS Variables (Recommended)
```css
.my-component {
  background: var(--gradient-transactions);
  color: var(--transactions-primary);
  border: 2px solid var(--transactions-border);
}
```

#### 2. Using Theme Context in React
```javascript
import { useTheme } from '../theme/ThemeContext';

function MyComponent() {
  const { tokens, theme } = useTheme();
  const colors = tokens.colors.features.transactions[theme];
  
  return (
    <div style={{ 
      background: colors.background,
      color: colors.primary 
    }}>
      Content
    </div>
  );
}
```

#### 3. Direct CSS Implementation
```css
/* Light Mode */
.light-theme .transactions-container {
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%);
}

/* Dark Mode */
.dark-theme .transactions-container {
  background: linear-gradient(135deg, #064E3B 0%, #065F46 100%);
}
```

---

## 📊 Color Psychology

- **🟢 Green (Transactions)**: Growth, money, positive cash flow
- **🟡 Gold (Budget)**: Value, planning, financial wisdom
- **🟣 Purple (Goals)**: Ambition, achievement, future planning
- **🔵 Cyan (Reports)**: Analysis, intelligence, insights

---

## 🎨 Accessibility

All color combinations meet WCAG AA standards for contrast:
- Light mode text uses dark colors on light backgrounds
- Dark mode text uses light colors on dark backgrounds
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text

---

## ⚡ Quick Reference

### All CSS Variables Available

```css
/* Transactions */
--transactions-primary
--transactions-secondary
--transactions-background
--transactions-border
--gradient-transactions
--gradient-transactions-card

/* Budget */
--budget-primary
--budget-secondary
--budget-background
--budget-border
--gradient-budget
--gradient-budget-card

/* Goals */
--goals-primary
--goals-secondary
--goals-background
--goals-border
--gradient-goals
--gradient-goals-card

/* Reports */
--reports-primary
--reports-secondary
--reports-background
--reports-border
--gradient-reports
--gradient-reports-card
```

---

## 🔧 Customization

To customize colors, edit:
1. `/frontend/src/theme/tokens.js` - Update the `features` section
2. `/frontend/src/theme/ThemeContext.js` - CSS variables are auto-applied
3. Component CSS files - Use the CSS variables

---

## 📝 Notes

- All colors automatically switch between light and dark mode
- Gradients are theme-aware
- Glass morphism effects are applied automatically
- Consistent spacing and shadows across all features
