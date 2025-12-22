/**
 * BookingApprovalAlert Component
 * Beautiful custom alert for booking request notifications with approve/reject actions
 */
import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { approveBooking, rejectBooking } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function BookingApprovalAlert({ visible, bookingData, onClose, onActionComplete }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleApprove = async () => {
    if (!bookingData?.booking_id) return;

    Alert.alert(
      'Approve Booking',
      `Approve booking request from ${bookingData.customer_name}?\n\nThis will notify the customer and proceed with the booking.`,
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
                Alert.alert('Success', 'Booking approved successfully!');
                if (onActionComplete) onActionComplete('approved');
                onClose();
              } else {
                Alert.alert('Error', result.error || 'Failed to approve booking');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
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
      'Reject Booking',
      `Reject booking request from ${bookingData.customer_name}?\n\nThis will notify the customer that their request was declined.`,
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
                Alert.alert('Booking Rejected', 'The customer will be notified.');
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

  const dynamicStyles = StyleSheet.create({
    overlay: {
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)',
    },
    card: {
      backgroundColor: theme.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 25,
      elevation: 15,
    },
    title: {
      color: theme.text,
    },
    label: {
      color: theme.textSecondary,
    },
    value: {
      color: theme.text,
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, dynamicStyles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.alertContainer,
            dynamicStyles.card,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header with Icon */}
          <LinearGradient
            colors={[BRAND_COLORS.primary, BRAND_COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={32} color="#FFF" />
            </View>
            <Text style={styles.headerTitle}>New Booking Request</Text>
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            {/* Customer Info */}
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={BRAND_COLORS.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.label, dynamicStyles.label]}>Customer</Text>
                <Text style={[styles.value, dynamicStyles.value]}>{bookingData.customer_name}</Text>
              </View>
            </View>

            {/* Shoot Details */}
            <View style={styles.infoRow}>
              <Ionicons name="camera" size={20} color={BRAND_COLORS.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.label, dynamicStyles.label]}>Shoot Details</Text>
                <Text style={[styles.value, dynamicStyles.value]}>{bookingData.shoot_name}</Text>
              </View>
            </View>

            {/* Duration */}
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={BRAND_COLORS.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.label, dynamicStyles.label]}>Duration</Text>
                <Text style={[styles.value, dynamicStyles.value]}>
                  {bookingData.rental_days} {bookingData.rental_days === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>

            {/* Amount */}
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color={BRAND_COLORS.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.label, dynamicStyles.label]}>Total Amount</Text>
                <Text style={[styles.value, dynamicStyles.value, styles.amount]}>
                  ₹{parseFloat(bookingData.total_amount || 0).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
              disabled={isApproving || isRejecting}
              activeOpacity={0.8}
            >
              {isRejecting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="close-circle" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Reject</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={handleApprove}
              disabled={isApproving || isRejecting}
              activeOpacity={0.8}
            >
              {isApproving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Approve</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isApproving || isRejecting}
          >
            <Text style={styles.closeButtonText}>View Later</Text>
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
    width: Math.min(width - 40, 400),
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: BRAND_COLORS.success,
  },
  rejectButton: {
    backgroundColor: BRAND_COLORS.error,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: BRAND_COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
