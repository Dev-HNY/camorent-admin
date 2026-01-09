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
import OngoingShootCard from '../components/OngoingShootCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { AnimatedCard } from '../components';
import { getOngoingBookings } from '../services/api';
import { responsive } from '../utils/responsive';

// Mock data for ongoing shoots - fallback if API fails
const MOCK_ONGOING_SHOOTS = [
  {
    id: '1',
    shootName: 'Coding Ninjas Shoot',
    customerName: 'Swatantra',
    location: 'Bangalore, India',
    payment: {
      amount: 50000,
      currency: 'INR',
      status: 'pending'
    },
    totalDays: 3,
    daysRemaining: 1,
    startDate: '2024-12-18',
    endDate: '2024-12-21',
    equipmentRented: ['Canon EOS R5', 'RF 24-70mm f/2.8', 'Godox AD600'],
    contactNumber: '+91 98765 43210',
    shootStatus: 'active', // active or upcoming
  },
  {
    id: '2',
    shootName: 'Tech Conference 2025',
    customerName: 'Priya Sharma',
    location: 'Mumbai, India',
    payment: {
      amount: 85000,
      currency: 'INR',
      status: 'paid'
    },
    totalDays: 5,
    daysRemaining: 2,
    startDate: '2024-12-16',
    endDate: '2024-12-21',
    equipmentRented: ['Sony FX3', 'DJI Ronin RS3'],
    contactNumber: '+91 98765 43211',
    shootStatus: 'active',
  },
  {
    id: '3',
    shootName: 'Brand Documentary',
    customerName: 'Lisa Thompson',
    location: 'Hyderabad, India',
    payment: {
      amount: 120000,
      currency: 'INR',
      status: 'paid'
    },
    totalDays: 7,
    daysRemaining: 4,
    startDate: '2024-12-15',
    endDate: '2024-12-22',
    equipmentRented: ['RED Komodo', 'Zeiss CP.3 Set'],
    contactNumber: '+91 98765 43212',
    shootStatus: 'active',
  },
  {
    id: '4',
    shootName: 'Wedding Photography',
    customerName: 'Rahul Verma',
    location: 'Jaipur, India',
    payment: {
      amount: 45000,
      currency: 'INR',
      status: 'pending'
    },
    totalDays: 2,
    daysRemaining: 5,
    startDate: '2024-12-23',
    endDate: '2024-12-24',
    equipmentRented: ['Canon R6 Mark II', 'RF Lenses', 'Flash Kit'],
    contactNumber: '+91 98765 43213',
    shootStatus: 'upcoming',
  },
  {
    id: '5',
    shootName: 'Product Commercial',
    customerName: 'Anjali Mehta',
    location: 'Pune, India',
    payment: {
      amount: 65000,
      currency: 'INR',
      status: 'paid'
    },
    totalDays: 3,
    daysRemaining: 7,
    startDate: '2024-12-25',
    endDate: '2024-12-27',
    equipmentRented: ['Sony A7SIII', 'Gimbal', 'LED Panels'],
    contactNumber: '+91 98765 43214',
    shootStatus: 'upcoming',
  },
];

