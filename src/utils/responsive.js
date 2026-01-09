/**
 * Responsive Utilities for CAMORENT Admin
 * Handles dynamic sizing, spacing, and typography across all screen sizes
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design was made for iPhone 14 Pro)
const baseWidth = 393;
const baseHeight = 852;

/**
 * Scale function to scale values based on screen width
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const scale = (size) => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

/**
 * Vertical scale function to scale values based on screen height
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const verticalScale = (size) => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

/**
 * Moderate scale with a factor to control scaling intensity
 * @param {number} size - The size to scale
 * @param {number} factor - Scaling factor (default 0.5)
 * @returns {number} - Moderately scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

/**
 * Moderate vertical scale
 * @param {number} size - The size to scale
 * @param {number} factor - Scaling factor (default 0.5)
 * @returns {number} - Moderately scaled size
 */
export const moderateVerticalScale = (size, factor = 0.5) => {
  return size + (verticalScale(size) - size) * factor;
};

/**
 * Font scale with PixelRatio normalization
 * @param {number} size - Font size
 * @returns {number} - Normalized font size
 */
export const fontScale = (size) => {
  const newSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

/**
 * Responsive sizing utilities
 */
export const responsive = {
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Device types
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,

  // Spacing
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },

  // Border radius
  borderRadius: {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
    xxl: scale(24),
    round: scale(999),
  },

  // Icon sizes
  iconSize: {
    xs: scale(16),
    sm: scale(20),
    md: scale(24),
    lg: scale(32),
    xl: scale(40),
    xxl: scale(48),
  },

  // Font sizes
  fontSize: {
    xs: fontScale(10),
    sm: fontScale(12),
    md: fontScale(14),
    lg: fontScale(16),
    xl: fontScale(18),
    xxl: fontScale(20),
    xxxl: fontScale(24),
    huge: fontScale(32),
  },

  // Card sizes
  cardPadding: scale(16),
  cardMinHeight: verticalScale(100),

  // Button sizes
  buttonHeight: {
    sm: verticalScale(36),
    md: verticalScale(44),
    lg: verticalScale(52),
  },

  // Input sizes
  inputHeight: verticalScale(48),

  // Header height
  headerHeight: verticalScale(60),

  // Tab bar height
  tabBarHeight: verticalScale(60),
};

/**
 * Get responsive padding for containers
 * @param {string} size - 'sm', 'md', 'lg'
 * @returns {object} - Padding object
 */
export const getResponsivePadding = (size = 'md') => {
  const paddingMap = {
    sm: responsive.spacing.sm,
    md: responsive.spacing.md,
    lg: responsive.spacing.lg,
  };

  const padding = paddingMap[size] || responsive.spacing.md;

  return {
    paddingHorizontal: padding,
    paddingVertical: padding * 0.75,
  };
};

/**
 * Get responsive margin
 * @param {string} size - 'sm', 'md', 'lg'
 * @returns {object} - Margin object
 */
export const getResponsiveMargin = (size = 'md') => {
  const marginMap = {
    sm: responsive.spacing.sm,
    md: responsive.spacing.md,
    lg: responsive.spacing.lg,
  };

  return marginMap[size] || responsive.spacing.md;
};

/**
 * Check if current orientation is landscape
 * @returns {boolean}
 */
export const isLandscape = () => SCREEN_WIDTH > SCREEN_HEIGHT;

/**
 * Get safe area insets (approximate)
 * @returns {object}
 */
export const getSafeAreaInsets = () => {
  const isIphoneX = Platform.OS === 'ios' && SCREEN_HEIGHT >= 812;

  return {
    top: isIphoneX ? 44 : 20,
    bottom: isIphoneX ? 34 : 0,
  };
};

/**
 * Animation timing configurations
 */
export const animations = {
  // Durations
  duration: {
    fastest: 150,
    fast: 200,
    normal: 300,
    slow: 400,
    slowest: 500,
  },

  // Spring configs
  spring: {
    light: {
      tension: 50,
      friction: 7,
    },
    medium: {
      tension: 40,
      friction: 8,
    },
    heavy: {
      tension: 30,
      friction: 10,
    },
  },

  // Easing curves
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    linear: 'linear',
  },
};

export default responsive;
