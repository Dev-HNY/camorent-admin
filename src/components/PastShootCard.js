import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { viewInvoice, sendInvoiceReminder } from '../services/api';
import { AnimatedButton, AnimatedAlert, UserDetailsModal } from '../components';

export default function PastShootCard({ shoot }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const [expanded, setExpanded] = useState(false);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [showInvoiceAlert, setShowInvoiceAlert] = useState(false);
  const [showReminderAlert, setShowReminderAlert] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const isPending = shoot.paymentStatus === 'pending';

  const handleContact = () => {
    if (shoot.contactNumber) {
      Linking.openURL(`tel:${shoot.contactNumber}`);
    } else {
      Alert.alert('No Contact', 'Contact number not available for this booking.');
    }
  };

  const handleViewInvoice = async () => {
    setIsViewingInvoice(true);
    try {
      const result = await viewInvoice(shoot.id);
      if (result.success && result.data.invoice) {
        const invoice = result.data.invoice;
        setInvoiceData(invoice);
        setShowInvoiceAlert(true);
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch invoice details');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsViewingInvoice(false);
    }
  };

  const handleSendReminder = () => {
    setShowReminderAlert(true);
  };

  const confirmSendReminder = async () => {
    setIsSendingReminder(true);
    try {
      const result = await sendInvoiceReminder(shoot.id);
      if (result.success) {
        Alert.alert('Success', result.data.message || 'Payment reminder sent successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to send reminder');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSendingReminder(false);
    }
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded(!expanded)}>
      <LinearGradient
        colors={[theme.surface, theme.surfaceElevated]}
        style={dynamicStyles.card}
      >
        {/* Header with Payment Status */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[
              dynamicStyles.avatarContainer,
              isPending && styles.avatarPending
            ]}>
              <Ionicons
                name={isPending ? "time" : "checkmark-circle"}
                size={24}
                color={isPending ? "#FF9F0A" : BRAND_COLORS.success}
              />
            </View>
            <View style={styles.headerInfo}>
              <TouchableOpacity
                onPress={() => setShowUserDetails(true)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={dynamicStyles.clientName}>{shoot.clientName}</Text>
                  <Ionicons name="information-circle" size={16} color={BRAND_COLORS.primary} />
                </View>
              </TouchableOpacity>
              <View style={styles.metaRow}>
                <Ionicons name="location" size={12} color={theme.textTertiary} />
                <Text style={dynamicStyles.metaText}>{shoot.location}</Text>
              </View>
            </View>
          </View>
          <View style={[
            dynamicStyles.paymentBadge,
            isPending && styles.paymentBadgePending
          ]}>
            <View style={[
              styles.statusDot,
              isPending && styles.statusDotPending
            ]} />
            <Text style={[
              dynamicStyles.paymentText,
              isPending && styles.paymentTextPending
            ]}>
              {isPending ? 'PENDING' : 'PAID'}
            </Text>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={dynamicStyles.metricCard}>
            <View style={dynamicStyles.metricIconContainer}>
              <Ionicons name="calendar" size={18} color={BRAND_COLORS.primary} />
            </View>
            <Text style={[styles.metricValue, { color: BRAND_COLORS.primary }]}>
              {shoot.totalDays}
            </Text>
            <Text style={dynamicStyles.metricLabel}>Days</Text>
          </View>
          <View style={dynamicStyles.metricCard}>
            <View style={dynamicStyles.metricIconContainer}>
              <Ionicons name="cash" size={18} color={isPending ? "#FF9F0A" : BRAND_COLORS.success} />
            </View>
            <Text style={[
              styles.metricValue,
              { color: isPending ? "#FF9F0A" : BRAND_COLORS.success }
            ]}>
              ${shoot.revenue.toLocaleString()}
            </Text>
            <Text style={dynamicStyles.metricLabel}>Revenue</Text>
          </View>
          <View style={dynamicStyles.metricCard}>
            <View style={dynamicStyles.metricIconContainer}>
              <Ionicons name="star" size={18} color="#FFD60A" />
            </View>
            <Text style={[styles.metricValue, { color: '#FFD60A' }]}>
              {shoot.rating}.0
            </Text>
            <Text style={dynamicStyles.metricLabel}>Rating</Text>
          </View>
        </View>

        {/* Date Range */}
        <View style={dynamicStyles.dateRangeContainer}>
          <View style={styles.dateColumn}>
            <Text style={dynamicStyles.dateLabel}>Start Date</Text>
            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={14} color={BRAND_COLORS.primary} />
              <Text style={dynamicStyles.dateValue}>{shoot.startDate}</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={18} color={theme.textDisabled} style={styles.arrowIcon} />
          <View style={styles.dateColumn}>
            <Text style={dynamicStyles.dateLabel}>End Date</Text>
            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={14} color={BRAND_COLORS.primary} />
              <Text style={dynamicStyles.dateValue}>{shoot.endDate}</Text>
            </View>
          </View>
        </View>

        {/* Equipment List */}
        <View style={styles.equipmentContainer}>
          <Text style={dynamicStyles.equipmentLabel}>Equipment Used:</Text>
          <View style={styles.equipmentList}>
            {shoot.equipmentRented.slice(0, 3).map((item, index) => (
              <View key={index} style={dynamicStyles.equipmentChip}>
                <Text style={dynamicStyles.equipmentText}>{item}</Text>
              </View>
            ))}
            {shoot.equipmentRented.length > 3 && (
              <View style={dynamicStyles.equipmentChip}>
                <Text style={dynamicStyles.equipmentText}>
                  +{shoot.equipmentRented.length - 3} more
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Expandable Review Section */}
        {expanded && (
          <View style={[
            styles.ratingSection,
            { backgroundColor: isDark ? 'rgba(255, 214, 10, 0.1)' : 'rgba(255, 214, 10, 0.15)' }
          ]}>
            <View style={styles.ratingHeader}>
              <Text style={dynamicStyles.ratingLabel}>Customer Review</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= shoot.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={star <= shoot.rating ? '#FFD60A' : theme.textDisabled}
                  />
                ))}
              </View>
            </View>
            {shoot.review && shoot.review.hasReview ? (
              <Text style={dynamicStyles.reviewText}>"{shoot.review.comment}"</Text>
            ) : (
              <Text style={dynamicStyles.noReviewText}>💭 No review yet</Text>
            )}
          </View>
        )}

        {/* Actions - Dynamic based on payment status */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={dynamicStyles.smallButton}
              onPress={handleContact}
              activeOpacity={0.7}
            >
              <Ionicons name="call-outline" size={16} color={BRAND_COLORS.primary} />
              <Text style={dynamicStyles.smallButtonText}>Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.smallButton}
              onPress={handleViewInvoice}
              activeOpacity={0.7}
              disabled={isViewingInvoice}
            >
              {isViewingInvoice ? (
                <ActivityIndicator size="small" color={BRAND_COLORS.primary} />
              ) : (
                <>
                  <Ionicons name="document-text-outline" size={16} color={BRAND_COLORS.primary} />
                  <Text style={dynamicStyles.smallButtonText}>View Invoice</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {isPending && (
            <AnimatedButton
              title="Send Payment Reminder"
              onPress={handleSendReminder}
              variant="warning"
              size="medium"
              icon="notifications-outline"
              iconPosition="left"
              loading={isSendingReminder}
              disabled={isSendingReminder}
              animationType="pulse"
              fullWidth={true}
            />
          )}
        </View>

        {/* Expand/Collapse Indicator */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.textTertiary}
          />
          <Text style={dynamicStyles.expandText}>
            {expanded ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>

        {/* View Invoice Alert */}
        {invoiceData && (
          <AnimatedAlert
            visible={showInvoiceAlert}
            onClose={() => setShowInvoiceAlert(false)}
            type="info"
            title="Invoice Details"
            message={`Invoice Number: ${invoiceData.invoice_number}\nStatus: ${invoiceData.status.toUpperCase()}\nAmount: ₹${(invoiceData.amount / 100).toLocaleString()}\nAmount Paid: ₹${(invoiceData.amount_paid / 100).toLocaleString()}\nAmount Due: ₹${(invoiceData.amount_due / 100).toLocaleString()}${invoiceData.pdf_url ? '\n\nPDF available for download' : ''}`}
            buttons={[
              {
                text: 'Close',
                style: 'cancel',
                onPress: () => {},
              },
              invoiceData.pdf_url && {
                text: 'Open PDF',
                style: 'primary',
                onPress: () => Linking.openURL(invoiceData.pdf_url),
              },
              invoiceData.short_url && {
                text: 'Payment Link',
                style: 'default',
                onPress: () => Linking.openURL(invoiceData.short_url),
              },
            ].filter(Boolean)}
          />
        )}

        {/* Send Reminder Alert */}
        <AnimatedAlert
          visible={showReminderAlert}
          onClose={() => setShowReminderAlert(false)}
          type="warning"
          title="Send Payment Reminder"
          message={`Send payment reminder to ${shoot.clientName}?\n\nThe reminder will be sent via email and SMS.`}
          buttons={[
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Send',
              style: 'primary',
              onPress: confirmSendReminder,
            },
          ]}
        />

        {/* User Details Modal */}
        <UserDetailsModal
          visible={showUserDetails}
          onClose={() => setShowUserDetails(false)}
          userId={shoot.userId}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPending: {
    backgroundColor: 'rgba(255, 159, 10, 0.15)',
    borderColor: 'rgba(255, 159, 10, 0.3)',
  },
  headerInfo: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentBadgePending: {
    backgroundColor: 'rgba(255, 159, 10, 0.15)',
    borderColor: 'rgba(255, 159, 10, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BRAND_COLORS.success,
  },
  statusDotPending: {
    backgroundColor: '#FF9F0A',
  },
  paymentTextPending: {
    color: '#FF9F0A',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  dateColumn: {
    flex: 1,
    gap: 8,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowIcon: {
    marginTop: 16,
  },
  equipmentContainer: {
    marginBottom: 16,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingSection: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.2)',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonHalf: {
    flex: 1,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
});

// Dynamic styles that change with theme
const createDynamicStyles = (theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
    },
    avatarContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: 'rgba(52, 199, 89, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: 'rgba(52, 199, 89, 0.3)',
    },
    clientName: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    metaText: {
      fontSize: 12,
      color: theme.textTertiary,
      fontWeight: '500',
    },
    paymentBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: 'rgba(52, 199, 89, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(52, 199, 89, 0.3)',
      gap: 6,
    },
    paymentText: {
      fontSize: 11,
      fontWeight: '700',
      color: BRAND_COLORS.success,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    metricCard: {
      flex: 1,
      backgroundColor: theme.inputBackground,
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    metricIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    metricLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textQuaternary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dateRangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    dateLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textQuaternary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dateValue: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    equipmentLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTertiary,
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    equipmentChip: {
      backgroundColor: theme.inputBackground,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    equipmentText: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    ratingLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    reviewText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
      fontStyle: 'italic',
    },
    noReviewText: {
      fontSize: 13,
      color: theme.textQuaternary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      gap: 8,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    expandText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTertiary,
    },
    smallButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      gap: 6,
    },
    smallButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: BRAND_COLORS.primary,
    },
  });
