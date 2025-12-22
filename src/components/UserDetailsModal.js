/**
 * UserDetailsModal Component
 * Beautiful modal to display user details
 */
import { useRef, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { getUserDetails } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UserDetailsModal = ({ visible, onClose, userId }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible && userId) {
      fetchUserDetails();
    }
  }, [visible, userId]);

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

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUserDetails(userId);
      if (result.success) {
        setUserDetails(result.data);
      } else {
        setError(result.error || 'Failed to fetch user details');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const dynamicStyles = createDynamicStyles(theme);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary} />
          <Text style={dynamicStyles.loadingText}>Loading user details...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF453A" />
          <Text style={dynamicStyles.errorText}>{error}</Text>
          <TouchableOpacity
            style={dynamicStyles.retryButton}
            onPress={fetchUserDetails}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!userDetails) {
      return null;
    }

    const fullName = [userDetails.first_name, userDetails.last_name]
      .filter(Boolean)
      .join(' ') || 'N/A';

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={[BRAND_COLORS.primary, BRAND_COLORS.primaryLight]}
            style={styles.avatarContainer}
          >
            <Text style={styles.avatarText}>
              {fullName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <Text style={dynamicStyles.userName}>{fullName}</Text>
          {userDetails.profession && (
            <Text style={dynamicStyles.userProfession}>{userDetails.profession}</Text>
          )}
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Contact Information</Text>

          {/* Phone */}
          <TouchableOpacity
            style={dynamicStyles.infoRow}
            onPress={() => handleCall(userDetails.phone_number)}
            activeOpacity={0.7}
          >
            <View style={dynamicStyles.infoIconContainer}>
              <Ionicons name="call" size={20} color={BRAND_COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={dynamicStyles.infoLabel}>Phone Number</Text>
              <Text style={dynamicStyles.infoValue}>{userDetails.phone_number}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </TouchableOpacity>

          {/* Email */}
          {userDetails.email && (
            <TouchableOpacity
              style={dynamicStyles.infoRow}
              onPress={() => handleEmail(userDetails.email)}
              activeOpacity={0.7}
            >
              <View style={dynamicStyles.infoIconContainer}>
                <Ionicons name="mail" size={20} color={BRAND_COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={dynamicStyles.infoLabel}>Email</Text>
                <Text style={dynamicStyles.infoValue}>{userDetails.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Business Info Section */}
        {(userDetails.org_name || userDetails.GSTIN_no || userDetails.PAN_no) && (
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>Business Information</Text>

            {/* Organization Name */}
            {userDetails.org_name && (
              <View style={dynamicStyles.infoRow}>
                <View style={dynamicStyles.infoIconContainer}>
                  <Ionicons name="business" size={20} color={BRAND_COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={dynamicStyles.infoLabel}>Organization</Text>
                  <Text style={dynamicStyles.infoValue}>{userDetails.org_name}</Text>
                </View>
              </View>
            )}

            {/* GST Number */}
            {userDetails.GSTIN_no && (
              <View style={dynamicStyles.infoRow}>
                <View style={dynamicStyles.infoIconContainer}>
                  <Ionicons name="document-text" size={20} color={BRAND_COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={dynamicStyles.infoLabel}>GST Number</Text>
                  <Text style={[dynamicStyles.infoValue, styles.monoText]}>
                    {userDetails.GSTIN_no}
                  </Text>
                </View>
              </View>
            )}

            {/* PAN Number */}
            {userDetails.PAN_no && (
              <View style={dynamicStyles.infoRow}>
                <View style={dynamicStyles.infoIconContainer}>
                  <Ionicons name="card" size={20} color={BRAND_COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={dynamicStyles.infoLabel}>PAN Number</Text>
                  <Text style={[dynamicStyles.infoValue, styles.monoText]}>
                    {userDetails.PAN_no}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Account Details</Text>

          {/* User Type */}
          {userDetails.user_type && (
            <View style={dynamicStyles.infoRow}>
              <View style={dynamicStyles.infoIconContainer}>
                <Ionicons name="person" size={20} color={BRAND_COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={dynamicStyles.infoLabel}>User Type</Text>
                <Text style={dynamicStyles.infoValue}>
                  {userDetails.user_type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          )}

          {/* Account Status */}
          <View style={dynamicStyles.infoRow}>
            <View style={dynamicStyles.infoIconContainer}>
              <Ionicons
                name={userDetails.account_status === 'active' ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={userDetails.account_status === 'active' ? BRAND_COLORS.success : '#FF9F0A'}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={dynamicStyles.infoLabel}>Account Status</Text>
              <Text
                style={[
                  dynamicStyles.infoValue,
                  {
                    color:
                      userDetails.account_status === 'active'
                        ? BRAND_COLORS.success
                        : '#FF9F0A',
                  },
                ]}
              >
                {userDetails.account_status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Member Since */}
          <View style={dynamicStyles.infoRow}>
            <View style={dynamicStyles.infoIconContainer}>
              <Ionicons name="calendar" size={20} color={BRAND_COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={dynamicStyles.infoLabel}>Member Since</Text>
              <Text style={dynamicStyles.infoValue}>
                {new Date(userDetails.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.surface, theme.surfaceElevated]}
            style={dynamicStyles.modalContent}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {renderContent()}
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
  modalContainer: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 500,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  monoText: {
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

const createDynamicStyles = (theme) =>
  StyleSheet.create({
    modalContent: {
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 8,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    userName: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    userProfession: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      gap: 12,
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textQuaternary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    loadingText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    errorText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: BRAND_COLORS.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 8,
    },
  });

export default UserDetailsModal;
