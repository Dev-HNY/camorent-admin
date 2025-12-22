// Camorent Brand Colors - Maintaining brand identity
export const BRAND_COLORS = {
  primary: '#701AD3',
  primaryLight: '#8B3DE6',
  primaryDark: '#5A15A8',
  accent: '#9D4EDD',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

// Dark Theme
export const DARK_THEME = {
  // Background gradients
  gradientStart: '#0A0A0A',
  gradientMid: '#1C1C1E',
  gradientEnd: '#2C2C2E',

  // Surface colors
  surface: '#1C1C1E',
  surfaceElevated: '#232325',
  surfaceBorder: '#2C2C2E',
  surfaceBorderFocused: BRAND_COLORS.primary,

  // Logo container
  logoBackground: 'rgba(112, 26, 211, 0.1)',
  logoBorder: 'rgba(112, 26, 211, 0.2)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textQuaternary: '#636366',
  textDisabled: '#48484A',

  // Input colors
  inputBackground: '#1C1C1E',
  inputBackgroundFocused: '#232325',
  inputBorder: '#2C2C2E',
  inputBorderFocused: BRAND_COLORS.primary,
  inputIcon: '#8E8E93',
  inputPlaceholder: '#48484A',

  // Button colors
  buttonGradientEnabled: [BRAND_COLORS.primary, BRAND_COLORS.primaryLight],
  buttonGradientDisabled: ['#3A3A3C', '#48484A'],
  buttonText: '#FFFFFF',
  buttonShadow: BRAND_COLORS.primary,

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
  gradientStart: '#F8F9FA',
  gradientMid: '#FFFFFF',
  gradientEnd: '#F0F0F5',

  // Surface colors
  surface: '#FFFFFF',
  surfaceElevated: '#F8F9FA',
  surfaceBorder: '#E5E5EA',
  surfaceBorderFocused: BRAND_COLORS.primary,

  // Logo container
  logoBackground: 'rgba(112, 26, 211, 0.08)',
  logoBorder: 'rgba(112, 26, 211, 0.15)',

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
  buttonGradientEnabled: [BRAND_COLORS.primary, BRAND_COLORS.primaryLight],
  buttonGradientDisabled: ['#E5E5EA', '#D1D1D6'],
  buttonText: '#FFFFFF',
  buttonShadow: BRAND_COLORS.primary,

  // Security badge
  securityBackground: 'rgba(52, 199, 89, 0.08)',
  securityBorder: 'rgba(52, 199, 89, 0.15)',
  securityText: '#2D9F51',

  // Status bar
  statusBar: 'dark',
};

export const getTheme = (isDark) => isDark ? DARK_THEME : LIGHT_THEME;
