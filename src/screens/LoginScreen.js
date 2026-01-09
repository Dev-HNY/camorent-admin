import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Easing,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { responsive } from '../utils/responsive';
import { shadows } from '../theme/modernStyles';

const { width } = Dimensions.get('window');

export default function LoginScreen({ onLogin }) {
  const { isDark, themeTransitionAnim } = useTheme();
  const theme = getTheme(isDark);
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Delayed form animation
    setTimeout(() => {
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    }, 300);

    // Continuous button pulse when enabled
    if (phoneNumber && password) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(buttonPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    }
  }, [phoneNumber, password]);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please enter phone number and password');
      return;
    }

    setIsLoading(true);

    // Animate button press
    Animated.sequence([
      Animated.timing(buttonPulse, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const result = await login(phoneNumber, password);

      if (result.success) {
        // Login successful, onLogin will be called by App.js watching auth state
        setErrorDetails('');
        onLogin();
      } else {
        const errorMsg = result.error || 'Invalid credentials';
        setErrorDetails(errorMsg);
        Alert.alert('Login Failed', errorMsg);
      }
    } catch (error) {
      const errorMsg = error.message || error.toString() || 'An unexpected error occurred. Please try again.';
      setErrorDetails(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: themeTransitionAnim,
        },
      ]}
    >
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientMid, theme.gradientEnd]}
        style={styles.container}
      >
        {/* Theme Toggle Button - Fixed position */}
        <Animated.View
          style={[
            styles.themeToggleContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <ThemeToggle />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo/Brand Section */}
          <View style={styles.headerSection}>
            <Animated.View
              style={[
                dynamicStyles.logoContainer,
                {
                  transform: [
                    { scale: logoScale },
                    { rotate: logoRotateInterpolate },
                  ],
                },
              ]}
            >
              <Image
                source={require('../../assets/icon-black.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              {/* Animated glow effect */}
              <Animated.View
                style={[
                  styles.logoGlow,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.6],
                    }),
                  },
                ]}
              />
            </Animated.View>
            <Animated.Text
              style={[
                dynamicStyles.brandName,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 20],
                      }),
                    },
                  ],
                },
              ]}
            >
              CAMORENT
            </Animated.Text>
            <Animated.Text
              style={[
                dynamicStyles.subtitle,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              Admin Portal
            </Animated.Text>
          </View>

          {/* Login Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formSlideAnim }],
              },
            ]}
          >
            <View style={styles.inputWrapper}>
              <Text style={dynamicStyles.label}>Phone Number</Text>
              <Animated.View
                style={[
                  dynamicStyles.inputContainer,
                  focusedInput === 'phone' && dynamicStyles.inputContainerFocused,
                  focusedInput === 'phone' && {
                    transform: [{ scale: 1.01 }],
                  },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={theme.inputIcon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="+919876543210"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                  editable={!isLoading}
                />
                {phoneNumber.length > 0 && (
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={20} color={BRAND_COLORS.success} />
                  </Animated.View>
                )}
              </Animated.View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={dynamicStyles.label}>Password</Text>
              <Animated.View
                style={[
                  dynamicStyles.inputContainer,
                  focusedInput === 'password' && dynamicStyles.inputContainerFocused,
                  focusedInput === 'password' && {
                    transform: [{ scale: 1.01 }],
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.inputIcon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.inputIcon}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            <Animated.View
              style={{
                transform: [{ scale: buttonPulse }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!phoneNumber || !password || isLoading) && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!phoneNumber || !password || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    phoneNumber && password && !isLoading
                      ? theme.buttonGradientEnabled
                      : theme.buttonGradientDisabled
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.buttonText} />
                  ) : (
                    <>
                      <Text style={dynamicStyles.loginButtonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={20} color={theme.buttonText} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Error Details Display - for debugging */}
            {errorDetails ? (
              <View style={styles.errorContainer}>
                <Text style={dynamicStyles.errorText} numberOfLines={3}>
                  {errorDetails}
                </Text>
              </View>
            ) : null}
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={dynamicStyles.footerText}>Secured Admin Access</Text>
            <View style={dynamicStyles.securityBadge}>
              <Ionicons name="shield-checkmark" size={14} color={theme.securityText} />
              <Text style={dynamicStyles.securityText}>End-to-end encrypted</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: responsive.spacing.xxl + responsive.spacing.md,
    right: responsive.spacing.lg,
    zIndex: 1000,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsive.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: responsive.spacing.xxl + responsive.spacing.md,
  },
  logoImage: {
    width: responsive.iconSize.xxl + responsive.spacing.lg,
    height: responsive.iconSize.xxl + responsive.spacing.lg,
  },
  logoGlow: {
    position: 'absolute',
    width: responsive.iconSize.xxl * 2.5,
    height: responsive.iconSize.xxl * 2.5,
    borderRadius: responsive.iconSize.xxl * 1.25,
    backgroundColor: BRAND_COLORS.primary,
    opacity: 0.3,
  },
  formContainer: {
    gap: responsive.spacing.xl,
  },
  inputWrapper: {
    gap: responsive.spacing.sm,
  },
  inputIcon: {
    marginRight: responsive.spacing.md,
  },
  eyeIcon: {
    padding: responsive.spacing.sm,
  },
  loginButton: {
    marginTop: responsive.spacing.lg,
    borderRadius: responsive.borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  loginButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsive.inputHeight + responsive.spacing.sm,
    gap: responsive.spacing.md,
  },
  footer: {
    marginTop: responsive.spacing.xxl + responsive.spacing.md,
    alignItems: 'center',
    gap: responsive.spacing.md,
  },
  errorContainer: {
    marginTop: responsive.spacing.lg,
    padding: responsive.spacing.md,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: responsive.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
});

