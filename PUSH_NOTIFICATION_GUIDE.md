# Push Notification Integration Guide

## Overview
This guide explains how to send push notifications to the CAMORENT Admin app that will display properly even when the app is closed, on lock screen, with sound alerts.

## Backend Integration

### Sending Notifications via Expo Push API

When sending notifications from your backend to the admin app, use the following format:

```json
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json

{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "sound": "default",
  "title": "New Booking Request",
  "body": "Customer Name requested a shoot",
  "data": {
    "type": "booking_request",
    "booking_id": "123456",
    "customer_name": "John Doe",
    "shoot_name": "Wedding Photography",
    "total_amount": 50000,
    "rental_days": 3
  },
  "priority": "high",
  "channelId": "booking_requests",
  "badge": 1
}
```

### Important Fields for Lock Screen & Closed App

1. **priority**: Must be set to `"high"` for immediate delivery
2. **sound**: Set to `"default"` for the device's default notification sound
3. **channelId**: Use `"booking_requests"` to match the configured channel
4. **badge**: Number to show on app icon

### Android-Specific Configuration

For Android devices, ensure:
- `priority` is `"high"` - delivers even when app is closed
- `channelId` matches one of: `"booking_requests"` or `"default"`
- `sound` is included for audible alerts

### iOS-Specific Configuration

For iOS devices (future support):
- `sound` field enables audio
- `badge` updates app icon badge count
- Critical alerts require special entitlements

## Notification Channels

The app has two pre-configured channels:

### 1. booking_requests (Recommended)
- **Importance**: MAX
- **Sound**: Default system sound
- **Vibration**: [0, 250, 250, 250]
- **LED Light**: Orange (#FF6B35)
- **Lock Screen**: PUBLIC (shows content)
- **Badge**: Enabled

### 2. default
- **Importance**: MAX
- **Sound**: Default system sound
- **Vibration**: [0, 250, 250, 250]
- **LED Light**: Orange (#FF6B35)
- **Lock Screen**: PUBLIC
- **Badge**: Enabled

## Testing Notifications

### Test with Expo Push Tool
Use the Expo push notification tool to test:
https://expo.dev/notifications

### Backend Test Payload

```javascript
const message = {
  to: pushToken,
  sound: 'default',
  title: 'Test Notification',
  body: 'This is a test notification',
  data: {
    type: 'booking_request',
    booking_id: 'test123'
  },
  priority: 'high',
  channelId: 'booking_requests'
};

// Send via Expo Push API
await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(message)
});
```

## Permissions Required

The app requests these Android permissions:
- `POST_NOTIFICATIONS` - Show notifications (Android 13+)
- `RECEIVE_BOOT_COMPLETED` - Receive notifications after device restart
- `VIBRATE` - Vibrate on notification
- `WAKE_LOCK` - Wake device when notification arrives
- `USE_FULL_SCREEN_INTENT` - Show full-screen alerts (optional)

## Notification Behavior

### When App is Open
- Notification banner shows at top
- Sound plays
- Custom in-app alert displayed for booking requests

### When App is Closed
- Full notification shows in status bar
- Sound plays
- Vibration occurs
- LED light blinks (if device supports)

### On Lock Screen
- Notification content is visible
- Sound plays
- Device wakes up
- User can tap to open app

## Token Management

### Registering Device Token
The app automatically:
1. Requests notification permissions on login
2. Gets Expo Push Token
3. Sends token to backend via `POST /admin/users/device-token`

### Token Format
```json
{
  "device_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

### Backend Storage
- Store one token per admin user
- Update token when it changes
- Remove token on logout

## Troubleshooting

### Notifications not appearing when app closed
- Verify `priority: "high"` in payload
- Check backend is using correct push token
- Ensure device has internet connection

### No sound on notifications
- Verify `sound: "default"` is included
- Check device is not in silent/DND mode
- Ensure channelId is correct

### Not showing on lock screen
- Verify Android notification channel has PUBLIC visibility
- Check device lock screen settings allow notifications

### Token not updating
- Check `/admin/users/device-token` endpoint is working
- Verify user is logged in when registration occurs
- Check console logs for registration errors

## Best Practices

1. **Always include data payload** - Allows app to handle notification properly
2. **Use high priority** - Ensures delivery when app is closed
3. **Include sound** - Gets user's attention
4. **Keep title/body concise** - Better display on lock screen
5. **Update tokens** - Handle token updates when they change
6. **Test on real devices** - Push notifications don't work in emulators
