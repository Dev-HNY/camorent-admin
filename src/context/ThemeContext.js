import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Default to light theme
  const [isTransitioning, setIsTransitioning] = useState(false);
  const themeTransitionAnim = useRef(new Animated.Value(1)).current;

  const toggleTheme = () => {
    setIsTransitioning(true);

    // Animate theme transition
    Animated.sequence([
      Animated.timing(themeTransitionAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(themeTransitionAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsTransitioning(false);
    });

    // Toggle theme in the middle of animation
    setTimeout(() => {
      setIsDark(prev => !prev);
    }, 150);
  };

  const value = {
    isDark,
    toggleTheme,
    isTransitioning,
    themeTransitionAnim,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
