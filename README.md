# CAMORENT Admin - React Native App

A professional camera rental management mobile application for administrators. Built with React Native and Expo, featuring a modern dark theme UI with smooth animations and purple brand identity.

## 🎯 Features

### Authentication
- **Secure Admin Login**: Email and password authentication with elegant UI
- Beautiful gradient backgrounds and smooth transitions
- Input validation and focus states

### Dashboard Screens

#### 1. Requests Tab
- View all incoming rental requests
- Filter by status (All, Pending, Reviewing)
- Priority indicators (High, Medium, Low)
- Quick approve/decline actions
- Equipment details and shoot information
- Pull-to-refresh functionality

#### 2. Ongoing Shoots Tab
- Track active rentals in real-time
- Visual progress indicators
- Days remaining countdown
- Equipment tracking
- Quick contact and reminder options
- Due date alerts

#### 3. Past Shoots Tab
- Complete rental history
- Performance analytics (total shoots, revenue, ratings)
- Client ratings with star displays
- Time-based filtering (All Time, This Week, This Month)
- Revenue tracking
- Equipment usage history

## 🎨 Design Features

- **Modern Dark Theme**: Professional dark UI optimized for readability
- **Purple Brand Identity**: Vibrant purple (#701AD3) gradient accents matching CAMORENT branding
- **Card-Based Design**: Clean, organized information display
- **Smooth Animations**: Native-feeling transitions and interactions
- **Status Indicators**: Color-coded badges for quick status identification
- **Responsive Layout**: Adapts to different screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed with dependencies)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Expo Go app on your physical device (optional)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd camorent-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your preferred platform:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📱 App Structure

```
camorent-admin/
├── App.js                          # Main app entry point with navigation
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js          # Admin authentication screen
│   │   ├── RequestsScreen.js       # Shoot requests management
│   │   ├── OngoingShootsScreen.js  # Active rentals tracking
│   │   └── PastShootsScreen.js     # Historical data and analytics
│   └── components/
│       ├── ShootRequestCard.js     # Request card component
│       ├── OngoingShootCard.js     # Ongoing shoot card with progress
│       └── PastShootCard.js        # Past shoot card with ratings
├── package.json
└── app.json
```

## 🔧 Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation library
  - Bottom Tab Navigator for main screens
- **Expo Linear Gradient**: Beautiful gradient effects
- **Expo Vector Icons**: Ionicons icon set
- **React Native Safe Area Context**: Safe area handling

## 🎨 Color Palette

- **Primary**: `#701AD3` (CAMORENT Purple)
- **Secondary**: `#34C759` (Green)
- **Accent**: `#8B3DE6` (Light Purple for gradients)
- **Background**: `#0A0A0A` to `#2C2C2E` (Dark gradients)
- **Cards**: `#1C1C1E` to `#232325`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#8E8E93`
- **Borders**: `#2C2C2E`, `#3A3A3C`

## 🔄 Current Status

### ✅ Implemented
- Complete UI/UX design for all screens
- Navigation structure with bottom tabs
- Mock data for demonstration
- Reusable card components
- Responsive layouts
- Pull-to-refresh functionality
- Filter and sort options
- Status indicators and progress tracking

### 🚧 Next Steps (API Integration)
- Connect to backend API endpoints
- Implement real authentication
- Add real-time data updates
- Implement push notifications
- Add image upload functionality
- Connect payment processing
- Implement chat/messaging

## 📝 Mock Data

The app currently uses static mock data to demonstrate functionality:
- 4 sample shoot requests with various priorities
- 3 ongoing shoots with different statuses
- 5 completed past shoots with ratings

Replace mock data in each screen file with actual API calls when ready.

## 🔐 Authentication

**Current Login (Static):**
- Any email and password combination will work
- Simply fill in both fields to enable the Sign In button

**For API Integration:**
- Replace the `handleLogin` function in `LoginScreen.js`
- Store authentication token securely
- Implement logout functionality
- Add password reset flow

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Equipment availability tracking
- [ ] Client communication system
- [ ] Revenue analytics dashboard
- [ ] Equipment maintenance logs
- [ ] Insurance verification
- [ ] Contract generation
- [ ] Payment tracking
- [ ] Multi-admin support
- [ ] Dark/Light theme toggle

## 📄 License

This is a private project for CAMORENT.

## 🤝 Contributing

This is an admin-only application. For questions or support, contact the development team.

---

**Built with ❤️ for CAMORENT using React Native & Expo**
