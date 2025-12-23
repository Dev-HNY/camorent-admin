import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import ShootRequestCard from '../components/ShootRequestCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { AnimatedCard } from '../components';
import { getPendingBookings, getDraftBookings, approveBooking, rejectBooking } from '../services/api';

// Mock data for shoot requests - fallback if API fails
const MOCK_REQUESTS = [
  {
    id: '1',
    shootName: 'Unacademy Brand Shoot',
    customerName: 'Ritik Gupta',
    location: 'Bangalore, India',
    duration: {
      days: 3,
      startDate: '2025-12-18',
      endDate: '2025-12-21',
      dateRange: '2025-12-18 - 2025-12-21'
    },
    budget: {
      amount: 25000,
      currency: 'INR'
    },
    equipment: ['Canon EOS R5', 'RF 24-70mm f/2.8', 'Godox AD600'],
    crew: ['4 Light Man', '2 Camera Operators', '1 Sound Engineer'],
    priority: 'high',
    status: 'pending',
    requestDate: '2024-12-15',
  },
  {
    id: '2',
    shootName: 'Product Launch Video',
    customerName: 'Sarah Johnson',
    location: 'Mumbai, India',
    duration: {
      days: 2,
      startDate: '2025-12-20',
      endDate: '2025-12-22',
      dateRange: '2025-12-20 - 2025-12-22'
    },
    budget: {
      amount: 18500,
      currency: 'INR'
    },
    equipment: ['Sony FX3', 'Sony 24-70mm f/2.8 GM', 'DJI Ronin RS3', 'Wireless Mic Set'],
    crew: ['2 Light Man', '1 Camera Operator'],
    priority: 'medium',
    status: 'pending',
    requestDate: '2024-12-14',
  },
  {
    id: '3',
    shootName: 'Corporate Event Coverage',
    customerName: 'Michael Chen',
    location: 'Delhi, India',
    duration: {
      days: 1,
      startDate: '2025-12-25',
      endDate: '2025-12-25',
      dateRange: '2025-12-25'
    },
    budget: {
      amount: 12000,
      currency: 'INR'
    },
    equipment: ['Canon EOS R6', 'RF 24-105mm f/4', 'Speedlite'],
    crew: ['1 Photographer', '1 Assistant'],
    priority: 'low',
    status: 'approved',
    requestDate: '2024-12-13',
  },
  {
    id: '4',
    shootName: 'Fashion Photoshoot',
    customerName: 'Priya Sharma',
    location: 'Chennai, India',
    duration: {
      days: 2,
      startDate: '2025-12-22',
      endDate: '2025-12-23',
      dateRange: '2025-12-22 - 2025-12-23'
    },
    budget: {
      amount: 15000,
      currency: 'INR'
    },
    equipment: ['Nikon Z9', 'Portrait Lenses', 'Studio Lights'],
    crew: ['2 Light Man', '1 Photographer'],
    priority: 'medium',
    status: 'approved',
    requestDate: '2024-12-12',
  },
];

