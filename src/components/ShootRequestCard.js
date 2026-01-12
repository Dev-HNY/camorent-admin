import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { AnimatedButton, AnimatedAlert, UserDetailsModal } from '../components';
import { responsive } from '../utils/responsive';
import { shadows, modernCard } from '../theme/modernStyles';

export default function ShootRequestCard({ request, onApprove, onReject }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  const handleApprove = () => {
    setShowApproveAlert(true);
  };

  const handleReject = () => {
    setShowRejectAlert(true);
  };

  const confirmApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(request.id);
    } catch (error) {
      // Error approving
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(request.id);
    } catch (error) {
      // Error rejecting
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContact = () => {
    if (request.contactNumber) {
      Linking.openURL(`tel:${request.contactNumber}`);
    } else {
      Alert.alert('No Contact', 'Contact number not available for this booking.');
    }
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <View style={dynamicStyles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🎬</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={dynamicStyles.shootName}>{request.shootName}</Text>
            <TouchableOpacity
              style={styles.customerRow}
              onPress={() => setShowUserDetails(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.customerIcon}>👤</Text>
              <Text style={dynamicStyles.customerName}>{request.customerName}</Text>
              <Ionicons name="information-circle" size={16} color={BRAND_COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
        {/* {request.priority && (
          <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(request.priority)}15` }]}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(request.priority) }]} />
            <Text style={[styles.priorityText, { color: getPriorityColor(request.priority) }]}>
              {request.priority}
            </Text>
          </View>
        )} */}
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={dynamicStyles.infoItem}>
          <View style={dynamicStyles.infoIcon}>
            <Ionicons name="location" size={16} color={BRAND_COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={dynamicStyles.infoLabel}>Location</Text>
            <Text style={dynamicStyles.infoValue}>{request.location}</Text>
          </View>
        </View>

        <View style={dynamicStyles.infoItem}>
          <View style={dynamicStyles.infoIcon}>
            <Ionicons name="calendar" size={16} color={BRAND_COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={dynamicStyles.infoLabel}>Duration</Text>
            <Text style={dynamicStyles.infoValue}>{request.duration.days} days • {request.duration.dateRange}</Text>
          </View>
        </View>

        <View style={[dynamicStyles.infoItem, styles.infoItemFull]}>
          <View style={dynamicStyles.infoIcon}>
            <Ionicons name="cash" size={16} color={BRAND_COLORS.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={dynamicStyles.infoLabel}>Budget</Text>
            <Text style={dynamicStyles.budgetAmount}>₹{request.budget.amount.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Contact Button */}
      {request.contactNumber && (
        <TouchableOpacity
          style={dynamicStyles.contactButton}
          onPress={handleContact}
          activeOpacity={0.7}
        >
          <View style={dynamicStyles.contactIcon}>
            <Ionicons name="call" size={16} color={BRAND_COLORS.primary} />
          </View>
          <Text style={dynamicStyles.contactText}>Contact Customer</Text>
          <Text style={dynamicStyles.contactNumber}>{request.contactNumber}</Text>
        </TouchableOpacity>
      )}

      {/* View Details Button */}
      <TouchableOpacity
        style={[dynamicStyles.expandButton, expanded && dynamicStyles.expandButtonActive]}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={dynamicStyles.expandButtonText}>View Details</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons name="chevron-down" size={16} color={BRAND_COLORS.primary} />
        </Animated.View>
      </TouchableOpacity>

      {/* Expandable Details */}
      <Animated.View style={[styles.detailsSection, { maxHeight: heightInterpolate, opacity: animation }]}>
        <View style={dynamicStyles.detailsContent}>
          {/* Equipment */}
          <View style={styles.detailGroup}>
            <Text style={dynamicStyles.detailLabel}>📷 Equipment</Text>
            <View style={styles.chipContainer}>
              {request.equipment && request.equipment.length > 0 ? (
                request.equipment.map((item, index) => (
                  <View key={index} style={dynamicStyles.chip}>
                    <Text style={dynamicStyles.chipText}>{item}</Text>
                  </View>
                ))
              ) : (
                <Text style={dynamicStyles.emptyText}>No equipment selected</Text>
              )}
            </View>
          </View>

          {/* Crew */}
          <View style={styles.detailGroup}>
            <Text style={dynamicStyles.detailLabel}>👥 Crew</Text>
            <View style={styles.chipContainer}>
              {request.crew && request.crew.length > 0 ? (
                request.crew.map((item, index) => (
                  <View key={index} style={dynamicStyles.chip}>
                    <Text style={dynamicStyles.chipText}>{item}</Text>
                  </View>
                ))
              ) : (
                <Text style={dynamicStyles.emptyText}>No crew selected</Text>
              )}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <AnimatedButton
          title="Reject"
          onPress={handleReject}
          variant="danger"
          size="large"
          icon="close-circle"
          iconPosition="left"
          loading={isProcessing}
          disabled={isProcessing}
          animationType="scale"
          style={styles.actionButton}
        />
        <AnimatedButton
          title="Approve"
          onPress={handleApprove}
          variant="primary"
          size="large"
          icon="checkmark-circle"
          iconPosition="left"
          loading={isProcessing}
          disabled={isProcessing}
          animationType="shimmer"
          style={styles.actionButton}
        />
      </View>

      {/* Approve Alert */}
      <AnimatedAlert
        visible={showApproveAlert}
        onClose={() => setShowApproveAlert(false)}
        type="success"
        title="Approve Booking"
        message={`Are you sure you want to approve this booking for ${request.shootName}?\n\nThis will create an invoice and notify the customer.`}
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Approve',
            style: 'primary',
            onPress: confirmApprove,
          },
        ]}
      />

      {/* Reject Alert */}
      <AnimatedAlert
        visible={showRejectAlert}
        onClose={() => setShowRejectAlert(false)}
        type="error"
        title="Reject Booking"
        message={`Are you sure you want to reject this booking for ${request.shootName}?\n\nThis action will move it to drafts.`}
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: confirmReject,
          },
        ]}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        visible={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        userId={request.userId || request.user_id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsive.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: responsive.iconSize.xl,
    height: responsive.iconSize.xl,
    borderRadius: responsive.borderRadius.md,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.spacing.md,
  },
  iconText: {
    fontSize: responsive.fontSize.xl,
  },
  headerInfo: {
    flex: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.xs,
  },
  customerIcon: {
    fontSize: responsive.fontSize.md,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs,
    borderRadius: responsive.borderRadius.sm,
    gap: responsive.spacing.xs,
  },
  priorityDot: {
    width: responsive.spacing.xs,
    height: responsive.spacing.xs,
    borderRadius: responsive.spacing.xs / 2,
  },
  priorityText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoGrid: {
    gap: responsive.spacing.md,
    marginBottom: responsive.spacing.md,
  },
  infoItemFull: {
    width: '100%',
  },
  infoContent: {
    flex: 1,
  },
  detailsSection: {
    overflow: 'hidden',
    marginBottom: responsive.spacing.md,
  },
  detailGroup: {
    marginBottom: responsive.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsive.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: responsive.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

// Dynamic styles that change with theme
const createDynamicStyles = (theme) =>
  StyleSheet.create({
    card: {
      ...modernCard(theme, 'md'),
      borderRadius: responsive.borderRadius.xl,
      padding: responsive.cardPadding,
      marginBottom: responsive.spacing.md,
    },
    shootName: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: responsive.spacing.xs,
    },
    customerName: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '600',
      color: BRAND_COLORS.primary,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: responsive.borderRadius.md,
      padding: responsive.spacing.md,
      gap: responsive.spacing.md,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      ...shadows.sm,
    },
    infoIcon: {
      width: responsive.iconSize.lg,
      height: responsive.iconSize.lg,
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderRadius: responsive.borderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: responsive.fontSize.xs,
      fontWeight: '600',
      color: theme.textQuaternary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: responsive.spacing.xs,
    },
    infoValue: {
      fontSize: responsive.fontSize.md,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    budgetAmount: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: '800',
      color: BRAND_COLORS.success,
    },
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: responsive.borderRadius.md,
      paddingVertical: responsive.spacing.md,
      paddingHorizontal: responsive.spacing.lg,
      marginBottom: responsive.spacing.md,
      gap: responsive.spacing.sm,
    },
    expandButtonActive: {
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderColor: BRAND_COLORS.primary,
    },
    expandButtonText: {
      fontSize: responsive.fontSize.md,
      fontWeight: '700',
      color: BRAND_COLORS.primary,
    },
    detailsContent: {
      backgroundColor: theme.inputBackground,
      borderRadius: responsive.borderRadius.md,
      padding: responsive.spacing.lg,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    detailLabel: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '700',
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: responsive.spacing.sm,
    },
    chip: {
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderWidth: 1,
      borderColor: `${BRAND_COLORS.primary}30`,
      paddingHorizontal: responsive.spacing.md,
      paddingVertical: responsive.spacing.sm,
      borderRadius: responsive.borderRadius.sm,
    },
    chipText: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '600',
      color: BRAND_COLORS.primary,
    },
    emptyText: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '500',
      color: theme.textTertiary,
      fontStyle: 'italic',
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: responsive.borderRadius.md,
      paddingVertical: responsive.spacing.md,
      paddingHorizontal: responsive.spacing.md,
      marginBottom: responsive.spacing.md,
      gap: responsive.spacing.sm,
    },
    contactIcon: {
      width: responsive.iconSize.lg,
      height: responsive.iconSize.lg,
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderRadius: responsive.borderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactText: {
      flex: 1,
      fontSize: responsive.fontSize.md,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    contactNumber: {
      fontSize: responsive.fontSize.md,
      fontWeight: '700',
      color: BRAND_COLORS.primary,
    },
    actionButtonSecondary: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsive.spacing.md,
      borderRadius: responsive.borderRadius.md,
      backgroundColor: 'rgba(255, 69, 58, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 69, 58, 0.2)',
      gap: responsive.spacing.sm,
    },
    actionButtonSecondaryText: {
      fontSize: responsive.fontSize.md,
      fontWeight: '700',
      color: '#FF453A',
    },
  });
