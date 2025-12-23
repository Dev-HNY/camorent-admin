import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { AnimatedButton, AnimatedAlert, UserDetailsModal } from '../components';

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
      console.error('Error approving booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(request.id);
    } catch (error) {
      console.error('Error rejecting booking:', error);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF453A';
      case 'medium': return '#FF9F0A';
      case 'low': return '#30D158';
      default: return '#636366';
    }
  };

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
        userId={request.userId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customerIcon: {
    fontSize: 14,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 16,
  },
  infoItemFull: {
    width: '100%',
  },
  infoContent: {
    flex: 1,
  },
  detailsSection: {
    overflow: 'hidden',
    marginBottom: 12,
  },
  detailGroup: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
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
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    shootName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    customerName: {
      fontSize: 15,
      fontWeight: '600',
      color: BRAND_COLORS.primary,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      padding: 12,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    infoIcon: {
      width: 36,
      height: 36,
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderRadius: 8,
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
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    budgetAmount: {
      fontSize: 18,
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
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 8,
    },
    expandButtonActive: {
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderColor: BRAND_COLORS.primary,
    },
    expandButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: BRAND_COLORS.primary,
    },
    detailsContent: {
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    detailLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    chip: {
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderWidth: 1,
      borderColor: `${BRAND_COLORS.primary}30`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '600',
      color: BRAND_COLORS.primary,
    },
    emptyText: {
      fontSize: 13,
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
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginBottom: 12,
      gap: 10,
    },
    contactIcon: {
      width: 36,
      height: 36,
      backgroundColor: `${BRAND_COLORS.primary}15`,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    contactNumber: {
      fontSize: 14,
      fontWeight: '700',
      color: BRAND_COLORS.primary,
    },
    actionButtonSecondary: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 69, 58, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 69, 58, 0.2)',
      gap: 8,
    },
    actionButtonSecondaryText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FF453A',
    },
  });
