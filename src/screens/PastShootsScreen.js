import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import PastShootCard from '../components/PastShootCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { AnimatedCard } from '../components';
import { getCompletedBookings } from '../services/api';

// Mock data for past shoots with payment tracking
const MOCK_PAST_SHOOTS = [
  {
    id: '1',
    clientName: 'Alex Rivera',
    equipmentRented: ['Canon C70', 'Canon CN-E 24mm', 'Aputure 600D'],
    startDate: '2024-12-08',
    endDate: '2024-12-12',
    totalDays: 5,
    location: 'Brooklyn Warehouse',
    status: 'completed',
    revenue: 3200,
    paymentStatus: 'paid',
    rating: 5,
    review: {
      hasReview: true,
      comment: 'Excellent service! The equipment was in perfect condition and the team was very professional.'
    }
  },
  {
    id: '2',
    clientName: 'Sophia Martinez',
    equipmentRented: ['RED Komodo', 'Zeiss CP.3 Set'],
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    totalDays: 5,
    location: 'Manhattan Loft',
    status: 'completed',
    revenue: 5800,
    paymentStatus: 'pending',
    rating: 5,
    review: {
      hasReview: true,
      comment: 'Outstanding service from start to finish! Professional equipment and excellent support.'
    }
  },
  {
    id: '3',
    clientName: 'Tom Anderson',
    equipmentRented: ['Sony A7SIII', 'Tamron 28-75mm', 'Gimbal'],
    startDate: '2024-11-28',
    endDate: '2024-11-29',
    totalDays: 2,
    location: 'Times Square',
    status: 'completed',
    revenue: 980,
    paymentStatus: 'paid',
    rating: 4,
    review: {
      hasReview: true,
      comment: 'Great experience overall. Equipment quality was top-notch.'
    }
  },
  {
    id: '4',
    clientName: 'Emily Foster',
    equipmentRented: ['Nikon Z8', 'Z 24-120mm f/4'],
    startDate: '2024-11-25',
    endDate: '2024-11-27',
    totalDays: 3,
    location: 'Central Park',
    status: 'completed',
    revenue: 1450,
    paymentStatus: 'pending',
    rating: 5,
    review: {
      hasReview: false,
      comment: ''
    }
  },
  {
    id: '5',
    clientName: 'Marcus Johnson',
    equipmentRented: ['DJI Ronin 4D', 'DJI LiDAR'],
    startDate: '2024-11-20',
    endDate: '2024-11-24',
    totalDays: 5,
    location: 'Queens Studio',
    status: 'completed',
    revenue: 4200,
    paymentStatus: 'paid',
    rating: 4,
    review: {
      hasReview: true,
      comment: 'Very professional service. The equipment worked flawlessly.'
    }
  },
  {
    id: '6',
    clientName: 'Rachel Kim',
    equipmentRented: ['Canon R5C', 'RF Lens Set', 'Lighting Kit'],
    startDate: '2024-11-15',
    endDate: '2024-11-18',
    totalDays: 4,
    location: 'Los Angeles Studio',
    status: 'completed',
    revenue: 3800,
    paymentStatus: 'pending',
    rating: 5,
    review: {
      hasReview: true,
      comment: 'Amazing equipment and support team!'
    }
  },
];

