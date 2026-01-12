// Camorent Brand Colors - Purple Theme
export const BRAND_COLORS = {
  primary: '#701AD3',
  primaryLight: '#8B3DE6',
  primaryDark: '#5A15AB',
  accent: '#9D52ED',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

// Dark Theme
export const DARK_THEME = {
  // Background gradients
  gradientStart: '#0A0A0F',
  gradientMid: '#121218',
  gradientEnd: '#1A1A24',

  // Surface colors
  surface: '#1C1C28',
  surfaceElevated: '#252535',
  surfaceBorder: '#3A3A4C',
  surfaceBorderFocused: '#701AD3',

  // Logo container
  logoBackground: 'rgba(255, 255, 255, 0.05)',
  logoBorder: 'rgba(255, 255, 255, 0.1)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E5EA',
  textTertiary: '#A0A0AB',
  textQuaternary: '#6C6C76',
  textDisabled: '#48484A',

  // Input colors
  inputBackground: '#252535',
  inputBackgroundFocused: '#2C2C3E',
  inputBorder: '#3A3A4C',
  inputBorderFocused: '#701AD3',
  inputIcon: '#A0A0AB',
  inputPlaceholder: '#6C6C76',

  // Button colors
  buttonGradientEnabled: ['#701AD3', '#8B3DE6'],
  buttonGradientDisabled: ['#3A3A4C', '#48484A'],
  buttonText: '#FFFFFF',
  buttonShadow: '#701AD3',

  // Security badge
  securityBackground: 'rgba(52, 199, 89, 0.1)',
  securityBorder: 'rgba(52, 199, 89, 0.2)',
  securityText: BRAND_COLORS.success,

  // Status bar
  statusBar: 'light',
};

// Light Theme
export const LIGHT_THEME = {
  // Background gradients
  gradientStart: '#FAFAFA',
  gradientMid: '#FFFFFF',
  gradientEnd: '#F5F5F7',

  // Surface colors
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',
  surfaceBorder: '#E5E5EA',
  surfaceBorderFocused: '#701AD3',

  // Logo container
  logoBackground: 'rgba(0, 0, 0, 0.08)',
  logoBorder: 'rgba(0, 0, 0, 0.15)',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#1C1C1E',
  textTertiary: '#3A3A3C',
  textQuaternary: '#8E8E93',
  textDisabled: '#C7C7CC',

  // Input colors
  inputBackground: '#FFFFFF',
  inputBackgroundFocused: '#F8F9FA',
  inputBorder: '#E5E5EA',
  inputBorderFocused: BRAND_COLORS.primary,
  inputIcon: '#8E8E93',
  inputPlaceholder: '#C7C7CC',

  // Button colors
  buttonGradientEnabled: ['#701AD3', '#8B3DE6'],
  buttonGradientDisabled: ['#E5E5EA', '#D1D1D6'],
  buttonText: '#FFFFFF',
  buttonShadow: '#701AD3',

  // Security badge
  securityBackground: 'rgba(52, 199, 89, 0.08)',
  securityBorder: 'rgba(52, 199, 89, 0.15)',
  securityText: '#2D9F51',

  // Status bar
  statusBar: 'dark',
};

export const getTheme = (isDark) => isDark ? DARK_THEME : LIGHT_THEME;
