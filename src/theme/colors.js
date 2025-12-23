// Camorent Brand Colors - Black Theme
export const BRAND_COLORS = {
  primary: '#000000',
  primaryLight: '#1C1C1E',
  primaryDark: '#000000',
  accent: '#2C2C2E',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

// Dark Theme
export const DARK_THEME = {
  // Background gradients
  gradientStart: '#000000',
  gradientMid: '#0A0A0A',
  gradientEnd: '#1C1C1E',

  // Surface colors
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  surfaceBorder: '#3A3A3C',
  surfaceBorderFocused: '#FFFFFF',

  // Logo container
  logoBackground: 'rgba(255, 255, 255, 0.05)',
  logoBorder: 'rgba(255, 255, 255, 0.1)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textQuaternary: '#636366',
  textDisabled: '#48484A',

  // Input colors
  inputBackground: '#1C1C1E',
  inputBackgroundFocused: '#2C2C2E',
  inputBorder: '#3A3A3C',
  inputBorderFocused: '#FFFFFF',
  inputIcon: '#8E8E93',
  inputPlaceholder: '#48484A',

  // Button colors
  buttonGradientEnabled: ['#000000', '#1C1C1E'],
  buttonGradientDisabled: ['#3A3A3C', '#48484A'],
  buttonText: '#FFFFFF',
  buttonShadow: '#000000',

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
