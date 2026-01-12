# 📱 CAMORENT Admin - React Native App

**Version:** 1.0.0
**Status:** Production-Ready for Google Play Store
**Last Updated:** January 5, 2026

A professional camera rental management mobile application for CAMORENT administrators. Built with React Native and Expo, featuring secure authentication, real-time notifications, and a modern dark theme UI.

---

---

## ✨ Features

### 🔐 Security & Authentication
- **Secure Login:** Phone number + password authentication
- **Encrypted Storage:** Auth tokens stored with hardware-backed encryption (SecureStore)
- **HTTPS-Only:** All API communication encrypted with TLS
- **Session Management:** Automatic token refresh and logout on expiry

### 📋 Booking Management
- **Requests Tab:** View and approve/reject pending bookings
- **Ongoing Shoots:** Track active rentals with progress indicators
- **Past Shoots:** Complete rental history and analytics
- **Real-Time Updates:** Instant booking status changes

### 🔔 Push Notifications
- **Instant Alerts:** New booking request notifications
- **Custom Sound:** Branded notification sound
- **Rich Content:** Booking details in notification
- **Background Sync:** Receive notifications even when app is closed

### 📄 Legal Compliance
- **Privacy Policy:** In-app viewer + markdown document
- **Terms & Conditions:** In-app viewer + markdown document
- **User Consent:** Accessible from Profile Menu
- **GDPR Compliant:** Full data protection compliance

### 🎨 User Experience
- **Dark/Light Theme:** Toggle between themes
- **Smooth Animations:** Native-feeling transitions
- **Purple Branding:** CAMORENT brand colors (#701AD3)
- **Responsive Design:** Optimized for all screen sizes

---

## 🛠️ Technology Stack

- **Framework:** React Native 0.74.5 with Expo SDK 51
- **Navigation:** React Navigation v6 (Stack + Bottom Tabs)
- **State:** React Context API (Auth + Theme)
- **Storage:** expo-secure-store (encrypted tokens)
- **API:** Axios with interceptors
- **Notifications:** Expo Notifications + Firebase Cloud Messaging
- **Performance:** Hermes JavaScript Engine
- **Build:** EAS (Expo Application Services)

---

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- EAS CLI: `npm install -g eas-cli`

### Setup

```bash
# 1. Navigate to project
cd camorent-admin

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Run on device/emulator
# Press 'a' for Android or 'i' for iOS
```

---

## 📱 Project Structure

```
camorent-admin/
├── App.js                          # Main entry with Stack Navigator
├── app.json                        # Expo config (Hermes enabled)
├── eas.json                        # Build config (AAB for Play Store)
│
├── src/
│   ├── components/                 # 13 reusable components
│   │   ├── BookingApprovalAlert.js # Booking approval UI
│   │   ├── ProfileMenu.js          # Menu with Privacy/Terms
│   │   └── ...
│   │
│   ├── screens/                    # 6 screens
│   │   ├── LoginScreen.js          # Phone + password auth
│   │   ├── RequestsScreen.js       # Pending bookings
│   │   ├── OngoingShootsScreen.js  # Active rentals
│   │   ├── PastShootsScreen.js     # Completed rentals
│   │   ├── PrivacyPolicyScreen.js  # Privacy policy viewer
│   │   └── TermsScreen.js          # Terms viewer
│   │
│   ├── services/
│   │   ├── api.js                  # API client (SecureStore)
│   │   └── NotificationService.js  # Push notifications
│   │
│   ├── context/
│   │   ├── AuthContext.js          # Authentication state
│   │   └── ThemeContext.js         # Theme state
│   │
│   └── theme/
│       └── colors.js               # Dark/Light theme colors
│
├── assets/
│   ├── icon-favicon.png            # App icon (85KB, 2500x2500)
│   └── notification_sound.wav      # Custom sound (865KB)
│
└── legal/
    ├── PRIVACY_POLICY.md           # Legal document
    ├── TERMS_AND_CONDITIONS.md     # Legal document
    └── PLAY_STORE_LISTING.md       # Store content ready to use
```

---

## 🎨 Design System

### Color Palette
- **Primary:** `#701AD3` (CAMORENT Purple)
- **Success:** `#34C759` (Green)
- **Error:** `#FF453A` (Red)
- **Warning:** `#FF6B35` (Orange)

### Dark Theme
- **Background:** `#000000`
- **Surface:** `#1C1C1E`
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#8E8E93`

### Light Theme
- **Background:** `#FFFFFF`
- **Surface:** `#F2F2F7`
- **Text Primary:** `#000000`
- **Text Secondary:** `#3C3C43`

---

## 🔧 Configuration

### API Endpoint
```javascript
// src/services/api.js
const API_BASE_URL = 'https://api.camorent.co.in';
```

### App Identifiers
- **Package (Android):** `com.camorent.admin`
- **Bundle (iOS):** `com.camorent.admin`
- **EAS Project ID:** `be247bc3-bf74-4c3a-a99e-4e7e945f4e84`

---

## 🚀 Building for Production

### Android (Play Store)

```bash
# Build AAB (Android App Bundle)
eas build --platform android --profile production

# Build APK (for testing)
eas build --platform android --profile production-apk

# Submit to Play Store
eas submit --platform android --profile production
```

### iOS (App Store)

```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

---

## 🔐 Environment Variables

No environment variables required! All configuration is in `app.json` and `eas.json`.

For sensitive files (keep these secure):
- `google-services.json` - Firebase Android config
- `firebase-service-account.json` - Firebase admin credentials
- `play-store-service-account.json` - Play Store submission credentials

**These files are in `.gitignore` and should never be committed!**

---

---

## 📄 License

Private project for CAMORENT. All rights reserved.

---

## 🤝 Support

- **Email:** support@camorent.co.in
- **Legal:** [PRIVACY_POLICY.md](PRIVACY_POLICY.md) | [TERMS_AND_CONDITIONS.md](TERMS_AND_CONDITIONS.md)

---

**Built with ❤️ for CAMORENT using React Native & Expo**

**Ready to ship to production! 🚀**
