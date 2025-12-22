/**
 * AnimatedAlert Component
 * Beautiful custom alert modal with smooth animations
 */
import { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedAlert = ({
  visible,
  onClose,
  title,
  message,
  buttons = [],
  type = 'default', // 'success', 'warning', 'error', 'info', 'default'
  icon,
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconName: icon || 'checkmark-circle',
          iconColor: BRAND_COLORS.success,
          gradientColors: ['rgba(52, 199, 89, 0.15)', 'rgba(52, 199, 89, 0.05)'],
        };
      case 'warning':
        return {
          iconName: icon || 'alert-circle',
          iconColor: '#FF9F0A',
          gradientColors: ['rgba(255, 159, 10, 0.15)', 'rgba(255, 159, 10, 0.05)'],
        };
      case 'error':
        return {
          iconName: icon || 'close-circle',
          iconColor: '#FF453A',
          gradientColors: ['rgba(255, 69, 58, 0.15)', 'rgba(255, 69, 58, 0.05)'],
        };
      case 'info':
        return {
          iconName: icon || 'information-circle',
          iconColor: BRAND_COLORS.primary,
          gradientColors: [`${BRAND_COLORS.primary}15`, `${BRAND_COLORS.primary}05`],
        };
      default:
        return {
          iconName: icon || 'help-circle',
          iconColor: theme.textPrimary,
          gradientColors: [theme.inputBackground, theme.surface],
        };
    }
  };

  const typeConfig = getTypeConfig();

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.surface, theme.surfaceElevated]}
            style={dynamicStyles.alertContent}
          >
            {/* Icon Header */}
            <LinearGradient
              colors={typeConfig.gradientColors}
              style={styles.iconContainer}
            >
              <Ionicons
                name={typeConfig.iconName}
                size={48}
                color={typeConfig.iconColor}
              />
            </LinearGradient>

            {/* Title */}
            {title && (
              <Text style={dynamicStyles.title}>{title}</Text>
            )}

            {/* Message */}
            {message && (
              <Text style={dynamicStyles.message}>{message}</Text>
            )}

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => {
                const isLast = index === buttons.length - 1;
                const isPrimary = button.style === 'default' || button.style === 'primary';
                const isDestructive = button.style === 'destructive';
                const isCancel = button.style === 'cancel';

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      dynamicStyles.button,
                      buttons.length === 1 && styles.singleButton,
                      isCancel && dynamicStyles.cancelButton,
                    ]}
                    onPress={() => {
                      button.onPress?.();
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    {isPrimary ? (
                      <LinearGradient
                        colors={[BRAND_COLORS.primary, BRAND_COLORS.primaryLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                      >
                        <Text style={styles.primaryButtonText}>{button.text}</Text>
                      </LinearGradient>
                    ) : (
                      <Text
                        style={[
                          dynamicStyles.buttonText,
                          isDestructive && styles.destructiveText,
                          isCancel && dynamicStyles.cancelText,
                        ]}
                      >
                        {button.text}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  alertContainer: {
    width: SCREEN_WIDTH - 64,
    maxWidth: 400,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 24,
  },
  singleButton: {
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  destructiveText: {
    color: '#FF453A',
  },
});

const createDynamicStyles = (theme) =>
  StyleSheet.create({
    alertContent: {
      borderRadius: 24,
      padding: 28,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: 12,
    },
    message: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    button: {
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    cancelText: {
      color: theme.textTertiary,
    },
  });

export default AnimatedAlert;