export default function OngoingShootsScreen() {
  const { isDark, themeTransitionAnim } = useTheme();
  const theme = getTheme(isDark);

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('active'); // active or upcoming
  const [ongoingShoots, setOngoingShoots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-20)).current;
  const stat1ScaleAnim = useRef(new Animated.Value(0.8)).current;
  const stat2ScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Staggered entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Fetch ongoing bookings on mount
    fetchOngoingShoots();

    // Staggered scale animations for stats
    setTimeout(() => {
      Animated.spring(stat1ScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 100);

    setTimeout(() => {
      Animated.spring(stat2ScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 200);

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchOngoingShoots(true); // Silent refresh
    }, 30000);

    // Cleanup
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchOngoingShoots = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);

      const result = await getOngoingBookings(1, 50);

      if (result.success) {
        // The API returns { data: [...], meta: {...} }
        const bookings = result.data.data || [];

        // Transform backend data to match the card format
        const transformedShoots = bookings.map((booking) => {
          const today = new Date();
          const startDate = new Date(booking.rental_start_date);
          const endDate = new Date(booking.rental_end_date);
          const totalDays = booking.total_rental_days || 1;
          const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

          // Determine if active or upcoming
          const shootStatus = today >= startDate ? 'active' : 'upcoming';

          return {
            id: booking.booking_id,
            userId: booking.user?.user_id || booking.user_id,
            shootName: booking.shoot_name || 'Untitled Shoot',
            customerName: booking.user_name || booking.user?.name || 'Customer',
            location: booking.user_address || 'Address not provided',
            payment: {
              amount: parseFloat(booking.total_amount) || 0,
              currency: 'INR',
              status: booking.payment_status === 'paid' ? 'paid' : 'pending'
            },
            totalDays: totalDays,
            daysRemaining: daysRemaining,
            startDate: booking.rental_start_date,
            endDate: booking.rental_end_date,
            equipmentRented: booking.sku_list && booking.sku_list.length > 0 ? booking.sku_list : [],
            crew: booking.crew_items && booking.crew_items.length > 0
              ? booking.crew_items.map(c => `${c.quantity}× ${c.crew_type_name}`)
              : [],
            contactNumber: booking.user_phone || booking.user?.phone || null,
            shootStatus: shootStatus,
          };
        });

        setOngoingShoots(transformedShoots);
      } else {
        setError(result.error);
        // Use mock data as fallback
        setOngoingShoots(MOCK_ONGOING_SHOOTS);
      }
    } catch (err) {
      console.error('Error fetching ongoing shoots:', err);
      setError('Failed to load ongoing shoots');
      // Use mock data as fallback
      setOngoingShoots(MOCK_ONGOING_SHOOTS);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOngoingShoots();
    setRefreshing(false);
  };

  // Filter shoots based on status
  const getFilteredShoots = () => {
    return ongoingShoots.filter(shoot => shoot.shootStatus === filter);
  };

  const filteredShoots = getFilteredShoots();

  // Calculate statistics
  const activeShoots = ongoingShoots.filter(s => s.shootStatus === 'active');
  const upcomingShoots = ongoingShoots.filter(s => s.shootStatus === 'upcoming');

  const handleSendInvoice = (shoot) => {
    Alert.alert(
      'Send Invoice',
      `Send invoice to ${shoot.customerName}?\nAmount: ₹${shoot.payment.amount.toLocaleString()}`,
      [
        {
          text: 'Send Email',
          onPress: () => {
            Alert.alert('Success', 'Invoice sent via email!');
          }
        },
        {
          text: 'Send SMS',
          onPress: () => {
            Alert.alert('Success', 'Invoice sent via SMS!');
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

        {/* Quick Stats */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: headerSlideAnim }],
        }}
      >
        <LinearGradient
          colors={[theme.surfaceElevated, theme.surface]}
          style={dynamicStyles.headerContainer}
        >
          <View style={styles.statsGrid}>
            <Animated.View
              style={[
                styles.statCard,
                {
                  transform: [{ scale: stat1ScaleAnim }],
                },
              ]}
            >
              <View style={[dynamicStyles.statIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
                <Ionicons name="videocam" size={24} color={BRAND_COLORS.success} />
              </View>
              <Text style={[styles.statNumber, { color: BRAND_COLORS.success }]}>
                {activeShoots.length}
              </Text>
              <Text style={dynamicStyles.statLabel}>Active Shoots</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.statCard,
                {
                  transform: [{ scale: stat2ScaleAnim }],
                },
              ]}
            >
              <View style={[dynamicStyles.statIconContainer, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                <Ionicons name="calendar" size={24} color={BRAND_COLORS.primary} />
              </View>
              <Text style={[styles.statNumber, { color: BRAND_COLORS.primary }]}>
                {upcomingShoots.length}
              </Text>
              <Text style={dynamicStyles.statLabel}>Upcoming</Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Filter Tabs */}
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
              filter === 'active' && dynamicStyles.filterButtonActive,
            ]}
            onPress={() => setFilter('active')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="play-circle"
              size={16}
              color={filter === 'active' ? '#FFFFFF' : BRAND_COLORS.success}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              dynamicStyles.filterButtonText,
              filter === 'active' && dynamicStyles.filterButtonTextActive,
              filter !== 'active' && { color: BRAND_COLORS.success },
            ]}>
              Active Shoots ({activeShoots.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.filterButton,
              filter === 'upcoming' && dynamicStyles.filterButtonActive,
            ]}
            onPress={() => setFilter('upcoming')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={filter === 'upcoming' ? '#FFFFFF' : BRAND_COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              dynamicStyles.filterButtonText,
              filter === 'upcoming' && dynamicStyles.filterButtonTextActive,
              filter !== 'upcoming' && { color: BRAND_COLORS.primary },
            ]}>
              Upcoming Shoots ({upcomingShoots.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Shoots List */}
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
            <Text style={dynamicStyles.loadingText}>Loading shoots...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={BRAND_COLORS.warning} />
            <Text style={dynamicStyles.errorText}>Failed to load shoots</Text>
            <Text style={dynamicStyles.errorSubtext}>{error}</Text>
            <TouchableOpacity
              style={dynamicStyles.retryButton}
              onPress={fetchOngoingShoots}
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
                tintColor={BRAND_COLORS.success}
                colors={[BRAND_COLORS.success]}
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
                  <OngoingShootCard
                    shoot={shoot}
                    onSendInvoice={() => handleSendInvoice(shoot)}
                  />
                </AnimatedCard>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="camera-outline" size={64} color={theme.textDisabled} />
                <Text style={dynamicStyles.emptyStateText}>
                  No {filter} shoots
                </Text>
                <Text style={dynamicStyles.emptyStateSubtext}>
                  {filter === 'active' ? 'Active rentals will appear here' : 'Scheduled shoots will appear here'}
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    gap: responsive.spacing.sm,
  },
  statNumber: {
    fontSize: responsive.fontSize.xxxl + responsive.fontSize.xs,
    fontWeight: '800',
  },
  filterScroll: {
    paddingHorizontal: responsive.spacing.lg,
    paddingVertical: responsive.spacing.lg,
    gap: responsive.spacing.md,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: responsive.spacing.lg,
    gap: responsive.spacing.lg,
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
    headerContainer: {
      paddingTop: 24,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
    },
    statIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTertiary,
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
