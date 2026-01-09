/**
 * BookingApprovalAlert Component
 * Enhanced booking request notification with detailed info, animations, and beautiful UI
 */
import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { approveBooking, rejectBooking, getBookingDetails } from '../services/api';
import { formatINR } from '../utils/formatters';

const { width, height } = Dimensions.get('window');

export default function BookingApprovalAlert({ visible, bookingData, onClose, onActionComplete }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [fullBookingDetails, setFullBookingDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Fetch full booking details when popup opens
  useEffect(() => {
    if (visible && bookingData?.booking_id) {
      fetchBookingDetails();
    }
  }, [visible, bookingData?.booking_id]);

  const fetchBookingDetails = async () => {
    if (!bookingData?.booking_id) return;

    setIsLoadingDetails(true);
    try {
      const result = await getBookingDetails(bookingData.booking_id);
      if (result.success) {
        setFullBookingDetails(result.data);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation for notification icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Shimmer effect
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      pulseAnim.setValue(1);
      shimmerAnim.setValue(0);
      setFullBookingDetails(null);
    }
  }, [visible]);

  const handleApprove = async () => {
    if (!bookingData?.booking_id) return;

    Alert.alert(
      '✅ Approve Booking',
      `Approve booking request from ${bookingData.customer_name}?\n\n✓ Customer will be notified\n✓ Booking will be confirmed\n✓ Payment link will be sent`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setIsApproving(true);
            try {
              const result = await approveBooking(bookingData.booking_id);
              if (result.success) {
                Alert.alert('🎉 Success', 'Booking approved successfully!\nCustomer has been notified.');
                if (onActionComplete) onActionComplete('approved');
                onClose();
              } else {
                Alert.alert('❌ Error', result.error || 'Failed to approve booking');
              }
            } catch (error) {
              Alert.alert('❌ Error', 'An unexpected error occurred');
            } finally {
              setIsApproving(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!bookingData?.booking_id) return;

    Alert.alert(
      '❌ Reject Booking',
      `Reject booking request from ${bookingData.customer_name}?\n\n⚠ Customer will be notified\n⚠ This action cannot be undone`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setIsRejecting(true);
            try {
              const result = await rejectBooking(bookingData.booking_id);
              if (result.success) {
                Alert.alert('Booking Rejected', 'The customer has been notified.');
                if (onActionComplete) onActionComplete('rejected');
                onClose();
              } else {
                Alert.alert('Error', result.error || 'Failed to reject booking');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            } finally {
              setIsRejecting(false);
            }
          },
        },
      ]
    );
  };

  if (!visible || !bookingData) return null;

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const dynamicStyles = StyleSheet.create({
    overlay: {
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    },
    infoCard: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
    },
    label: {
      color: theme.textTertiary,
    },
    value: {
      color: theme.textPrimary,
    },
    divider: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, dynamicStyles.overlay, { opacity: fadeAnim }]}>
        {/* Backdrop blur effect */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.alertContainer,
            dynamicStyles.card,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ],
            },
          ]}
        >
          {/* Header with animated gradient */}
          <LinearGradient
            colors={[BRAND_COLORS.primary, BRAND_COLORS.primaryLight, BRAND_COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            {/* Shimmer effect overlay */}
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerTranslate }],
                },
              ]}
            />

            {/* Animated notification icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.iconGradient}
              >
                <Ionicons name="notifications" size={30} color="#FFF" />
              </LinearGradient>
            </Animated.View>

            <Text style={styles.headerTitle}>🎬 New Booking Request</Text>
            <Text style={styles.headerSubtitle}>Requires your attention</Text>
          </LinearGradient>

          {/* Content with ScrollView for long content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Shoot Name - Main Title */}
              <Animated.View style={[styles.shootNameCard, dynamicStyles.infoCard]}>
                <View style={styles.shootNameHeader}>
                  <Ionicons name="camera" size={24} color={BRAND_COLORS.primary} />
                  <Text style={[styles.shootNameText, dynamicStyles.value]}>
                    {bookingData.shoot_name}
                  </Text>
                </View>
              </Animated.View>

              {/* Customer & Duration Grid */}
              <View style={styles.detailsGrid}>
                {/* Customer */}
                <View style={[styles.detailBox, dynamicStyles.infoCard]}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="person-circle" size={20} color={BRAND_COLORS.primary} />
                  </View>
                  <Text style={[styles.detailLabel, dynamicStyles.label]}>Customer</Text>
                  <Text style={[styles.detailValue, dynamicStyles.value]} numberOfLines={2}>
                    {bookingData.customer_name}
                  </Text>
                </View>

                {/* Duration */}
                <View style={[styles.detailBox, dynamicStyles.infoCard]}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="calendar" size={20} color={BRAND_COLORS.primary} />
                  </View>
                  <Text style={[styles.detailLabel, dynamicStyles.label]}>Duration</Text>
                  <Text style={[styles.detailValue, dynamicStyles.value]}>
                    {bookingData.rental_days} {bookingData.rental_days === 1 ? 'Day' : 'Days'}
                  </Text>
                  {bookingData.rental_start_date && bookingData.rental_end_date && (
                    <Text style={[styles.dateRangeText, dynamicStyles.label]}>
                      {new Date(bookingData.rental_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(bookingData.rental_end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  )}
                </View>
              </View>

              {/* Amount Card - Highlighted */}
              <LinearGradient
                colors={[
                  isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.amountCard}
              >
                <View style={styles.amountHeader}>
                  <Ionicons name="cash" size={22} color={BRAND_COLORS.primary} />
                  <Text style={[styles.amountLabel, dynamicStyles.label]}>Total Amount</Text>
                </View>
                <Text style={styles.amountValue}>
                  {formatINR(parseFloat(bookingData.total_amount || 0))}
                </Text>
                <View style={styles.amountBreakdown}>
                  <Text style={[styles.amountNote, dynamicStyles.label]}>
                    {formatINR(parseFloat(bookingData.total_amount || 0) / (bookingData.rental_days || 1))} per day
                  </Text>
                </View>
              </LinearGradient>

              {/* Equipment Details - Show from bookingData or fullBookingDetails */}
              {((bookingData?.equipment && bookingData.equipment.length > 0) ||
                (fullBookingDetails?.equipment && fullBookingDetails.equipment.length > 0)) && (
                <View style={[styles.detailsSection, dynamicStyles.infoCard]}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="hardware-chip" size={18} color={BRAND_COLORS.primary} />
                    <Text style={styles.sectionTitle}>Equipment</Text>
                  </View>
                  {(fullBookingDetails?.equipment || bookingData?.equipment || []).map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.listItemText, dynamicStyles.value]}>
                        {item.name || item.equipment_name || item.camera_name} {item.quantity && `(×${item.quantity})`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Crew Details - Show from bookingData or fullBookingDetails */}
              {((bookingData?.crew && bookingData.crew.length > 0) ||
                (fullBookingDetails?.crew && fullBookingDetails.crew.length > 0)) && (
                <View style={[styles.detailsSection, dynamicStyles.infoCard]}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="people" size={18} color={BRAND_COLORS.primary} />
                    <Text style={styles.sectionTitle}>Crew Members</Text>
                  </View>
                  {(fullBookingDetails?.crew || bookingData?.crew || []).map((member, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.listItemText, dynamicStyles.value]}>
                        {member.name || member.crew_name} {member.role && `- ${member.role}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Loading state for details */}
              {isLoadingDetails && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={BRAND_COLORS.primary} />
                  <Text style={[styles.loadingText, dynamicStyles.label]}>Loading details...</Text>
                </View>
              )}

              {/* Divider */}
              <View style={[styles.divider, dynamicStyles.divider]} />

              {/* Info Banner */}
              <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={16} color={BRAND_COLORS.primary} />
                <Text style={[styles.infoBannerText, dynamicStyles.label]}>
                  Taking action will immediately notify the customer
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons - Fixed at bottom */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
              disabled={isApproving || isRejecting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF3B30', '#FF453A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isRejecting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="close-circle" size={22} color="#FFF" />
                    <Text style={styles.buttonText}>Reject</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={handleApprove}
              disabled={isApproving || isRejecting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[BRAND_COLORS.success, '#30D158']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isApproving ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                    <Text style={styles.buttonText}>Approve</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isApproving || isRejecting}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>I'll Review Later</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: Math.min(width - 40, 420),
    maxHeight: height * 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: BRAND_COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 2,
  },
  scrollContent: {
    maxHeight: height * 0.45,
  },
  content: {
    padding: 16,
  },
  shootNameCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  shootNameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shootNameText: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    lineHeight: 26,
  },
  infoCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: BRAND_COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  detailBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  dateRangeText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.75,
  },
  amountCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: BRAND_COLORS.primary,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '900',
    color: BRAND_COLORS.primary,
    marginVertical: 2,
  },
  amountBreakdown: {
    marginTop: 2,
  },
  amountNote: {
    fontSize: 11,
    fontWeight: '500',
  },
  detailsSection: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BRAND_COLORS.primary,
    marginTop: 6,
    marginRight: 8,
  },
  listItemText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: BRAND_COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
