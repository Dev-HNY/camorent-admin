# Changelog - CAMORENT Admin

## [1.0.0] - 2026-01-05

### Added
- **Legal Compliance**
  - Privacy Policy document and in-app viewer
  - Terms & Conditions document and in-app viewer
  - Legal screens accessible from Profile Menu
  - Navigation stack for Privacy Policy and Terms screens

- **Security Enhancements**
  - Migrated to `expo-secure-store` for encrypted token storage
  - Hardware-backed encryption for authentication tokens
  - Encrypted user data storage
  - Fallback to AsyncStorage for unsupported devices
  - Enhanced API security with secure credential management

- **Performance Optimizations**
  - Enabled Hermes JavaScript engine
  - Configured AAB (Android App Bundle) builds for Play Store
  - Production build optimizations
  - Removed debug features from production

- **Store Readiness**
  - Complete Google Play Store listing content
  - Store descriptions, metadata, and keywords
  - Build configuration for Play Store submission
  - Comprehensive deployment documentation

### Changed
- Updated `package.json` with new dependencies:
  - `expo-secure-store@~13.0.2`
  - `@react-navigation/stack@^6.3.20`
- Updated `app.json`:
  - Enabled Hermes engine
  - Added Play Store metadata
  - Improved app description
  - Added iOS usage descriptions
- Updated `eas.json`:
  - Configured AAB builds for production
  - Added production-apk profile for testing
  - Added environment variables for production
- Updated navigation structure with Stack Navigator
- Enhanced Profile Menu with legal document links

### Removed
- **Debug Components:**
  - NotificationDebugger component
  - "Test Notifications" menu item from Profile Menu
  - networkDebug.js utility file

- **Development Files:**
  - DESIGN_PREVIEW.html (design preview)
  - convert-icon.js (icon conversion script)
  - assets/icon-converted.png
  - assets/icon.webp.backup
  - assets/icon.webp
  - assets/icon-black.webp

- **Outdated Documentation:**
  - BUILD_COMMAND.md
  - CUSTOM_NOTIFICATION_SOUND_SETUP.md
  - ENHANCED_NOTIFICATIONS_SUMMARY.md
  - INTEGRATION_SUMMARY.md
  - NOTIFICATION_SETUP_COMPLETE.md
  - PUSH_NOTIFICATION_GUIDE.md
  - PROJECT_STRUCTURE.md

### Fixed
- Theme context error in PrivacyPolicyScreen
- Theme context error in TermsScreen
- Proper theme usage with `getTheme()` function

### Documentation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[PLAY_STORE_LISTING.md](PLAY_STORE_LISTING.md)** - Store listing content
- **[STORE_READINESS_SUMMARY.md](STORE_READINESS_SUMMARY.md)** - Readiness checklist
- **[QUICK_START.md](QUICK_START.md)** - 5-step launch guide
- **[PRIVACY_POLICY.md](PRIVACY_POLICY.md)** - Privacy policy
- **[TERMS_AND_CONDITIONS.md](TERMS_AND_CONDITIONS.md)** - Terms of service

### Security
- All authentication tokens now use hardware-backed encryption
- User data encrypted at rest
- Android backup disabled to prevent data extraction
- HTTPS-only API communication enforced

### Next Steps
1. Run `npm install` to install new dependencies
2. Host Privacy Policy and Terms online
3. Create store assets (icon, feature graphic, screenshots)
4. Set up Google Play Console account
5. Build AAB: `eas build --platform android --profile production`
6. Submit to Play Store: `eas submit --platform android --profile production`

---

**Version:** 1.0.0
**Build Type:** Android App Bundle (.aab)
**Target Platform:** Google Play Store
**Release Date:** Pending Play Store Approval
