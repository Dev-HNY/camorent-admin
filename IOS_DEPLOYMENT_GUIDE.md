# iOS App Store Deployment Guide - CAMORENT Admin

**Bundle ID**: `com.camorent.adminapp`
**App Store Connect ID**: `6758651394`
**Team ID**: `D5GU9XX6ZG`
**Apple ID**: `samg250@gmail.com`

---

## ✅ Configuration Complete

Your iOS configuration has been updated in:
- [app.json](app.json) - Bundle ID and App Store URL
- [eas.json](eas.json) - Apple credentials for automated submission

---

## Step 1: Add iOS Firebase Configuration (Optional but Recommended)

If you're using Firebase for iOS push notifications:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **camorent-admin-app**
3. Click the **iOS** icon to add iOS app
4. Enter Bundle ID: `com.camorent.adminapp`
5. Download `GoogleService-Info.plist`
6. Save it to: `e:\camorent-admin\GoogleService-Info.plist`
7. Add to app.json:
   ```json
   "ios": {
     "googleServicesFile": "./GoogleService-Info.plist",
     ...
   }
   ```

---

## Step 2: Build iOS App for App Store

### Option A: Build with EAS (Recommended)

```bash
# Navigate to project
cd e:\camorent-admin

# Build for iOS App Store
npx eas build --platform ios --profile production
```

**What happens:**
- EAS will ask you to log in (use Apple ID: `samg250@gmail.com`)
- It will generate iOS distribution certificates automatically
- Build takes ~15-20 minutes
- You'll get a download link for the `.ipa` file

### Option B: Build Locally (Advanced)

Only if you have a Mac with Xcode:

```bash
# Generate iOS project
npx expo prebuild --platform ios --clean

# Open in Xcode
open ios/camorentadmin.xcworkspace

# Build and archive in Xcode
```

---

## Step 3: Submit to App Store

### Automated Submission (After Build Completes)

```bash
# Submit the built IPA to App Store Connect
npx eas submit --platform ios --profile production
```

**What happens:**
- EAS uploads the IPA to App Store Connect
- App appears in TestFlight automatically
- Ready for App Store review

### Manual Submission (Alternative)

1. Download the `.ipa` from EAS build dashboard
2. Use **Transporter** app (Mac) or **Application Loader**
3. Upload to App Store Connect

---

## Step 4: Complete App Store Connect Setup

Before submitting for review:

### A. App Information

