# 🔊 Custom Notification Sound Setup

## Option 1: Use Default System Sound (Recommended for Now)

The app is already configured to use the system's default notification sound with extended vibration. This works immediately without additional files.

## Option 2: Add Custom Sound File (Optional)

If you want a unique notification sound for Camorent:

### Step 1: Get/Create Sound File

**Requirements:**
- Format: `.wav` or `.mp3`
- Duration: 2-5 seconds (short and attention-grabbing)
- File size: < 500KB
- Sample rate: 44.1kHz recommended

**Where to get sounds:**
- Create custom: Use Audacity (free)
- Download free: https://notificationsounds.com/
- Professional: Hire on Fiverr ($5-20)

### Step 2: Add to Project

1. Save sound file as: `E:\camorent-admin\assets\notification_sound.wav`
2. The app.json is already configured to use this file

### Step 3: Rebuild APK

After adding the sound file:
```bash
cd E:\camorent-admin
eas build --platform android --profile production
```

---

## Current Configuration (Without Custom Sound)

Even without a custom sound file, your notifications will have:

✅ **Extended Vibration Pattern**
- Vibrates for 4 seconds (8 pulses)
- More noticeable than standard notifications

✅ **Brand Purple LED** (#701AD3)
- LED blinks purple on supported devices

✅ **MAX Importance**
- Loudest default sound
- Bypasses Do Not Disturb
- Shows on lock screen

✅ **Persistent Badge**
- Shows notification count on app icon

---

## Testing Current Setup

Test without custom sound file first:

```bash
cd e:\Camorent\camorent-backend-api
python test_push_notification.py
```

You should notice:
- Longer vibration (4 seconds vs 1 second)
- Purple LED blinking
- More urgent title "URGENT: New Booking Request!"
- Price and duration in subtitle

---

## Next Steps

1. **Test current setup** - Works now without sound file
2. **(Optional) Add custom sound** - If you want unique sound
3. **Build APK** - Includes all enhancements
4. **Install & test** - See the improvements

The extended vibration and MAX priority make a big difference even without a custom sound!
