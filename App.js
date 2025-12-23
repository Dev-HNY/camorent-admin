import React, { useCallback, useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';

// Context
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { getTheme, BRAND_COLORS } from './src/theme/colors';

// Components
import ProfileMenu from './src/components/ProfileMenu';
import BookingApprovalAlert from './src/components/BookingApprovalAlert';

// Services
import NotificationService from './src/services/NotificationService';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RequestsScreen from './src/screens/RequestsScreen';
import OngoingShootsScreen from './src/screens/OngoingShootsScreen';
import PastShootsScreen from './src/screens/PastShootsScreen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused) => {
  let iconName;

  if (routeName === 'Requests') {
    iconName = focused ? 'document-text' : 'document-text-outline';
  } else if (routeName === 'Ongoing') {
    iconName = focused ? 'camera' : 'camera-outline';
  } else if (routeName === 'Past') {
    iconName = focused ? 'time' : 'time-outline';
  }

  return iconName;
};

function MainTabs() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const theme = getTheme(isDark);

  const screenOptions = {
    tabBarActiveTintColor: BRAND_COLORS.primary,
    tabBarInactiveTintColor: theme.textTertiary,
    tabBarStyle: {
      backgroundColor: theme.surface,
      borderTopColor: theme.surfaceBorder,
      borderTopWidth: 1,
      height: 85,
      paddingBottom: 25,
      paddingTop: 10,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.surfaceBorder,
    },
    headerTintColor: theme.textPrimary,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    headerRight: () => <ProfileMenu adminName={user?.first_name || 'Admin'} />,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...screenOptions,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{ title: 'Shoot Requests' }}
      />
      <Tab.Screen
        name="Ongoing"
        component={OngoingShootsScreen}
        options={{ title: 'Ongoing Shoots' }}
      />
      <Tab.Screen
        name="Past"
        component={PastShootsScreen}
        options={{ title: 'Past Shoots' }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [showApprovalAlert, setShowApprovalAlert] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigationRef = useRef(null);

  const handleLogin = useCallback(() => {
    // Login is handled by AuthContext, this just triggers navigation
  }, []);

  // Register for push notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      registerPushNotifications();
      setupNotificationListeners();

      // Check if app was opened from a notification
      checkLastNotification();

      return () => {
        NotificationService.removeNotificationListeners();
      };
    }
  }, [isAuthenticated]);

  const registerPushNotifications = async () => {
    try {
      // Register for push notifications
      const token = await NotificationService.registerForPushNotifications();

      if (token) {
        // Send token to backend
        await NotificationService.sendTokenToBackend(token);
        console.log('Push notifications registered successfully');
      } else {
        console.warn('Failed to get push token');
      }
    } catch (error) {
      console.error('Error registering push notifications:', error);
    }
  };

  const setupNotificationListeners = () => {
    NotificationService.setupNotificationListeners(
      // Handler for notifications received while app is open
      (notification) => {
        const data = notification.request.content.data;

        if (data.type === 'booking_request') {
          // Show the custom approval alert
          setBookingData({
            booking_id: data.booking_id,
            customer_name: data.customer_name,
            shoot_name: data.shoot_name,
            total_amount: data.total_amount,
            rental_days: data.rental_days,
            rental_start_date: data.rental_start_date,
            rental_end_date: data.rental_end_date,
            equipment: (data.equipment_details || []).map((item, idx) => ({
              equipment_name: item,
              quantity: 1,
              id: idx
            })),
            crew: (data.crew_details || []).map((item, idx) => ({
              crew_name: item,
              id: idx
            })),
          });
          setShowApprovalAlert(true);
        }
      },

      // Handler for when user taps on notification
      (response) => {
        const data = response.notification.request.content.data;

        if (data.type === 'booking_request') {
          // Show the custom approval alert
          setBookingData({
            booking_id: data.booking_id,
            customer_name: data.customer_name,
            shoot_name: data.shoot_name,
            total_amount: data.total_amount,
            rental_days: data.rental_days,
            rental_start_date: data.rental_start_date,
            rental_end_date: data.rental_end_date,
            equipment: (data.equipment_details || []).map((item, idx) => ({
              equipment_name: item,
              quantity: 1,
              id: idx
            })),
            crew: (data.crew_details || []).map((item, idx) => ({
              crew_name: item,
              id: idx
            })),
          });
          setShowApprovalAlert(true);
        }
      }
    );
  };

  const checkLastNotification = async () => {
    // Check if app was opened from a notification
    const lastResponse = await NotificationService.getLastNotificationResponse();

    if (lastResponse) {
      const data = lastResponse.notification.request.content.data;

      if (data.type === 'booking_request') {
        // Show the custom approval alert
        setBookingData({
          booking_id: data.booking_id,
          customer_name: data.customer_name,
          shoot_name: data.shoot_name,
          total_amount: data.total_amount,
          rental_days: data.rental_days,
          equipment: (data.equipment_details || []).map((item, idx) => ({
            equipment_name: item,
            quantity: 1,
            id: idx
          })),
          crew: (data.crew_details || []).map((item, idx) => ({
            crew_name: item,
            id: idx
          })),
        });
        setShowApprovalAlert(true);
      }
    }
  };

  const handleAlertClose = () => {
    setShowApprovalAlert(false);
    setBookingData(null);
  };

  const handleActionComplete = (action) => {
    console.log(`Booking ${action}`);
    // Optionally refresh the requests screen
    if (navigationRef.current) {
      navigationRef.current.navigate('Requests');
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color={BRAND_COLORS.primary} />
        <Text style={{ color: '#fff', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  // Show main app if authenticated
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer ref={navigationRef}>
        <MainTabs />
      </NavigationContainer>

      {/* Booking Approval Alert - shown when notification received */}
      <BookingApprovalAlert
        visible={showApprovalAlert}
        bookingData={bookingData}
        onClose={handleAlertClose}
        onActionComplete={handleActionComplete}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