1. Go to [App Store Connect](https://appstoreconnect.apple.com) → **My Apps** → **CAMORENT Admin**
2. Fill in **App Information**:
   - **Privacy Policy URL**: Add your privacy policy link
   - **Category**: Business or Productivity
   - **Content Rights**: Check if app contains third-party content

### B. Pricing and Availability

1. Go to **Pricing and Availability**
2. Set **Price**: Free (or select price tier)
3. Select **Countries/Regions**: All or specific countries

### C. App Privacy

1. Go to **App Privacy**
2. Click **Get Started**
3. Answer questions about data collection:
   - Do you collect user data? (Yes - for booking management)
   - What data: Contact Info, Identifiers, Usage Data
   - How is data used: App Functionality, Analytics

### D. App Store Screenshots & Assets

**Required Assets:**

1. **App Icon** (1024x1024 PNG without alpha/transparency)
   - Upload at: **App Store** → **iOS App** → **App Information**

2. **iPhone Screenshots**:
   - **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 px (3-10 screenshots)
   - **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 px (3-10 screenshots)

3. **iPad Screenshots** (if supporting iPad):
   - **12.9" Display**: 2048 x 2732 px (3-10 screenshots)

**Tips for Screenshots:**
- Show key features: Dashboard, Booking Management, Notifications
- Use device frames for better presentation
- Add text overlays explaining features

### E. Version Information

1. Go to **App Store** → **Version 1.0**
2. Fill in:
   - **Screenshots**: Upload iPhone and iPad screenshots
   - **Promotional Text**: Short tagline (170 chars)
   - **Description**: Full app description
     ```
     CAMORENT Admin is the management dashboard for camera equipment rental businesses.

     Key Features:
     • Real-time booking notifications
     • Manage camera equipment inventory
     • Track rental bookings and customer details
     • Secure admin access
     • Push notifications for new requests

     Perfect for camera rental shop owners and administrators.
     ```
   - **Keywords**: `camera rental, admin, booking, equipment, business`
   - **Support URL**: Your support website
   - **Marketing URL**: (Optional) Your main website
   - **Version**: 1.0.0
   - **Copyright**: `© 2026 [Your Company Name]`

### F. Build Selection

1. In **Build** section, click **"+"**
2. Select the build you uploaded (Version 1.0, Build 1)
3. Provide **Export Compliance Information**:
   - Does your app use encryption? **No** (or Yes if using HTTPS - select standard encryption)

### G. Age Rating

1. Click **Edit** next to Age Rating
2. Answer questionnaire:
   - Most questions will be "None" or "No"
   - Result will likely be **4+**

### H. App Review Information

Fill in:
- **Contact Information**: Your name, phone, email
- **Demo Account**: If app requires login:
  - **Username**: demo admin account
  - **Password**: demo password
  - **Notes**: Explain how to use the app

### I. Version Release

Select when to release:
- **Automatically release** after approval
- **Manually release** (you control when)

---

## Step 5: Submit for Review

1. Click **Add for Review**
2. Click **Submit to App Review**
3. Wait for review (typically 24-48 hours)

---

## Common Build Issues & Solutions

### Issue 1: Missing Certificates

**Solution**: EAS will automatically generate distribution certificates. Just follow the prompts.

### Issue 2: Push Notification Entitlement

If you see errors about push notifications:

```bash
# Add to app.json
"ios": {
  "entitlements": {
    "aps-environment": "production"
  }
}
```

### Issue 3: Firebase Not Configured

If using Firebase, ensure `GoogleService-Info.plist` is present and referenced in app.json.

---

## Build Commands Reference

```bash
# Login to Expo
npx eas login

# Configure iOS credentials (run once)
npx eas credentials

# Build for App Store
npx eas build --platform ios --profile production

# Check build status
npx eas build:list --platform ios

# Submit to App Store
npx eas submit --platform ios --profile production

# Build both iOS and Android
npx eas build --platform all --profile production
```

---

## App Store Review Guidelines Checklist

Before submitting, ensure:

- [ ] App functions as described
- [ ] No crashes or major bugs
- [ ] All features work without developer account
- [ ] Privacy policy is accessible
- [ ] Screenshots accurately represent the app
- [ ] App icon is proper size (1024x1024)
- [ ] Contact information is correct
- [ ] Demo account credentials work (if required)
- [ ] App complies with Apple guidelines
- [ ] No placeholder content or "Lorem ipsum"

---

## Timeline

- **Build Time**: 15-20 minutes
- **Upload to App Store Connect**: 5-10 minutes
- **Processing**: 10-30 minutes
- **Review Time**: 24-48 hours (sometimes up to 7 days)
- **Total**: ~2-3 days from build to App Store

---

## Post-Approval

After approval:
1. App appears in App Store
2. Monitor reviews and ratings
3. Respond to user feedback
4. Plan updates and improvements

---

## Updating Your App

For future updates:

1. Update version in app.json:
   ```json
   "version": "1.1.0",
   "ios": {
     "buildNumber": "2"
   }
   ```

2. Build new version:
   ```bash
   npx eas build --platform ios --profile production
   ```

3. Submit update:
   ```bash
   npx eas submit --platform ios --profile production
   ```

4. Add "What's New" in App Store Connect

---

## Support Resources

- **EAS Documentation**: https://docs.expo.dev/eas/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Apple Developer**: https://developer.apple.com
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/

---

## Next Steps

1. ✅ Configuration is complete
2. 🔥 (Optional) Add `GoogleService-Info.plist` for Firebase
3. 🏗️ Run `npx eas build --platform ios --profile production`
4. 📱 Wait for build to complete (~15-20 min)
5. 🚀 Run `npx eas submit --platform ios --profile production`
6. 📝 Complete App Store Connect information
7. 🎯 Submit for review
8. ⏳ Wait for approval (24-48 hours)
9. 🎉 App goes live on App Store!

---

**Your iOS configuration is ready. You can now build and deploy to the App Store!** 🚀
