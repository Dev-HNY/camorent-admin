/**
 * Production-ready animation configurations
 * Apple & Airbnb style smooth animations
 */

import { Animated, Easing } from 'react-native';

/**
 * Standard animation timings (60fps optimized)
 */
export const TIMINGS = {
  fastest: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  slowest: 500,
};

/**
 * Easing curves for smooth animations
 */
export const EASINGS = {
  // Apple-style ease out (most common)
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),

  // Standard easing
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  easeIn: Easing.bezier(0.42, 0, 1, 1),

  // Spring-like
  spring: Easing.bezier(0.68, -0.55, 0.265, 1.55),

  // Smooth
  smooth: Easing.bezier(0.4, 0.0, 0.2, 1),
};

/**
 * Spring configurations
 */
export const SPRINGS = {
  light: {
    tension: 300,
    friction: 20,
    useNativeDriver: true,
  },
  medium: {
    tension: 200,
    friction: 25,
    useNativeDriver: true,
  },
  heavy: {
    tension: 150,
    friction: 30,
    useNativeDriver: true,
  },
  gentle: {
    tension: 180,
    friction: 28,
    useNativeDriver: true,
  },
};

/**
 * Fade animation
 */
export const fadeIn = (animatedValue, duration = TIMINGS.normal) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: EASINGS.ease,
    useNativeDriver: true,
  });
};

export const fadeOut = (animatedValue, duration = TIMINGS.normal) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASINGS.ease,
    useNativeDriver: true,
  });
};

/**
 * Scale animation
 */
export const scaleIn = (animatedValue, duration = TIMINGS.normal) => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    ...SPRINGS.gentle,
  });
};

export const scaleOut = (animatedValue, duration = TIMINGS.fast) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASINGS.easeIn,
    useNativeDriver: true,
  });
};

/**
 * Slide animation
 */
export const slideUp = (animatedValue, distance = 50, duration = TIMINGS.normal) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASINGS.ease,
    useNativeDriver: true,
  });
};

export const slideDown = (animatedValue, distance = 50, duration = TIMINGS.normal) => {
  return Animated.timing(animatedValue, {
    toValue: distance,
    duration,
    easing: EASINGS.easeIn,
    useNativeDriver: true,
  });
};

/**
 * Combined entrance animation (Apple-style)
 */
export const entranceAnimation = (opacity, translateY, options = {}) => {
  const {
    duration = TIMINGS.normal,
    delay = 0,
    onComplete,
  } = options;

  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: EASINGS.ease,
      useNativeDriver: true,
    }),
    Animated.spring(translateY, {
      toValue: 0,
      delay,
      ...SPRINGS.gentle,
    }),
  ]).start(onComplete);
};

/**
 * Combined exit animation
 */
export const exitAnimation = (opacity, translateY, options = {}) => {
  const {
    duration = TIMINGS.fast,
    onComplete,
  } = options;

  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      easing: EASINGS.easeIn,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 30,
      duration,
      easing: EASINGS.easeIn,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

/**
 * Stagger animation helper
 */
export const stagger = (animations, staggerDelay = 100) => {
  return Animated.stagger(staggerDelay, animations);
};

/**
 * Press animation (scale down and back)
 */
export const pressAnimation = (scale) => {
  return Animated.sequence([
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      easing: EASINGS.ease,
      useNativeDriver: true,
    }),
    Animated.spring(scale, {
      toValue: 1,
      ...SPRINGS.light,
    }),
  ]);
};

/**
 * Shimmer/Pulse animation (continuous)
 */
export const createPulseAnimation = (animatedValue, options = {}) => {
  const {
    minValue = 0.8,
    maxValue = 1,
    duration = 1000,
  } = options;

  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: duration / 2,
        easing: EASINGS.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: duration / 2,
        easing: EASINGS.easeInOut,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Rotation animation
 */
export const rotate = (animatedValue, duration = TIMINGS.normal) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: EASINGS.ease,
    useNativeDriver: true,
  });
};

export default {
  TIMINGS,
  EASINGS,
  SPRINGS,
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  slideUp,
  slideDown,
  entranceAnimation,
  exitAnimation,
  stagger,
  pressAnimation,
  createPulseAnimation,
  rotate,
};
