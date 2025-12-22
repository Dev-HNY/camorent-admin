# Build APK - Final Step

I've prepared everything for your APK build! The push notifications are now properly configured and will work in the standalone APK.

## What I've Fixed:

1. ✅ Enhanced push notification service with proper error handling
2. ✅ Added default notification channel for Android
3. ✅ Configured app.json with notification sounds
4. ✅ Verified Firebase configuration (google-services.json)
5. ✅ Set up EAS project (you're logged in as hemant6271)
6. ✅ Initialized Git repository

## Build Your APK Now:

Run this command in your terminal:

```bash
cd "e:\Camorent\camorent-admin\camorent-admin"
npx eas-cli build --platform android --profile preview
```

### What will happen:

1. EAS will ask if you want to generate a new Android Keystore → Select **Yes**
2. It will start building your APK in the cloud (takes 5-15 minutes)
3. When complete, you'll get a download link

### After the build completes:

1. You'll see a message like: "Build finished. Download: https://expo.dev/accounts/hemant6271/projects/..."
2. Click the link or visit: https://expo.dev/accounts/hemant6271/projects/camorent-admin/builds
3. Download the APK file
4. Transfer it to your Android phone
5. Install and test!

## Testing Push Notifications:

Once you install the APK:

1. Open the app and log in
2. The app will automatically register for push notifications
3. Check the console logs (if connected) or your backend to see the device token
4. Your backend at `api.camorent.co.in` can now send push notifications using the Expo Push Notification service

### Push Notification Format (for your backend):

```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "sound": "default",
  "title": "New Booking Request",
  "body": "Customer needs approval",
  "data": {
    "type": "booking_request",
    "booking_id": "12345",
    "customer_name": "John Doe",
    "shoot_name": "Wedding Shoot",
    "total_amount": 50000,
    "rental_days": 3
  },
  "channelId": "booking_requests"
}
```

Send this to: `https://exp.host/--/api/v2/push/send` with header `Content-Type: application/json`

## Alternative: Use Expo Dashboard

You can also start the build from the web:

1. Visit: https://expo.dev/accounts/hemant6271/projects/camorent-admin
2. Click "Builds" → "Create a build"
3. Select Android → Preview profile
4. Click "Build"

---

**Ready to build?** Run the command above and you'll have your APK in about 10-15 minutes!
