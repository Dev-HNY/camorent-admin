/**
 * Push Notification Service for Firebase Cloud Messaging
 * Handles notification registration, permissions, and token management
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { updateDeviceToken } from './api';

// Configure how notifications should be displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isBookingRequest = notification.request.content.data?.type === 'booking_request';

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      // For booking requests, use high priority
      priority: isBookingRequest ? Notifications.AndroidNotificationPriority.MAX : Notifications.AndroidNotificationPriority.HIGH,
    };
  },
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  /**
   * Register for push notifications
   * @returns {Promise<string|null>} The device token or null if failed
   */
  async registerForPushNotifications() {
    let token = null;

    // Check if running on physical device
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return null;
    }

    try {
      // Check current permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
            allowCriticalAlerts: true,
          },
          android: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      // If permission denied, return null
      if (finalStatus !== 'granted') {
        console.warn('Push notification permission denied');
        return null;
      }

      // Configure notification categories for action buttons (iOS and Android)
      await Notifications.setNotificationCategoryAsync('booking_request', [
        {
          identifier: 'approve',
          buttonTitle: 'Approve',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'reject',
          buttonTitle: 'Reject',
          options: {
            opensAppToForeground: true,
          },
        },
      ]);

      // Configure Android notification channel BEFORE getting token
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('booking_requests', {
          name: 'Booking Requests - Critical',
          description: 'Critical booking requests that require immediate attention',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 300, 500, 800, 1000, 1300, 1500, 2000, 2500, 3000], // Longer, more persistent vibration
          lightColor: '#701AD3', // Brand purple color
          sound: 'notification_sound.wav', // Custom sound (will use default if file not found)
          enableLights: true,
          enableVibrate: true,
          showBadge: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true, // Bypass Do Not Disturb for critical booking requests
        });

        // Also create a default channel with high priority
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B35',
          sound: 'default',
          enableLights: true,
          enableVibrate: true,
          showBadge: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true,
        });

        console.log('📱 Android notification channels configured with MAX importance');
        console.log('✅ Full-screen intent permission requested');
        console.log('✅ Bypass DND enabled for critical notifications');
        console.log('✅ Notification categories registered with action buttons');
      }

      // Get the Expo push token with the EAS projectId
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        console.error('EAS Project ID not found in app.json');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      token = tokenData.data;
      console.log('Expo Push Token:', token);
      console.log('Project ID:', projectId);

      this.expoPushToken = token;
      return token;

    } catch (error) {
      console.error('Error registering for push notifications:', error);
      console.error('Error details:', error.message);
      return null;
    }
  }

  /**
   * Send device token to backend server
   * @param {string} token - The FCM device token
   * @returns {Promise<boolean>} Success status
   */
  async sendTokenToBackend(token) {
    try {
      const result = await updateDeviceToken(token);
      if (result.success) {
        console.log('Device token registered with backend');
        return true;
      } else {
        console.error('Failed to register device token:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
      return false;
    }
  }

  /**
   * Set up notification listeners
   * @param {Function} onNotificationReceived - Callback when notification received while app is open
   * @param {Function} onNotificationTapped - Callback when notification is tapped
   */
  setupNotificationListeners(onNotificationReceived, onNotificationTapped) {
    // Listener for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      if (onNotificationTapped) {
        onNotificationTapped(response);
      }
    });
  }

  /**
   * Remove notification listeners
   */
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }
  }

  /**
   * Get last notification response (useful for handling notifications that opened the app)
   * @returns {Promise<Object|null>} The last notification response
   */
  async getLastNotificationResponse() {
    try {
      const response = await Notifications.getLastNotificationResponseAsync();
      return response;
    } catch (error) {
      console.error('Error getting last notification:', error);
      return null;
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Get notification permissions status
   * @returns {Promise<string>} Permission status
   */
  async getPermissionStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting permission status:', error);
      return 'undetermined';
    }
  }

  /**
   * Send a test local notification
   * @returns {Promise<string|null>} Notification ID or null if failed
   */
  async sendTestNotification() {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Test Notification",
          body: "This is a test notification from CAMORENT Admin",
          data: {
            type: 'test',
            timestamp: Date.now()
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null, // Show immediately
      });

      console.log('Test notification sent with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return null;
    }
  }
}

// Export singleton instance
export default new NotificationService();