export default function RequestsScreen() {
  const { isDark, themeTransitionAnim } = useTheme();
  const theme = getTheme(isDark);

  const [refreshing, setRefreshing] = useState(false);
  const [viewFilter, setViewFilter] = useState('requests'); // 'requests' or 'drafts'
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const statsScaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(statsScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Fetch bookings on mount
    fetchBookings();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchBookings(true); // Silent refresh (no loading state)
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Refetch when view filter changes
  useEffect(() => {
    fetchBookings();
  }, [viewFilter]);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);

      // Fetch based on view filter
      const result = viewFilter === 'requests'
        ? await getPendingBookings(1, 50)
        : await getDraftBookings(1, 50);

      if (result.success) {
        // The API returns { data: [...], meta: {...} }
        const bookings = result.data.data || [];

        // Transform backend data to match the card format
        const transformedBookings = bookings.map((booking) => ({
          id: booking.booking_id,
          userId: booking.user?.user_id || booking.user_id,
          shootName: booking.shoot_name || 'Untitled Shoot',
          customerName: booking.user_name || booking.user?.name || 'Customer',
          location: booking.user_address || 'Address not provided',
          contactNumber: booking.user_phone || booking.user?.phone || null,
          duration: {
            days: booking.total_rental_days || 1,
            startDate: booking.rental_start_date,
            endDate: booking.rental_end_date,
            dateRange: `${booking.rental_start_date} - ${booking.rental_end_date}`,
          },
          budget: {
            amount: parseFloat(booking.total_amount) || 0,
            currency: 'INR',
          },
          equipment: booking.sku_list && booking.sku_list.length > 0 ? booking.sku_list : [],
          crew: booking.crew_items && booking.crew_items.length > 0
            ? booking.crew_items.map(c => `${c.quantity}× ${c.crew_type_name}`)
            : [],
          priority: 'medium',
          status: booking.status,
          requestDate: booking.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));

        setPendingRequests(transformedBookings);
      } else {
        setError(result.error);
        // Use mock data as fallback
        setPendingRequests(MOCK_REQUESTS.filter(r => r.status === 'pending'));
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      // Use mock data as fallback
      setPendingRequests(MOCK_REQUESTS.filter(r => r.status === 'pending'));
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleApprove = async (bookingId) => {
    try {
      const result = await approveBooking(bookingId);

      if (result.success) {
        // Refresh the list immediately
        await fetchBookings();

        Alert.alert(
          'Success',
          'Booking approved successfully! Invoice has been created.'
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to approve booking');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      Alert.alert('Error', 'An unexpected error occurred while approving the booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const result = await rejectBooking(bookingId);

      if (result.success) {
        // Refresh the list immediately
        await fetchBookings();

        Alert.alert(
          'Success',
          'Booking rejected and moved to drafts.'
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      Alert.alert('Error', 'An unexpected error occurred while rejecting the booking');
    }
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

      {/* Stats Overview - Show Total Requests */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: statsScaleAnim }],
        }}
      >
        <LinearGradient
          colors={[theme.surfaceElevated, theme.surface]}
          style={dynamicStyles.statsContainer}
        >
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={32} color={BRAND_COLORS.primary} />
              <Text style={[styles.statNumber, { color: BRAND_COLORS.primary }]}>
                {pendingRequests.length}
              </Text>
              <Text style={dynamicStyles.statLabel}>Total Requests</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* View Filter - Requests/Drafts Toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            dynamicStyles.filterButton,
            viewFilter === 'requests' && dynamicStyles.filterButtonActive,
          ]}
          onPress={() => setViewFilter('requests')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="document-text"
            size={18}
            color={viewFilter === 'requests' ? '#FFFFFF' : theme.textSecondary}
          />
          <Text
            style={[
              dynamicStyles.filterButtonText,
              viewFilter === 'requests' && dynamicStyles.filterButtonTextActive,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            dynamicStyles.filterButton,
            viewFilter === 'drafts' && dynamicStyles.filterButtonActive,
          ]}
          onPress={() => setViewFilter('drafts')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="document-outline"
            size={18}
            color={viewFilter === 'drafts' ? '#FFFFFF' : theme.textSecondary}
          />
          <Text
            style={[
              dynamicStyles.filterButtonText,
              viewFilter === 'drafts' && dynamicStyles.filterButtonTextActive,
            ]}
          >
            Drafts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <Animated.View
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
          },
        ]}
      >
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={BRAND_COLORS.primary} />
              <Text style={dynamicStyles.loadingText}>Loading requests...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={64} color={BRAND_COLORS.error} />
              <Text style={dynamicStyles.errorText}>{error}</Text>
              <TouchableOpacity
                style={dynamicStyles.retryButton}
                onPress={fetchBookings}
              >
                <Text style={dynamicStyles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map((request, index) => (
              <AnimatedCard
                key={request.id}
                delay={index * 100}
                animationType="slideUp"
              >
                <ShootRequestCard
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </AnimatedCard>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color={theme.textDisabled} />
              <Text style={dynamicStyles.emptyStateText}>No pending requests</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
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
    paddingVertical: 80,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
});

// Dynamic styles that change with theme
const createDynamicStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientStart,
    },
    statsContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
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
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      gap: 8,
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
      fontSize: 16,
      color: theme.textQuaternary,
      fontWeight: '500',
      marginTop: 16,
    },
    loadingText: {
      fontSize: 16,
      color: theme.textTertiary,
      fontWeight: '500',
      marginTop: 16,
    },
    errorText: {
      fontSize: 16,
      color: BRAND_COLORS.error,
      fontWeight: '500',
      marginTop: 16,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 24,
      paddingHorizontal: 32,
      paddingVertical: 12,
      backgroundColor: BRAND_COLORS.primary,
      borderRadius: 12,
    },
    retryButtonText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
