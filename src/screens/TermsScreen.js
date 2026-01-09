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

const TermsScreen = ({ navigation }) => {
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
          Terms & Conditions
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
          1. Acceptance of Terms
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          Welcome to the CAMORENT Admin mobile application ("App"). These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("Administrator") and CAMORENT ("we", "us", or "our").
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          By accessing or using the CAMORENT Admin App, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not use the App.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          2. Description of Service
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          The CAMORENT Admin App is an administrative tool designed exclusively for authorized CAMORENT administrators to:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Manage camera equipment rental bookings
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Review and approve/reject booking requests
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Monitor ongoing and completed rentals
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Generate and send invoices to customers
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Communicate with customers regarding bookings
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          3. Eligibility and Authorization
        </Text>
        <Text style={[styles.subsectionTitle, { color: theme.text }]}>
          3.1 Administrator Status
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            The App is intended solely for authorized CAMORENT administrators
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You must be at least 18 years of age to use this App
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You must be officially designated as an administrator by CAMORENT management
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Unauthorized access or use of the App is strictly prohibited
          </Text>
        </View>

        <Text style={[styles.subsectionTitle, { color: theme.text }]}>
          3.2 Account Security
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You are responsible for maintaining the confidentiality of your login credentials
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You must not share your phone number, password, or access credentials with any third party
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You agree to immediately notify CAMORENT of any unauthorized access to your account
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          4. Prohibited Activities
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          You must NOT:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.error }]}>✗</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Use the App for any purpose other than CAMORENT business operations
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.error }]}>✗</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Access, collect, or use customer data for personal gain or unauthorized purposes
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.error }]}>✗</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Share customer information with unauthorized third parties
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.error }]}>✗</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Manipulate or falsify booking records, invoices, or payment information
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.error }]}>✗</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Attempt to reverse engineer, decompile, or extract source code from the App
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.error }]}>✗</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Circumvent any security features or access controls
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          5. Data Privacy and Protection
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          Your use of the App is also governed by our Privacy Policy. As an administrator, you agree to:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Handle all customer data in accordance with applicable data protection laws
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Maintain confidentiality of customer information
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Use customer data solely for legitimate business purposes
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Report any data breaches immediately to CAMORENT management
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          6. Booking Management Responsibilities
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You agree to review and process booking requests in a timely manner
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            All booking approvals, rejections, and status updates must be accurate
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You must verify equipment availability before approving bookings
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Customer service quality must be maintained at all times
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          7. Push Notifications
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          By using the App, you consent to receive push notifications for:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            New booking requests requiring review
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Booking status changes
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            System alerts and updates
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          8. Disclaimers and Limitations
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          The App is provided "as is" and "as available". CAMORENT makes no warranties regarding:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Uninterrupted, error-free, or secure access
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            The App's functionality, reliability, or suitability for any purpose
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            The accuracy or completeness of information displayed
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          9. Term and Termination
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          CAMORENT reserves the right to suspend or terminate your access to the App immediately, without notice, if:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You violate these Terms or our policies
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            Your employment or contractor relationship with CAMORENT ends
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            We determine that your access poses a security risk
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          10. Confidentiality
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          As an administrator, you may have access to confidential information including customer personal and financial information, business strategies, pricing structures, and proprietary systems.
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          You agree to maintain strict confidentiality of all information accessed through the App and not disclose it to unauthorized parties.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          11. Governing Law
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          12. Contact Information
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          If you have questions about these Terms and Conditions, please contact us:
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
          13. Acknowledgment
        </Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          By using the CAMORENT Admin App, you acknowledge that:
        </Text>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>✓</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You have read and understood these Terms and Conditions
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>✓</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You agree to be bound by these Terms
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>✓</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You have the authority to enter into this agreement
          </Text>
        </View>

        <View style={styles.listItem}>
          <Text style={[styles.bullet, { color: theme.primary }]}>✓</Text>
          <Text style={[styles.listText, { color: theme.text }]}>
            You will use the App in accordance with all applicable laws and regulations
          </Text>
        </View>

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

export default TermsScreen;
