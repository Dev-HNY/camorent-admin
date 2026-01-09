/**
 * AnimatedButton Component
 * Reusable button with animations, proper text sizing, and loading states
 */
import { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { responsive } from '../utils/responsive';
import { shadows } from '../theme/modernStyles';

const AnimatedButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, success, warning, danger, ghost
  size = 'medium', // small, medium, large
  icon,
  iconPosition = 'left', // left, right
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  animationType = 'scale', // scale, shimmer, pulse, bounce
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Shimmer animation for gradient buttons
  useEffect(() => {
    if (animationType === 'shimmer' && !disabled && !loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animationType, disabled, loading]);

  // Pulse animation
  useEffect(() => {
    if (animationType === 'pulse' && !disabled && !loading) {
      Animated.loop(
        Animated.sequence([
          Animated.spring(pulseAnim, {
            toValue: 1.03,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animationType, disabled, loading]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        background: ['#000000', '#1C1C1E', '#2C2C2E'],
        text: '#FFFFFF',
        border: 'transparent',
      },
      secondary: {
        background: ['#34C759', '#40D368', '#4DDF77'],
        text: '#FFFFFF',
        border: 'transparent',
      },
      success: {
        background: ['#34C759', '#40D368'],
        text: '#FFFFFF',
        border: 'transparent',
      },
      warning: {
        background: ['#FF9F0A', '#FFB340'],
        text: '#FFFFFF',
        border: 'transparent',
      },
      danger: {
        background: ['#FF3B30', '#FF5449'],
        text: '#FFFFFF',
        border: 'transparent',
      },
      ghost: {
        background: ['transparent', 'transparent'],
        text: '#000000',
        border: '#000000',
      },
    };

    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingHorizontal: responsive.spacing.md,
        paddingVertical: responsive.spacing.sm,
        fontSize: responsive.fontSize.sm,
        iconSize: responsive.iconSize.sm,
        borderRadius: responsive.borderRadius.sm,
      },
      medium: {
        paddingHorizontal: responsive.spacing.lg,
        paddingVertical: responsive.spacing.md,
        fontSize: responsive.fontSize.md,
        iconSize: responsive.iconSize.sm + 2,
        borderRadius: responsive.borderRadius.md,
      },
      large: {
        paddingHorizontal: responsive.spacing.xl,
        paddingVertical: responsive.spacing.md + 2,
        fontSize: responsive.fontSize.lg,
        iconSize: responsive.iconSize.md,
        borderRadius: responsive.borderRadius.md,
      },
    };

    return sizes[size] || sizes.medium;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  const animationStyle = {
    transform: [
      { scale: animationType === 'scale' || animationType === 'bounce' ? scaleAnim : 1 },
      { scale: animationType === 'pulse' ? pulseAnim : 1 },
    ],
  };

  const shimmerStyle = {
    transform: [
      {
        translateX: shimmerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-300, 300],
        }),
      },
    ],
  };

  const ButtonContent = () => (
    <View style={[styles.contentContainer, fullWidth && styles.fullWidth]}>
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: variantStyles.text,
                fontSize: sizeStyles.fontSize,
                fontWeight: '600',
              },
              textStyle,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  return (
    <Animated.View style={[animationStyle, style, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          styles.button,
          {
            borderRadius: sizeStyles.borderRadius,
            opacity: isDisabled ? 0.6 : 1,
          },
          fullWidth && styles.fullWidth,
        ]}
      >
        <LinearGradient
          colors={variantStyles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            {
              paddingHorizontal: sizeStyles.paddingHorizontal,
              paddingVertical: sizeStyles.paddingVertical,
              borderRadius: sizeStyles.borderRadius,
              borderWidth: variant === 'ghost' ? 1.5 : 0,
              borderColor: variantStyles.border,
            },
          ]}
        >
          {animationType === 'shimmer' && !isDisabled && (
            <Animated.View style={[styles.shimmer, shimmerStyle]} />
          )}
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    ...shadows.md,
  },
  gradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsive.spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  iconLeft: {
    marginRight: responsive.spacing.xs,
  },
  iconRight: {
    marginLeft: responsive.spacing.xs,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 100,
  },
});

export default AnimatedButton;
