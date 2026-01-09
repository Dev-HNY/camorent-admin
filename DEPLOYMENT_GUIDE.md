# CAMORENT Admin - Complete Deployment Guide

**Version:** 1.0.0
**Last Updated:** January 5, 2026
**Target Platform:** Google Play Store (Android)

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Security Hardening](#security-hardening)
4. [Build Configuration](#build-configuration)
5. [Play Store Preparation](#play-store-preparation)
6. [Building the App](#building-the-app)
7. [Play Store Submission](#play-store-submission)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Legal & Compliance
- [x] Privacy Policy created (`PRIVACY_POLICY.md`)
- [x] Terms & Conditions created (`TERMS_AND_CONDITIONS.md`)
- [ ] Privacy Policy hosted online (required URL)
- [ ] Terms & Conditions hosted online (required URL)
- [x] Privacy Policy screen added to app
- [x] Terms screen added to app
- [x] Legal links added to Profile Menu

### Security
- [x] Migrated from AsyncStorage to SecureStore
- [x] HTTPS-only API communication
- [x] Token-based authentication implemented
- [x] Android `allowBackup: false` configured
- [x] Console.log statements present (remove for production - see below)
- [ ] Firebase credentials secured (`.gitignore` configured)
- [ ] Environment variables configured

### App Configuration
- [x] App name set to "CAMORENT Admin"
- [x] Package name: `com.camorent.admin`
- [x] Version: 1.0.0
- [x] Version code: 1
- [x] Hermes engine enabled
- [x] App description added
- [x] Icon configured
- [ ] 512x512 icon created for Play Store
- [ ] Feature graphic created (1024x500)
- [ ] Screenshots captured

### Build Configuration
- [x] EAS configured for AAB builds
- [x] Production build profile created
- [x] Expo plugins configured
- [x] Dependencies installed
- [ ] Dependencies updated to latest stable versions

### Testing
- [ ] App tested on physical Android device
- [ ] Login/logout flow tested
- [ ] Booking approval/rejection tested
- [ ] Push notifications tested
- [ ] Invoice features tested
- [ ] Dark/Light theme tested
- [ ] Privacy Policy/Terms screens tested

---

## 🛠️ Environment Setup

### 1. Install Required Tools

```bash
# Install Node.js (v18+ recommended)
# Download from https://nodejs.org/

# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

### 2. Install Project Dependencies

```bash
cd e:\camorent-admin

# Install all dependencies
npm install

# Install specific dependencies added for production
npm install expo-secure-store@~13.0.2
npm install @react-navigation/stack@^6.3.20
```

### 3. Login to Expo Account

```bash
# Login to your Expo account
eas login

# Verify login
eas whoami
# Should show: hemant-camo
```

---

## 🔒 Security Hardening

### 1. Remove Debug Console Logs

**Important:** Before production build, remove or disable console.log statements.

Create `babel.config.js` plugin (already exists, just update):

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove console.logs in production
      process.env.NODE_ENV === 'production' ? 'transform-remove-console' : undefined,
    ].filter(Boolean),
  };
};
```

Install the plugin:
```bash
npm install --save-dev babel-plugin-transform-remove-console
```

### 2. Secure Firebase Credentials

Ensure these files are in `.gitignore`:
```
google-services.json
firebase-service-account.json
play-store-service-account.json
.env
.env.local
```

Verify:
```bash
cat .gitignore
```

### 3. Environment Variables (Optional)

If you want to use different API endpoints for dev/prod:

Create `.env`:
```
API_BASE_URL=https://api.camorent.co.in
```

Update `src/services/api.js`:
```javascript
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.camorent.co.in';
```

Update `app.json`:
```json
"extra": {
  "apiUrl": process.env.API_BASE_URL,
  "eas": {
    "projectId": "be247bc3-bf74-4c3a-a99e-4e7e945f4e84"
  }
}
```

---

## 🔧 Build Configuration

### 1. Verify `app.json` Configuration

Check that all settings are correct:

```json
{
  "expo": {
    "name": "CAMORENT Admin",
    "version": "1.0.0",
    "android": {
      "package": "com.camorent.admin",
      "versionCode": 1,
      "jsEngine": "hermes",
      "allowBackup": false
    }
  }
}
```

### 2. Verify `eas.json` Configuration

Production profile should use AAB:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 3. Update Version Numbers (for future releases)

**For each new release:**
- Update `version` in `app.json` (e.g., "1.0.0" → "1.0.1")
- Update `versionCode` in `app.json` (e.g., 1 → 2)
- Must increment `versionCode` by at least 1 for each Play Store upload

---

## 📦 Play Store Preparation

### 1. Create Google Play Console Account

1. Go to https://play.google.com/console
2. Sign up (one-time fee: $25 USD)
3. Complete developer profile
4. Verify identity

### 2. Create App in Play Console

1. Click "Create App"
2. Enter details:
   - **App name:** CAMORENT Admin
   - **Default language:** English (US)
   - **App or Game:** App
   - **Free or Paid:** Free
3. Accept declarations
4. Click "Create app"

### 3. Complete Store Listing

Use content from `PLAY_STORE_LISTING.md`:

**App Details:**
- Short description (80 chars)
- Full description (4000 chars)
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (minimum 2)

**Categorization:**
- **Category:** Business
- **Tags:** business, productivity, rental management

**Contact Details:**
- **Email:** support@camorent.co.in
- **Phone:** [Your phone number]
- **Website:** https://camorent.co.in
- **Privacy Policy:** https://camorent.co.in/privacy-policy

### 4. Set Up Privacy Policy

**Option A: Host on Your Website**
```bash
# Upload PRIVACY_POLICY.md to your website
# URL: https://camorent.co.in/privacy-policy
```

**Option B: GitHub Pages** (Free)
1. Create a repository: `camorent-legal`
2. Add `PRIVACY_POLICY.md` as `index.md`
3. Enable GitHub Pages
4. URL will be: `https://your-username.github.io/camorent-legal/`

**Option C: Use Privacy Policy Generator**
- [Termly](https://termly.io)
- [PrivacyPolicies.com](https://www.privacypolicies.com)

### 5. Content Rating

Complete the questionnaire in Play Console:
- Select "Business" category
- Answer all questions (see `PLAY_STORE_LISTING.md` for answers)
- Expected rating: Everyone

### 6. Create Required Graphics

**App Icon (512x512):**
```bash
# Resize existing icon
# Use Photoshop, GIMP, or online tool like:
# https://www.iloveimg.com/resize-image

# Input: assets/icon-black.png
# Output: 512x512 PNG with transparency
```

**Feature Graphic (1024x500):**
- Use Canva, Figma, or Photoshop
- Include:
  - CAMORENT branding
  - "Admin Dashboard" text
  - Key feature icons (bookings, invoices, notifications)
  - Professional color scheme

**Screenshots:**
1. Install app on Android device/emulator
2. Navigate to each screen
3. Take screenshots (Ctrl+Shift+S on emulator)
4. Recommended screens:
   - Login screen
   - Pending requests
   - Booking details modal
   - Ongoing rentals
   - Profile menu
   - Privacy policy screen

---

## 🏗️ Building the App

### 1. Pre-Build Checks

```bash
# Ensure you're in the project directory
cd e:\camorent-admin

# Check for lint errors
npm run lint  # (if you have linting configured)

# Verify all dependencies are installed
npm install

# Check EAS configuration
eas config
```

### 2. Configure EAS Build

```bash
# Initialize EAS build (if not already done)
eas build:configure

# This creates/updates eas.json
```

### 3. Build for Production (AAB)

```bash
# Build Android App Bundle for Play Store
eas build --platform android --profile production

# You'll be asked to:
# 1. Generate a new Android Keystore (first time only)
# 2. Confirm build settings
# 3. Wait for build to complete (10-20 minutes)
```

**Build Output:**
- Build status: https://expo.dev/accounts/hemant-camo/projects/camorent-admin/builds
- Download `.aab` file when complete

### 4. Build APK for Testing (Optional)

```bash
# If you want to test locally before Play Store submission
eas build --platform android --profile production-apk

# This creates an installable APK file
```

### 5. Monitor Build Progress

```bash
# Check build status in terminal
# OR visit: https://expo.dev

# Download build when complete
```

---

## 🚀 Play Store Submission

### Method 1: Manual Upload (Recommended for First Release)

1. **Download AAB from EAS:**
   - Go to https://expo.dev
   - Navigate to your project → Builds
   - Download the `.aab` file

2. **Upload to Play Console:**
   - Go to Play Console → Your App
   - Production → Releases → Create new release
   - Upload the `.aab` file
   - Add release notes (see `PLAY_STORE_LISTING.md`)

3. **Review and Publish:**
   - Review all sections for completion
   - Submit for review
   - Wait for approval (1-7 days)

### Method 2: Automated Submission with EAS

1. **Create Service Account:**
   - Go to Google Play Console → Setup → API access
   - Create service account
   - Download JSON key file as `play-store-service-account.json`
   - Grant necessary permissions

2. **Configure EAS Submit:**
   ```bash
   # Ensure eas.json has submit configuration
   # (already configured in your eas.json)
   ```

3. **Submit to Play Store:**
   ```bash
   # After successful build
   eas submit --platform android --profile production

   # This will:
   # - Use the latest build
   # - Upload to Play Store
   # - Set to internal testing track
   # - Create as draft release
   ```

4. **Promote in Play Console:**
   - Go to Play Console
   - Review the draft release
   - Promote from Internal → Production
   - Submit for review

---

## 📊 Post-Deployment

### 1. Monitor Initial Release

**Play Console Dashboard:**
- Installs and uninstalls
- Crashes and ANRs (Application Not Responding)
- User ratings and reviews
- Pre-launch reports

**Firebase Console:**
- Push notification delivery
- Crashlytics (if configured)
- Performance monitoring

### 2. Respond to Reviews

- Set up email notifications for new reviews
- Respond to user feedback promptly
- Address critical issues quickly

### 3. Track Metrics

**Key Metrics to Monitor:**
- Install rate
- Crash-free rate (target: >99%)
- Daily active users
- Session duration
- Booking approval rate

### 4. Plan Updates

**Version Update Checklist:**
1. Increment version numbers
2. Update "What's New" section
3. Test thoroughly
4. Build new AAB
5. Upload to Play Store
6. Submit for review

---

## 🐛 Troubleshooting

### Build Failures

**Issue: "Module not found"**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: "Android build failed"**
```bash
# Check EAS build logs
eas build:list

# View specific build logs online
```

**Issue: "Keystore error"**
```bash
# Reset credentials
eas credentials

# Select: Android → Production → Remove keystore
# Then rebuild - EAS will generate new keystore
```

### Runtime Issues

**Issue: "App crashes on startup"**
- Check for missing dependencies
- Verify `expo-secure-store` is installed
- Check for console errors in development mode

**Issue: "Push notifications not working"**
- Verify `google-services.json` is correct
- Check Firebase console for configuration
- Test notification permissions

**Issue: "Login fails"**
- Verify API endpoint is correct
- Check network connectivity
- Verify backend is running and accessible

### Play Store Rejection Reasons

**Common Issues:**
1. **Missing Privacy Policy**
   - Solution: Host privacy policy online and add URL

2. **Misleading App Name**
   - Solution: Ensure name matches functionality

3. **Incomplete Store Listing**
   - Solution: Fill all required fields in Play Console

4. **Content Rating Mismatch**
   - Solution: Complete content rating questionnaire

5. **Target API Level Too Low**
   - Solution: Expo handles this automatically with latest SDK

---

## 📞 Support & Resources

### Documentation
- **Expo Docs:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **React Navigation:** https://reactnavigation.org/docs/getting-started

### Play Store Resources
- **Play Console Help:** https://support.google.com/googleplay/android-developer
- **Launch Checklist:** https://developer.android.com/distribute/best-practices/launch/launch-checklist
- **App Quality:** https://developer.android.com/quality

### Community
- **Expo Forums:** https://forums.expo.dev
- **Expo Discord:** https://chat.expo.dev
- **Stack Overflow:** Tag with `expo` and `react-native`

---

## 🔄 Version Update Process

### For Future Releases

1. **Update Code:**
   ```bash
   # Make your code changes
   # Test thoroughly
   ```

2. **Update Version:**
   ```javascript
   // app.json
   {
     "expo": {
       "version": "1.0.1",  // Increment
       "android": {
         "versionCode": 2    // Increment
       }
     }
   }
   ```

3. **Update Release Notes:**
   ```markdown
   # PLAY_STORE_LISTING.md
   ## What's New (v1.0.1)
   - Bug fixes and performance improvements
   - New feature XYZ
   ```

4. **Build:**
   ```bash
   eas build --platform android --profile production
   ```

5. **Submit:**
   ```bash
   eas submit --platform android --profile production
   # OR upload manually to Play Console
   ```

6. **Monitor:**
   - Watch for crashes
   - Monitor user feedback
   - Check install rates

---

## ✅ Final Pre-Launch Checklist

Before submitting to Play Store, verify:

- [ ] All dependencies installed (`npm install`)
- [ ] App tested on physical Android device
- [ ] Privacy Policy hosted online
- [ ] Terms & Conditions hosted online
- [ ] 512x512 app icon created
- [ ] 1024x500 feature graphic created
- [ ] Minimum 2 screenshots captured
- [ ] Store listing completed in Play Console
- [ ] Content rating completed
- [ ] App signed with upload key
- [ ] Version numbers correct (1.0.0, versionCode: 1)
- [ ] console.log statements removed (optional but recommended)
- [ ] Firebase credentials secured
- [ ] Test build installed and working
- [ ] Production AAB built successfully
- [ ] All app permissions justified

---

## 🎯 Success Criteria

Your app is ready when:

1. ✅ Build completes successfully on EAS
2. ✅ AAB file downloads without errors
3. ✅ Play Console shows "Ready to publish"
4. ✅ All store listing sections marked complete
5. ✅ App can be installed and runs on Android device
6. ✅ No critical crashes or errors
7. ✅ Privacy policy accessible online
8. ✅ All required screenshots uploaded

---

## 📝 Notes

- Keep this guide updated with each release
- Document any custom configurations
- Save all credentials securely (use password manager)
- Keep backup of signing keys
- Monitor app health after each release

---

**Deployment Guide Version:** 1.0
**App Version:** 1.0.0
**Target Platform:** Google Play Store
**Last Verified:** January 5, 2026

**For questions or issues, contact:** support@camorent.co.in
