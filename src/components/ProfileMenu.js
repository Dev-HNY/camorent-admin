import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ProfileMenu() {
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
    gap: 8,
    marginRight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
});

const createDynamicStyles = (theme) =>
  StyleSheet.create({
    greetingText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    menu: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      width: width - 32,
      maxWidth: 360,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    profileIconLarge: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: BRAND_COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    profileDetailText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    profileUsername: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.surfaceBorder,
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.inputBackground,
      marginBottom: 12,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    menuItemSubtext: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.textTertiary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.inputBackground,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 69, 58, 0.2)',
    },
    closeButton: {
      backgroundColor: BRAND_COLORS.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
