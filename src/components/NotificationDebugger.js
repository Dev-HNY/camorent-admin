import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationService from '../services/NotificationService';
import { BRAND_COLORS } from '../theme/colors';

export default function NotificationDebugger({ onClose }) {
  const [status, setStatus] = useState('');
  const [pushToken, setPushToken] = useState('');

  const checkPermissions = async () => {
    const permStatus = await NotificationService.getPermissionStatus();
    setStatus(`Permission Status: ${permStatus}`);
    Alert.alert('Permission Status', permStatus);
  };

  const sendTestNotification = async () => {
    const result = await NotificationService.sendTestNotification();
    if (result) {
      Alert.alert('Success', 'Test notification sent! Check your notification tray.');
    } else {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const getPushToken = async () => {
    const token = await NotificationService.registerForPushNotifications();
    if (token) {
      setPushToken(token);
      Alert.alert('Push Token', token, [
        { text: 'Copy', onPress: () => console.log('Token:', token) },
        { text: 'OK' }
      ]);
    } else {
      Alert.alert('Error', 'Failed to get push token');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Debugger</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={checkPermissions}
        >
          <Ionicons name="key-outline" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Check Permissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={sendTestNotification}
        >
          <Ionicons name="notifications-outline" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Send Test Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={getPushToken}
        >
          <Ionicons name="code-outline" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Get Push Token</Text>
        </TouchableOpacity>

        {status ? (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ) : null}

        {pushToken ? (
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>Push Token:</Text>
            <Text style={styles.tokenText} selectable>{pushToken}</Text>
          </View>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Testing Checklist:</Text>
          <Text style={styles.infoText}>1. Check permissions are granted</Text>
          <Text style={styles.infoText}>2. Send test notification</Text>
          <Text style={styles.infoText}>3. Get push token for backend</Text>
          <Text style={styles.infoText}>4. Send notification from backend</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBox: {
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
  },
  tokenBox: {
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  tokenLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 8,
  },
  tokenText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  infoBox: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  infoTitle: {
    color: BRAND_COLORS.success,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 4,
  },
});
