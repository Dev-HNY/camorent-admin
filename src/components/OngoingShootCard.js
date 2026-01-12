import { useState } from 'react';
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { viewInvoice, sendInvoice } from '../services/api';
import { AnimatedButton, AnimatedAlert, UserDetailsModal } from '../components';
import { responsive } from '../utils/responsive';
import { shadows, modernCard } from '../theme/modernStyles';

export default function OngoingShootCard({ shoot }) {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [showInvoiceAlert, setShowInvoiceAlert] = useState(false);
  const [showSendInvoiceAlert, setShowSendInvoiceAlert] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const getStatusColor = () => {
    if (shoot.daysRemaining <= 1) return { primary: '#FF453A', secondary: '#FF6961' };
    if (shoot.daysRemaining <= 3) return { primary: '#FF9F0A', secondary: '#FFCC00' };
    return { primary: '#34C759', secondary: '#30D158' };
  };

  const statusColors = getStatusColor();
  const progressPercentage = ((shoot.totalDays - shoot.daysRemaining) / shoot.totalDays) * 100;

  // Check if shoot is upcoming (hasn't started yet)
  const isUpcoming = shoot.shootStatus === 'upcoming';

  // Get days text based on status
  const getDaysText = () => {
    if (isUpcoming) {
      return `Shoot coming in ${shoot.daysRemaining} day${shoot.daysRemaining > 1 ? 's' : ''}`;
    }
    return `${shoot.daysRemaining}/${shoot.totalDays} Day${shoot.totalDays > 1 ? 's' : ''} Left`;
  };

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

  const handleSendInvoice = () => {
    setShowSendInvoiceAlert(true);
  };

  const confirmSendInvoice = async () => {
    setIsSendingInvoice(true);
    try {
      const result = await sendInvoice(shoot.id);
      if (result.success) {
        Alert.alert('Success', 'Invoice sent successfully to customer');
      } else {
        Alert.alert('Error', result.error || 'Failed to send invoice');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSendingInvoice(false);
    }
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <View style={dynamicStyles.card}>
      {/* Status Bar */}
      <LinearGradient
        colors={[statusColors.primary, statusColors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.statusBar}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={[statusColors.primary, statusColors.secondary]}
            style={styles.iconContainer}
          >
            <Text style={styles.iconText}>🎬</Text>
          </LinearGradient>
          <View style={styles.headerInfo}>
            <Text style={dynamicStyles.shootName}>{shoot.shootName}</Text>
            <TouchableOpacity
              style={styles.customerRow}
              onPress={() => setShowUserDetails(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.customerIcon}>👤</Text>
              <Text style={styles.customerName}>{shoot.customerName}</Text>
              <Ionicons name="information-circle" size={16} color={BRAND_COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Location */}
      <View style={styles.infoRow}>
        <Ionicons name="location" size={16} color={BRAND_COLORS.primary} />
        <Text style={dynamicStyles.infoText}>{shoot.location}</Text>
      </View>

      {/* Payment Section */}
      <View style={dynamicStyles.paymentSection}>
        <View style={styles.paymentAmount}>
          <Text style={dynamicStyles.paymentLabel}>Payment</Text>
          <Text style={[
            styles.paymentValue,
            { color: shoot.payment.status === 'paid' ? BRAND_COLORS.success : '#FF9F0A' }
          ]}>
            ₹{shoot.payment.amount.toLocaleString()}
          </Text>
        </View>
        <View style={[
          styles.paymentBadge,
          { backgroundColor: shoot.payment.status === 'paid' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 159, 10, 0.15)' }
        ]}>
          <View style={[
            styles.badgeDot,
            { backgroundColor: shoot.payment.status === 'paid' ? BRAND_COLORS.success : '#FF9F0A' }
          ]} />
          <Text style={[
            styles.badgeText,
            { color: shoot.payment.status === 'paid' ? BRAND_COLORS.success : '#FF9F0A' }
          ]}>
            {shoot.payment.status === 'paid' ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <View style={styles.daysInfo}>
            <Text style={styles.daysIcon}>
              {isUpcoming ? '🗓️' : shoot.daysRemaining <= 1 ? '🚨' : shoot.daysRemaining <= 3 ? '⚠️' : '📅'}
            </Text>
            <Text style={[styles.daysText, { color: statusColors.primary }]}>
              {getDaysText()}
            </Text>
          </View>
          {!isUpcoming && (
            <Text style={dynamicStyles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          )}
        </View>
        <View style={[
          styles.progressBarContainer,
          { backgroundColor: theme.inputBackground }
        ]}>
          <LinearGradient
            colors={[statusColors.primary, statusColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsGrid}>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={dynamicStyles.smallButton}
            onPress={handleContact}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={16} color={BRAND_COLORS.primary} />
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

        <AnimatedButton
          title="Send Invoice"
          onPress={handleSendInvoice}
          variant="secondary"
          size="medium"
          icon="send-outline"
          iconPosition="left"
          loading={isSendingInvoice}
          disabled={isSendingInvoice}
          animationType="pulse"
          fullWidth={true}
        />
      </View>

      {/* <AnimatedButton
        title="Mark as Complete"
        onPress={() => {}}
        variant="primary"
        size="medium"
        icon="checkmark-circle"
        iconPosition="left"
        fullWidth={true}
        animationType="shimmer"
      /> */}

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

      {/* Send Invoice Alert */}
      <AnimatedAlert
        visible={showSendInvoiceAlert}
        onClose={() => setShowSendInvoiceAlert(false)}
        type="success"
        title="Send Invoice"
        message={`Send invoice to ${shoot.customerName}?\n\nThe invoice will be sent via email and SMS.`}
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Send',
            style: 'primary',
            onPress: confirmSendInvoice,
          },
        ]}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        visible={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        userId={shoot.userId || shoot.user_id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: responsive.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsive.spacing.md,
    marginTop: responsive.spacing.xs,
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
  customerName: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '600',
    color: BRAND_COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.sm,
    marginBottom: responsive.spacing.md,
  },
  paymentAmount: {
    flex: 1,
  },
  paymentValue: {
    fontSize: responsive.fontSize.xxl,
    fontWeight: '800',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
    borderRadius: responsive.borderRadius.sm,
    gap: responsive.spacing.xs,
  },
  badgeDot: {
    width: responsive.spacing.sm,
    height: responsive.spacing.sm,
    borderRadius: responsive.spacing.xs,
  },
  badgeText: {
    fontSize: responsive.fontSize.sm,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: responsive.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.spacing.sm,
  },
  daysInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.sm,
  },
  daysIcon: {
    fontSize: responsive.fontSize.lg,
  },
  daysText: {
    fontSize: responsive.fontSize.md,
    fontWeight: '700',
  },
  progressBarContainer: {
    width: '100%',
    height: responsive.spacing.sm + 2,
    borderRadius: responsive.borderRadius.xs,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: responsive.borderRadius.xs,
  },
  actionsGrid: {
    gap: responsive.spacing.md,
    marginBottom: responsive.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: responsive.spacing.md,
  },
  actionButtonHalf: {
    flex: 1,
  },
  actionButtonPrimary: {
    borderRadius: responsive.borderRadius.md,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsive.spacing.md,
    gap: responsive.spacing.sm,
  },
  actionButtonPrimaryText: {
    fontSize: responsive.fontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
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
      position: 'relative',
      overflow: 'hidden',
    },
    shootName: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: responsive.spacing.xs,
    },
    infoText: {
      fontSize: responsive.fontSize.md,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    paymentSection: {
      backgroundColor: theme.inputBackground,
      borderRadius: responsive.borderRadius.md,
      padding: responsive.spacing.lg,
      marginBottom: responsive.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.inputBorder,
      ...shadows.sm,
    },
    paymentLabel: {
      fontSize: responsive.fontSize.xs,
      fontWeight: '600',
      color: theme.textQuaternary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: responsive.spacing.xs,
    },
    progressPercentage: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    actionButtonSmall: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsive.spacing.md,
      borderRadius: responsive.borderRadius.md,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      gap: responsive.spacing.xs,
    },
    actionButtonSmallText: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    smallButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsive.spacing.md,
      paddingHorizontal: responsive.spacing.md,
      borderRadius: responsive.borderRadius.md,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      gap: responsive.spacing.xs,
    },
    smallButtonText: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '600',
      color: BRAND_COLORS.primary,
    },
  });
