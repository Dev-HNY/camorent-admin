import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';
import { responsive } from '../utils/responsive';
import { shadows } from '../theme/modernStyles';

const { width } = Dimensions.get('window');

export default function ProfileMenu() {
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const theme = getTheme(isDark);

  // Get admin details from user object
  const adminName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`.trim()
    : user?.phone_number || 'Admin';
  const adminPhone = user?.phone_number || '';
  const adminEmail = user?.email || '';
  const [showMenu, setShowMenu] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setShowMenu(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowMenu(false));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            handleClose();
            await logout();
          }
        }
      ]
    );
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <>
      <View style={styles.headerRight}>
        <Text style={dynamicStyles.greetingText}>Hi, {adminName}</Text>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          <Ionicons name="person-circle" size={32} color={BRAND_COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              dynamicStyles.menu,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
                opacity: scaleAnim,
              },
            ]}
          >
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={dynamicStyles.profileIconLarge}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={dynamicStyles.profileName}>{adminName}</Text>
                {adminPhone && (
                  <View style={styles.profileDetail}>
                    <Ionicons name="call" size={14} color={theme.textTertiary} />
                    <Text style={dynamicStyles.profileDetailText}>{adminPhone}</Text>
                  </View>
                )}
                {adminEmail && (
                  <View style={styles.profileDetail}>
                    <Ionicons name="mail" size={14} color={theme.textTertiary} />
                    <Text style={dynamicStyles.profileDetailText}>{adminEmail}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={dynamicStyles.divider} />

            {/* Theme Toggle */}
            <TouchableOpacity
              style={dynamicStyles.menuItem}
              onPress={() => {
                toggleTheme();
                handleClose();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[dynamicStyles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255, 204, 0, 0.15)' : 'rgba(112, 26, 211, 0.15)' }]}>
                  <Ionicons
                    name={isDark ? "sunny" : "moon"}
                    size={20}
                    color={isDark ? "#FFCC00" : BRAND_COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={dynamicStyles.menuItemText}>Theme</Text>
                  <Text style={dynamicStyles.menuItemSubtext}>
                    {isDark ? 'Switch to Light' : 'Switch to Dark'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={dynamicStyles.menuItem}
              onPress={() => {
                handleClose();
                navigation.navigate('PrivacyPolicy');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[dynamicStyles.menuIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.15)' }]}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#007AFF"
                  />
                </View>
                <View>
                  <Text style={dynamicStyles.menuItemText}>Privacy Policy</Text>
                  <Text style={dynamicStyles.menuItemSubtext}>
                    Data protection & privacy
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={dynamicStyles.menuItem}
              onPress={() => {
                handleClose();
                navigation.navigate('Terms');
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[dynamicStyles.menuIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#34C759"
                  />
                </View>
                <View>
                  <Text style={dynamicStyles.menuItemText}>Terms & Conditions</Text>
                  <Text style={dynamicStyles.menuItemSubtext}>
                    Usage terms & policies
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={dynamicStyles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[dynamicStyles.menuIconContainer, { backgroundColor: 'rgba(255, 69, 58, 0.15)' }]}>
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color="#FF453A"
                  />
                </View>
                <View>
                  <Text style={[dynamicStyles.menuItemText, { color: '#FF453A' }]}>Logout</Text>
                  <Text style={dynamicStyles.menuItemSubtext}>
                    Sign out of your account
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={dynamicStyles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={dynamicStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.sm,
    marginRight: responsive.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: responsive.spacing.xxl + responsive.spacing.md,
    paddingRight: responsive.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.md,
    marginBottom: responsive.spacing.lg,
  },
  profileInfo: {
    flex: 1,
    gap: responsive.spacing.xs,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.xs,
    marginTop: responsive.spacing.xs,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.spacing.md,
    flex: 1,
  },
});

const createDynamicStyles = (theme) =>
  StyleSheet.create({
    greetingText: {
      fontSize: responsive.fontSize.md,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    menu: {
      backgroundColor: theme.surface,
      borderRadius: responsive.borderRadius.xl,
      padding: responsive.cardPadding,
      width: width - responsive.spacing.xl,
      maxWidth: 360,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      ...shadows.xl,
    },
    profileIconLarge: {
      width: responsive.iconSize.xxl + responsive.spacing.sm,
      height: responsive.iconSize.xxl + responsive.spacing.sm,
      borderRadius: responsive.borderRadius.xl,
      backgroundColor: BRAND_COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileName: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: responsive.spacing.xs,
    },
    profileDetailText: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    profileUsername: {
      fontSize: responsive.fontSize.md,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.surfaceBorder,
      marginBottom: responsive.spacing.lg,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: responsive.spacing.md,
      paddingHorizontal: responsive.spacing.md,
      borderRadius: responsive.borderRadius.md,
      backgroundColor: theme.inputBackground,
      marginBottom: responsive.spacing.md,
    },
    menuIconContainer: {
      width: responsive.iconSize.xl,
      height: responsive.iconSize.xl,
      borderRadius: responsive.borderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: responsive.spacing.xs,
    },
    menuItemSubtext: {
      fontSize: responsive.fontSize.sm,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: responsive.spacing.md,
      paddingHorizontal: responsive.spacing.md,
      borderRadius: responsive.borderRadius.md,
      backgroundColor: theme.inputBackground,
      marginBottom: responsive.spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 69, 58, 0.2)',
    },
    closeButton: {
      backgroundColor: BRAND_COLORS.primary,
      paddingVertical: responsive.spacing.md,
      borderRadius: responsive.borderRadius.md,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: responsive.fontSize.lg,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