// Dynamic styles that change with theme
const createDynamicStyles = (theme) =>
  StyleSheet.create({
    logoContainer: {
      width: responsive.iconSize.xxl * 2,
      height: responsive.iconSize.xxl * 2,
      borderRadius: responsive.borderRadius.xl,
      backgroundColor: theme.logoBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: responsive.spacing.xl,
      borderWidth: 1,
      borderColor: theme.logoBorder,
      overflow: 'hidden',
    },
    brandName: {
      fontSize: responsive.fontSize.huge + 4,
      fontWeight: '800',
      color: theme.textPrimary,
      letterSpacing: -0.5,
      marginBottom: responsive.spacing.sm,
    },
    subtitle: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '500',
      color: theme.textTertiary,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    label: {
      fontSize: responsive.fontSize.md,
      fontWeight: '600',
      color: theme.textSecondary,
      letterSpacing: 0.2,
      marginLeft: responsive.spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: responsive.borderRadius.lg,
      borderWidth: 1.5,
      borderColor: theme.inputBorder,
      paddingHorizontal: responsive.spacing.lg,
      height: responsive.inputHeight,
    },
    inputContainerFocused: {
      borderColor: theme.inputBorderFocused,
      backgroundColor: theme.inputBackgroundFocused,
      shadowColor: BRAND_COLORS.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    input: {
      flex: 1,
      fontSize: responsive.fontSize.lg,
      color: theme.textPrimary,
      fontWeight: '500',
    },
    loginButtonText: {
      fontSize: responsive.fontSize.xl,
      fontWeight: '700',
      color: theme.buttonText,
      letterSpacing: 0.5,
    },
    footerText: {
      fontSize: responsive.fontSize.sm,
      color: theme.textQuaternary,
      fontWeight: '500',
    },
    securityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsive.spacing.xs,
      backgroundColor: theme.securityBackground,
      paddingHorizontal: responsive.spacing.md,
      paddingVertical: responsive.spacing.xs,
      borderRadius: responsive.borderRadius.round,
      borderWidth: 1,
      borderColor: theme.securityBorder,
    },
    securityText: {
      fontSize: responsive.fontSize.sm,
      color: theme.securityText,
      fontWeight: '600',
    },
    errorText: {
      fontSize: responsive.fontSize.sm,
      color: '#FF3B30',
      fontWeight: '500',
      textAlign: 'center',
    },
  });