export default function PastShootsScreen() {
  const { isDark, themeTransitionAnim } = useTheme();
  const theme = getTheme(isDark);

  const [refreshing, setRefreshing] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('all'); // all, pending
  const [pastShoots, setPastShoots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const analyticsSlideAnim = useRef(new Animated.Value(-30)).current;
  const card1ScaleAnim = useRef(new Animated.Value(0.9)).current;
  const card2ScaleAnim = useRef(new Animated.Value(0.9)).current;
  const card3ScaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(analyticsSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Fetch completed bookings on mount
    fetchPastShoots();

    // Staggered card animations
    setTimeout(() => {
      Animated.spring(card1ScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 150);

    setTimeout(() => {
      Animated.spring(card2ScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 250);

    setTimeout(() => {
      Animated.spring(card3ScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 350);

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchPastShoots(true); // Silent refresh
    }, 30000);

    // Cleanup
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchPastShoots = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);

      const result = await getCompletedBookings(1, 50);

      if (result.success) {
        // The API returns { data: [...], meta: {...} }
        const bookings = result.data.data || [];

        // Transform backend data to match the card format
        const transformedShoots = bookings.map((booking) => {
          return {
            id: booking.booking_id,
            userId: booking.user?.user_id || booking.user_id,
            clientName: booking.user_name || booking.user?.name || 'Customer',
            equipmentRented: booking.sku_list && booking.sku_list.length > 0 ? booking.sku_list : [],
            crew: booking.crew_items && booking.crew_items.length > 0
              ? booking.crew_items.map(c => `${c.quantity}× ${c.crew_type_name}`)
              : [],
            startDate: booking.rental_start_date,
            endDate: booking.rental_end_date,
            totalDays: booking.total_rental_days || 1,
            location: booking.user_address || 'Address not provided',
            contactNumber: booking.user_phone || booking.user?.phone || null,
            status: 'completed',
            revenue: parseFloat(booking.total_amount) || 0,
            paymentStatus: booking.payment_status === 'paid' ? 'paid' : 'pending',
            rating: booking.rating || 0,
            review: booking.review || {
              hasReview: false,
              comment: ''
            }
          };
        });

        setPastShoots(transformedShoots);
      } else {
        setError(result.error);
        // Use mock data as fallback
        setPastShoots(MOCK_PAST_SHOOTS);
      }
    } catch (err) {
      console.error('Error fetching past shoots:', err);
      setError('Failed to load past shoots');
      // Use mock data as fallback
      setPastShoots(MOCK_PAST_SHOOTS);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPastShoots();
    setRefreshing(false);
  };

  // Filter shoots based on payment status
  const getFilteredShoots = () => {
    if (paymentFilter === 'pending') {
      return pastShoots.filter(shoot => shoot.paymentStatus === 'pending');
    }
    return pastShoots;
  };

  const filteredShoots = getFilteredShoots();

  // Calculate statistics
  const totalShoots = pastShoots.length;
  const totalRevenue = pastShoots.reduce((sum, shoot) => sum + shoot.revenue, 0);
  const pendingPayments = pastShoots.filter(s => s.paymentStatus === 'pending');
  const pendingPaymentAmount = pendingPayments.reduce((sum, shoot) => sum + shoot.revenue, 0);

  // Handler functions
  const handleViewInvoice = (shoot) => {
    Alert.alert(
      'View Invoice',
      `Opening invoice for ${shoot.clientName}\nAmount: ₹${shoot.revenue.toLocaleString()}\nStatus: ${shoot.paymentStatus.toUpperCase()}`,
      [
        { text: 'Download PDF', onPress: () => console.log('Download PDF') },
        { text: 'Share', onPress: () => console.log('Share Invoice') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleSendReminder = (shoot) => {
    Alert.alert(
      'Send Payment Reminder',
      `Send reminder to ${shoot.clientName}?\nPending Amount: ₹${shoot.revenue.toLocaleString()}`,
      [
        {
          text: 'Send Email',
          onPress: () => {
            Alert.alert('Success', 'Payment reminder sent via email!');
          }
        },
        {
          text: 'Send SMS',
          onPress: () => {
            Alert.alert('Success', 'Payment reminder sent via SMS!');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
      <Animated.View
        style={[
          dynamicStyles.container,
          {
            opacity: themeTransitionAnim,
          },
        ]}
      >
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Analytics Section */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: analyticsSlideAnim }],
        }}
      >
        <LinearGradient
          colors={[theme.surfaceElevated, theme.surface]}
          style={dynamicStyles.analyticsContainer}
        >
          <Text style={dynamicStyles.sectionTitle}>Payment Overview</Text>

          <View style={styles.analyticsGrid}>
            <Animated.View
              style={[
                styles.analyticsCard,
                {
                  transform: [{ scale: card1ScaleAnim }],
                },
              ]}
            >
              <View style={[dynamicStyles.analyticsIconContainer, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                <Ionicons name="checkmark-done" size={22} color={BRAND_COLORS.primary} />
              </View>
              <Text style={[styles.analyticsNumber, { color: BRAND_COLORS.primary }]}>
                {totalShoots}
              </Text>
              <Text style={dynamicStyles.analyticsLabel}>Total Shoots</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.analyticsCard,
                {
                  transform: [{ scale: card2ScaleAnim }],
                },
              ]}
            >
              <View style={[dynamicStyles.analyticsIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
                <Ionicons name="cash" size={22} color={BRAND_COLORS.success} />
              </View>
              <Text style={[styles.analyticsNumber, { color: BRAND_COLORS.success }]}>
                ₹{(totalRevenue / 1000).toFixed(1)}k
              </Text>
              <Text style={dynamicStyles.analyticsLabel}>Total Revenue</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.analyticsCard,
                {
                  transform: [{ scale: card3ScaleAnim }],
                },
              ]}
            >
              <View style={[dynamicStyles.analyticsIconContainer, { backgroundColor: 'rgba(255, 159, 10, 0.15)' }]}>
                <Ionicons name="alert-circle" size={22} color="#FF9F0A" />
              </View>
              <Text style={[styles.analyticsNumber, { color: '#FF9F0A' }]}>
                ₹{(pendingPaymentAmount / 1000).toFixed(1)}k
              </Text>
              <Text style={dynamicStyles.analyticsLabel}>Pending ({pendingPayments.length})</Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Payment Filter */}
      <Animated.View
        style={[
          dynamicStyles.filterContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              dynamicStyles.filterButton,
              paymentFilter === 'all' && dynamicStyles.filterButtonActive,
            ]}
            onPress={() => setPaymentFilter('all')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="list"
              size={16}
              color={paymentFilter === 'all' ? '#FFFFFF' : theme.textTertiary}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              dynamicStyles.filterButtonText,
              paymentFilter === 'all' && dynamicStyles.filterButtonTextActive,
            ]}>
              All Shoots ({totalShoots})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.filterButton,
              paymentFilter === 'pending' && dynamicStyles.filterButtonActive,
            ]}
            onPress={() => setPaymentFilter('pending')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="time"
              size={16}
              color={paymentFilter === 'pending' ? '#FFFFFF' : '#FF9F0A'}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              dynamicStyles.filterButtonText,
              paymentFilter === 'pending' && dynamicStyles.filterButtonTextActive,
              paymentFilter !== 'pending' && { color: '#FF9F0A' },
            ]}>
              Pending Payments ({pendingPayments.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Past Shoots List */}
      <Animated.View
        style={[
          styles.scrollViewContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BRAND_COLORS.primary} />
            <Text style={dynamicStyles.loadingText}>Loading past shoots...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={BRAND_COLORS.warning} />
            <Text style={dynamicStyles.errorText}>Failed to load past shoots</Text>
            <Text style={dynamicStyles.errorSubtext}>{error}</Text>
            <TouchableOpacity
              style={dynamicStyles.retryButton}
              onPress={fetchPastShoots}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={BRAND_COLORS.primary}
                colors={[BRAND_COLORS.primary]}
              />
            }
          >
            {filteredShoots.length > 0 ? (
              filteredShoots.map((shoot, index) => (
                <AnimatedCard
                  key={shoot.id}
                  delay={index * 100}
                  animationType="slideUp"
                >
                  <PastShootCard
                    shoot={shoot}
                    onViewInvoice={() => handleViewInvoice(shoot)}
                    onSendReminder={() => handleSendReminder(shoot)}
                  />
                </AnimatedCard>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle-outline" size={64} color={theme.textDisabled} />
                <Text style={dynamicStyles.emptyStateText}>
                  {paymentFilter === 'pending' ? 'No pending payments!' : 'No past shoots'}
                </Text>
                <Text style={dynamicStyles.emptyStateSubtext}>
                  {paymentFilter === 'pending'
                    ? 'All payments have been received'
                    : 'Completed rentals will appear here'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    alignItems: 'center',
    gap: 8,
  },
  analyticsNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Dynamic styles that change with theme
const createDynamicStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientStart,
    },
    analyticsContainer: {
      paddingVertical: 24,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 20,
    },
    analyticsIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    analyticsLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textQuaternary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    filterContainer: {
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
    },
    filterButtonActive: {
      backgroundColor: BRAND_COLORS.primary,
      borderColor: BRAND_COLORS.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textTertiary,
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    emptyStateText: {
      fontSize: 18,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 16,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.textQuaternary,
      fontWeight: '500',
      marginTop: 8,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 16,
    },
    errorText: {
      fontSize: 18,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 16,
    },
    errorSubtext: {
      fontSize: 14,
      color: theme.textQuaternary,
      fontWeight: '500',
      marginTop: 8,
      textAlign: 'center',
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: BRAND_COLORS.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 24,
    },
  });
