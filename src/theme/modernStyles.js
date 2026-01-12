/**
 * Modern Design System for CAMORENT Admin
 * Includes glassmorphism, neumorphism, and modern shadows
 */

import { responsive } from '../utils/responsive';

/**
 * Modern shadow presets for different elevations
 */
export const shadows = {
  // Subtle shadow for floating elements
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // Medium shadow for cards
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // Large shadow for modals
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  // Extra large shadow for major elements
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  // Colored shadows for brand elements
  primary: {
    shadowColor: '#701AD3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  success: {
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  error: {
    shadowColor: '#FF453A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

/**
 * Glassmorphism effect
 */
export const glassmorphism = (isDark, opacity = 0.1) => ({
  backgroundColor: isDark
    ? `rgba(255, 255, 255, ${opacity})`
    : `rgba(0, 0, 0, ${opacity})`,
  backdropFilter: 'blur(10px)',
  borderWidth: 1,
  borderColor: isDark
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.1)',
});

/**
 * Neumorphism effect (soft UI)
 */
export const neumorphism = (isDark) => ({
  backgroundColor: isDark ? '#1C1C28' : '#F2F2F7',
  shadowColor: isDark ? '#000' : '#FFF',
  shadowOffset: {
    width: -5,
    height: -5,
  },
  shadowOpacity: isDark ? 0.3 : 1,
  shadowRadius: 10,
  elevation: 3,
});

/**
 * Modern gradient configurations
 */
export const gradients = {
  primary: ['#8B3DE6', '#701AD3', '#5A15AB'],
  primaryHorizontal: ['#8B3DE6', '#701AD3'],
  primaryVertical: ['#701AD3', '#5A15AB'],

  success: ['#34C759', '#30D158', '#28A745'],
  error: ['#FF453A', '#FF3B30', '#D92D20'],
  warning: ['#FF9F0A', '#FF8C00', '#FF7000'],

  dark: ['#0A0A0F', '#1C1C28', '#252535'],
  light: ['#FFFFFF', '#F2F2F7', '#E5E5EA'],

  purpleDark: ['#2A0A4D', '#3D1566', '#4F1F7F'],
  subtle: ['rgba(112, 26, 211, 0.1)', 'rgba(139, 61, 230, 0.1)'],
};

/**
 * Modern card styles
 */
export const modernCard = (theme, elevation = 'md') => ({
  backgroundColor: theme.surface,
  borderRadius: responsive.borderRadius.lg,
  padding: responsive.cardPadding,
  marginBottom: responsive.spacing.md,
  borderWidth: 1,
  borderColor: theme.surfaceBorder,
  ...shadows[elevation],
});

/**
 * Modern button styles
 */
export const modernButton = {
  base: {
    borderRadius: responsive.borderRadius.md,
    paddingVertical: responsive.spacing.md,
    paddingHorizontal: responsive.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },

  primary: () => ({
    backgroundColor: '#701AD3',
    ...shadows.primary,
  }),

  secondary: (theme) => ({
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: '#701AD3',
    ...shadows.sm,
  }),

  success: {
    backgroundColor: '#34C759',
    ...shadows.success,
  },

  error: {
    backgroundColor: '#FF453A',
    ...shadows.error,
  },

  ghost: (theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  }),
};

/**
 * Modern input styles
 */
export const modernInput = (theme, isFocused = false) => ({
  backgroundColor: theme.inputBackground,
  borderRadius: responsive.borderRadius.md,
  paddingHorizontal: responsive.spacing.md,
  height: responsive.inputHeight,
  borderWidth: 2,
  borderColor: isFocused ? '#701AD3' : theme.surfaceBorder,
  fontSize: responsive.fontSize.md,
  color: theme.text,
  ...(!isFocused && shadows.sm),
  ...(isFocused && shadows.primary),
});

/**
 * Modern badge styles
 */
export const modernBadge = (color, size = 'md') => {
  const sizeMap = {
    sm: {
      paddingHorizontal: responsive.spacing.sm,
      paddingVertical: responsive.spacing.xs,
      fontSize: responsive.fontSize.xs,
      borderRadius: responsive.borderRadius.xs,
    },
    md: {
      paddingHorizontal: responsive.spacing.md,
      paddingVertical: responsive.spacing.sm,
      fontSize: responsive.fontSize.sm,
      borderRadius: responsive.borderRadius.sm,
    },
    lg: {
      paddingHorizontal: responsive.spacing.lg,
      paddingVertical: responsive.spacing.md,
      fontSize: responsive.fontSize.md,
      borderRadius: responsive.borderRadius.md,
    },
  };

  return {
    backgroundColor: `${color}15`,
    borderWidth: 1,
    borderColor: `${color}40`,
    ...sizeMap[size],
  };
};

/**
 * Modern tab bar styles
 */
export const modernTabBar = (theme) => ({
  backgroundColor: theme.surface,
  borderTopWidth: 0,
  height: responsive.tabBarHeight,
  paddingBottom: responsive.spacing.sm,
  paddingTop: responsive.spacing.sm,
  ...shadows.xl,
  borderTopLeftRadius: responsive.borderRadius.xl,
  borderTopRightRadius: responsive.borderRadius.xl,
});

/**
 * Modern header styles
 */
export const modernHeader = (theme) => ({
  backgroundColor: theme.surface,
  borderBottomWidth: 0,
  height: responsive.headerHeight,
  ...shadows.sm,
});

/**
 * Shimmer loading effect colors
 */
export const shimmerColors = (isDark) =>
  isDark
    ? ['#1C1C28', '#252535', '#1C1C28']
    : ['#E5E5EA', '#F2F2F7', '#E5E5EA'];

/**
 * Skeleton loader
 */
export const skeleton = (isDark, width = '100%', height = 20) => ({
  width,
  height,
  backgroundColor: isDark ? '#252535' : '#E5E5EA',
  borderRadius: responsive.borderRadius.sm,
  overflow: 'hidden',
});

/**
 * Modern divider
 */
export const modernDivider = (theme, orientation = 'horizontal') => {
  if (orientation === 'horizontal') {
    return {
      height: 1,
      width: '100%',
      backgroundColor: theme.surfaceBorder,
      marginVertical: responsive.spacing.md,
    };
  }
  return {
    width: 1,
    height: '100%',
    backgroundColor: theme.surfaceBorder,
    marginHorizontal: responsive.spacing.md,
  };
};

/**
 * Ripple effect configuration
 */
export const rippleConfig = {
  color: 'rgba(112, 26, 211, 0.2)',
  borderless: false,
  radius: -1,
};

/**
 * Modern floating action button
 */
export const modernFAB = {
  position: 'absolute',
  right: responsive.spacing.lg,
  bottom: responsive.spacing.xl,
  width: responsive.iconSize.xxl + responsive.spacing.lg,
  height: responsive.iconSize.xxl + responsive.spacing.lg,
  borderRadius: responsive.borderRadius.round,
  backgroundColor: '#701AD3',
  alignItems: 'center',
  justifyContent: 'center',
  ...shadows.xl,
};

/**
 * Blur overlay for modals
 */
export const blurOverlay = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
};

export default {
  shadows,
  glassmorphism,
  neumorphism,
  gradients,
  modernCard,
  modernButton,
  modernInput,
  modernBadge,
  modernTabBar,
  modernHeader,
  shimmerColors,
  skeleton,
  modernDivider,
  rippleConfig,
  modernFAB,
  blurOverlay,
};
