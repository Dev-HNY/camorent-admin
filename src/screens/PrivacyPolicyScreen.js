import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/colors';

const PrivacyPolicyScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
          Last Updated: January 5, 2026
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Introduction
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          CAMORENT ("we", "our", or "us") operates the CAMORENT Admin mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our administrative application for managing camera equipment rental bookings.
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          By using the CAMORENT Admin App, you agree to the collection and use of information in accordance with this policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Information We Collect
        </Text>

        <Text style={[styles.subsectionTitle, { color: theme.text }]}>
          Personal Information
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          When you use the CAMORENT Admin App, we collect and process the following personal information:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Administrator Account:</Text> Phone number (for login), password (encrypted), and admin profile information
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Customer Booking Data:</Text> Names, contact info, booking details, rental information
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Payment Information:</Text> Invoice details, payment transactions, payment status
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Device Information:</Text> Push notification tokens, device type, app version
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          How We Use Your Information
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>1.</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Authentication & Access Control
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>2.</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Booking Management & Customer Communication
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>3.</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Push Notifications for New Booking Requests
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>4.</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Invoice Generation & Payment Tracking
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>5.</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Service Improvement & Bug Fixes
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Data Storage and Security
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          We implement industry-standard security measures to protect your information:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Encrypted Communication:</Text> All data transmitted uses HTTPS/TLS encryption
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Secure Storage:</Text> Authentication tokens are stored using device-level encryption
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Access Controls:</Text> Only authorized administrators can access the system
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>No Device Backups:</Text> Android backup is disabled to prevent unauthorized data extraction
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Third-Party Services
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          We <Text style={styles.bold}>DO NOT</Text> share your personal information with third-party services for marketing or advertising purposes.
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          We use the following essential services to operate the app:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Firebase Cloud Messaging (FCM):</Text> For push notifications
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Expo Services:</Text> For app build and deployment infrastructure
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Your Rights
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          As a user of the CAMORENT Admin App, you have the following rights:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Access:</Text> Request access to your personal data
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Correction:</Text> Request correction of inaccurate data
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Deletion:</Text> Request deletion of your account and associated data
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            <Text style={styles.bold}>Data Portability:</Text> Request a copy of your data in a structured format
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Contact Us
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          If you have questions or concerns about this Privacy Policy, please contact us:
        </Text>

        <Text style={[styles.contactInfo, { color: theme.text }]}>
          <Text style={styles.bold}>CAMORENT</Text>
        </Text>
        <Text style={[styles.contactInfo, { color: theme.primary }]}>
          Email: support@camorent.co.in
        </Text>
        <Text style={[styles.contactInfo, { color: theme.text }]}>
          Website: https://camorent.co.in
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Consent
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          By using the CAMORENT Admin App, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 20,
  },
  listText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default PrivacyPolicyScreen;
