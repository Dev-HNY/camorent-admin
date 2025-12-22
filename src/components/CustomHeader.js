import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme, BRAND_COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function CustomHeader({ title, adminName = "Sandeep" }) {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handleProfilePress = () => {
    setShowProfileMenu(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseMenu = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowProfileMenu(false));
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <>
      <View style={[dynamicStyles.header, styles.header]}>
        {/* Title */}
        <Text style={dynamicStyles.headerTitle}>{title}</Text>

        {/* Admin Info */}
        <View style={styles.adminSection}>
          <Text style={dynamicStyles.adminGreeting}>Hi, {adminName}</Text>
          <TouchableOpacity
            style={dynamicStyles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={32} color={BRAND_COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMenu}
        >
          <Animated.View
            style={[
              dynamicStyles.profileMenu,
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
                <Text style={dynamicStyles.profileUsername}>@{adminName.toLowerCase()}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={dynamicStyles.divider} />

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {/* Theme Toggle */}
              <TouchableOpacity
                style={dynamicStyles.menuItem}
                onPress={() => {
                  toggleTheme();
                  handleCloseMenu();
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
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={dynamicStyles.closeButton}
              onPress={handleCloseMenu}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  adminSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  menuItems: {
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
});

// Dynamic styles that change with theme
const createDynamicStyles = (theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.surface,
      borderBottomColor: theme.surfaceBorder,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    adminGreeting: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    profileButton: {
      padding: 4,
    },
    profileMenu: {
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
      marginBottom: 2,
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
      marginBottom: 8,
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
