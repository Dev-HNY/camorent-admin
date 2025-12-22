# Quick Start Guide - CAMORENT Admin

## 🚀 5-Minute Setup

### Step 1: Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Verify installation: `node --version`

### Step 2: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- React Navigation
- All UI components

### Step 3: Start the App
```bash
npm start
```

You'll see a QR code and options to run on different platforms.

### Step 4: Choose Your Platform

#### Option A: Physical Device (Easiest)
1. Download **Expo Go** from App Store (iOS) or Google Play (Android)
2. Scan the QR code from your terminal
3. App will load on your device

#### Option B: iOS Simulator (Mac only)
1. Press `i` in the terminal
2. iOS Simulator will open automatically
3. App will load in the simulator

#### Option C: Android Emulator
1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Press `a` in the terminal
4. Emulator will open with the app

## 🎯 Testing the App

### Login Screen
- **Email**: Any email format (e.g., admin@camorent.com)
- **Password**: Any password
- Simply fill both fields to enable the Sign In button

### Main Features to Explore

1. **Requests Tab** (Default)
   - View 4 sample shoot requests
   - Try filtering by status
   - Click Approve/Decline buttons
   - Pull down to refresh

2. **Ongoing Shoots Tab**
   - See 3 active rentals
   - Check progress bars
   - Try Contact and Remind buttons
   - Note the days remaining indicators

3. **Past Shoots Tab**
   - Browse 5 completed shoots
   - View analytics at the top
   - Check client ratings
   - Try time filters

## 🔧 Common Issues & Solutions

### Issue: "Command not found: npm"
**Solution**: Node.js is not installed. Install from nodejs.org

### Issue: "Module not found" errors
**Solution**: Run `npm install` again

### Issue: QR code not scanning
**Solution**: 
1. Make sure your phone and computer are on the same WiFi network
2. Try restarting the dev server (`npm start`)

### Issue: App crashing on load
**Solution**: 
1. Clear Expo cache: `npm start -- --clear`
2. Restart your device/emulator

### Issue: Slow performance
**Solution**: This is normal in development mode. Production builds are much faster.

## 📱 Development Tips

### Hot Reload
- Changes to code automatically reload in the app
- Shake your device to open developer menu
- Press `r` in terminal to reload manually

### Debug Menu
- iOS: Cmd+D (simulator) or shake device
- Android: Cmd+M (emulator) or shake device

### Console Logs
- View logs directly in your terminal
- Or use React Native Debugger for more features

## 🎨 Customization

### Change Colors
Edit the color values in component StyleSheet sections:
```javascript
// Example: Change primary color
backgroundColor: '#FF6B35' // <- Replace with your color
```

### Modify Mock Data
Update the MOCK_* arrays in:
- `src/screens/RequestsScreen.js`
- `src/screens/OngoingShootsScreen.js`
- `src/screens/PastShootsScreen.js`

## 📞 Next Steps

1. Explore all three tabs
2. Interact with different buttons and cards
3. Try pull-to-refresh on each screen
4. Review the code structure
5. Prepare your API endpoints for integration

## 🔗 Useful Links

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/

---

**Need Help?** Check the main README.md for detailed information.
