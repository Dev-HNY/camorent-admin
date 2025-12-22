/**
 * AnimatedCard Component
 * Reusable card with entrance animations and press effects
 */
import { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Easing,
} from 'react-native';

const AnimatedCard = ({
  children,
  onPress,
  delay = 0,
  style,
  animationType = 'slideUp', // slideUp, fadeIn, scale, slideLeft
  pressable = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animations = [];

    // Fade in animation
    animations.push(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    );

    // Slide/Scale animation based on type
    if (animationType === 'slideUp' || animationType === 'slideLeft') {
      animations.push(
        Animated.spring(slideAnim, {
          toValue: 0,
          delay,
          friction: 9,
          tension: 50,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'scale') {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, []);

  const handlePressIn = () => {
    if (!pressable) return;
    Animated.spring(pressScale, {
      toValue: 0.97,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!pressable) return;
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const getTransform = () => {
    const transforms = [{ scale: pressScale }];

    if (animationType === 'slideUp') {
      transforms.push({ translateY: slideAnim });
    } else if (animationType === 'slideLeft') {
      transforms.push({ translateX: slideAnim });
    } else if (animationType === 'scale') {
      transforms.push({ scale: scaleAnim });
    }

    return transforms;
  };

  const CardWrapper = pressable && onPress ? TouchableOpacity : View;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: getTransform(),
        },
        style,
      ]}
    >
      <CardWrapper
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={!pressable || !onPress}
        style={styles.card}
      >
        {children}
      </CardWrapper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    width: '100%',
  },
});

export default AnimatedCard;
