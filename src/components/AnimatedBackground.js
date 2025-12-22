import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  // Create multiple animated values for floating circles
  const circle1Anim = useRef(new Animated.Value(0)).current;
  const circle2Anim = useRef(new Animated.Value(0)).current;
  const circle3Anim = useRef(new Animated.Value(0)).current;
  const circle4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for circle 1 - Smoother with longer duration
    const circle1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(circle1Anim, {
          toValue: 1,
          duration: 15000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(circle1Anim, {
          toValue: 0,
          duration: 15000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Floating animation for circle 2 - Smoother with longer duration
    const circle2Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(circle2Anim, {
          toValue: 1,
          duration: 18000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(circle2Anim, {
          toValue: 0,
          duration: 18000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Floating animation for circle 3 - Smoother with longer duration
    const circle3Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(circle3Anim, {
          toValue: 1,
          duration: 20000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(circle3Anim, {
          toValue: 0,
          duration: 20000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Floating animation for circle 4 - Smoother with longer duration
    const circle4Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(circle4Anim, {
          toValue: 1,
          duration: 16000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(circle4Anim, {
          toValue: 0,
          duration: 16000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    circle1Animation.start();
    circle2Animation.start();
    circle3Animation.start();
    circle4Animation.start();

    return () => {
      circle1Animation.stop();
      circle2Animation.stop();
      circle3Animation.stop();
      circle4Animation.stop();
    };
  }, []);

  // Interpolate animations for smooth movements
  const circle1TranslateY = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const circle1TranslateX = circle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const circle2TranslateY = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const circle2TranslateX = circle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const circle3TranslateY = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  const circle3TranslateX = circle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const circle4TranslateY = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 45],
  });

  const circle4TranslateX = circle4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Circle 1 - Top Left */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          {
            backgroundColor: isDark
              ? 'rgba(112, 26, 211, 0.08)'
              : 'rgba(112, 26, 211, 0.05)',
            transform: [
              { translateY: circle1TranslateY },
              { translateX: circle1TranslateX },
            ],
          },
        ]}
      />

      {/* Circle 2 - Top Right */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            backgroundColor: isDark
              ? 'rgba(52, 199, 89, 0.08)'
              : 'rgba(52, 199, 89, 0.05)',
            transform: [
              { translateY: circle2TranslateY },
              { translateX: circle2TranslateX },
            ],
          },
        ]}
      />

      {/* Circle 3 - Bottom Left */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          {
            backgroundColor: isDark
              ? 'rgba(255, 159, 10, 0.08)'
              : 'rgba(255, 159, 10, 0.05)',
            transform: [
              { translateY: circle3TranslateY },
              { translateX: circle3TranslateX },
            ],
          },
        ]}
      />

      {/* Circle 4 - Bottom Right */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle4,
          {
            backgroundColor: isDark
              ? 'rgba(112, 26, 211, 0.06)'
              : 'rgba(112, 26, 211, 0.04)',
            transform: [
              { translateY: circle4TranslateY },
              { translateX: circle4TranslateX },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: width * 0.6,
    height: width * 0.6,
    top: -width * 0.2,
    left: -width * 0.15,
  },
  circle2: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.3,
    right: -width * 0.25,
  },
  circle3: {
    width: width * 0.5,
    height: width * 0.5,
    bottom: -width * 0.15,
    left: -width * 0.1,
  },
  circle4: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.4,
    right: -width * 0.3,
  },
});
