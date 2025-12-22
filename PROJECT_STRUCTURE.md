# Project Structure & Architecture

## 📁 Directory Structure

```
camorent-admin/
│
├── App.js                          # Main entry point, navigation setup
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── babel.config.js                 # Babel configuration
│
├── src/
│   ├── screens/                    # Main screen components
│   │   ├── LoginScreen.js         # Authentication screen
│   │   ├── RequestsScreen.js      # Shoot requests list
│   │   ├── OngoingShootsScreen.js # Active rentals
│   │   └── PastShootsScreen.js    # Completed rentals
│   │
│   └── components/                 # Reusable UI components
│       ├── ShootRequestCard.js    # Request card component
│       ├── OngoingShootCard.js    # Active shoot card
│       └── PastShootCard.js       # Past shoot card
│
└── assets/                         # Images, fonts, etc.
```

## 🏗️ Architecture Overview

### Component Hierarchy

```
App.js
├── NavigationContainer
    ├── LoginScreen (if not logged in)
    └── BottomTabNavigator (if logged in)
        ├── RequestsScreen
        │   └── ShootRequestCard (multiple)
        ├── OngoingShootsScreen
        │   └── OngoingShootCard (multiple)
        └── PastShootsScreen
            └── PastShootCard (multiple)
```

### State Management

**Current Implementation:**
- Local component state using React hooks (`useState`)
- Simple login state in App.js

**Recommended for Production:**
- **Context API**: For auth state and user data
- **Redux** or **Zustand**: For complex app-wide state
- **React Query**: For API data caching and sync

### Data Flow

```
Screen Component
    ↓
Fetch Data (API call)
    ↓
Update Local State
    ↓
Pass to Card Components
    ↓
Render UI
```

## 🔌 API Integration Guide

### 1. Create API Service

Create `src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-api.com/api';

export const api = {
  // Authentication
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Requests
  getRequests: async (token) => {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  approveRequest: async (requestId, token) => {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Ongoing Shoots
  getOngoingShoots: async (token) => {
    const response = await fetch(`${API_BASE_URL}/shoots/ongoing`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Past Shoots
  getPastShoots: async (token) => {
    const response = await fetch(`${API_BASE_URL}/shoots/past`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
};
```

### 2. Update LoginScreen

Replace mock login in `LoginScreen.js`:

```javascript
import { api } from '../services/api';

const handleLogin = async () => {
  try {
    const response = await api.login(email, password);
    if (response.token) {
      // Store token securely
      await SecureStore.setItemAsync('userToken', response.token);
      onLogin(response.token);
    }
  } catch (error) {
    Alert.alert('Error', 'Invalid credentials');
  }
};
```

### 3. Update Screen Components

Example for `RequestsScreen.js`:

```javascript
import { api } from '../services/api';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      // Get token from secure storage
      const userToken = await SecureStore.getItemAsync('userToken');
      setToken(userToken);
      
      const data = await api.getRequests(userToken);
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.approveRequest(requestId, token);
      loadRequests(); // Refresh list
    } catch (error) {
      Alert.alert('Error', 'Failed to approve request');
    }
  };

  // ... rest of component
}
```

## 🔐 Security Best Practices

### Token Storage
Use Expo SecureStore for sensitive data:

```javascript
import * as SecureStore from 'expo-secure-store';

// Save token
await SecureStore.setItemAsync('userToken', token);

// Get token
const token = await SecureStore.getItemAsync('userToken');

// Delete token (logout)
await SecureStore.deleteItemAsync('userToken');
```

### API Error Handling

```javascript
const apiCall = async () => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, logout user
        await SecureStore.deleteItemAsync('userToken');
        navigation.navigate('Login');
      }
      throw new Error('API Error');
    }
    
    return await response.json();
  } catch (error) {
    // Handle error appropriately
    console.error(error);
  }
};
```

## 🎯 Recommended Project Structure (Expanded)

For a production app, consider this structure:

```
src/
├── screens/           # Screen components
├── components/        # Reusable UI components
├── navigation/        # Navigation configuration
├── services/          # API and external services
│   ├── api.js
│   └── auth.js
├── hooks/             # Custom React hooks
│   ├── useAuth.js
│   └── useApi.js
├── context/           # React Context providers
│   ├── AuthContext.js
│   └── ThemeContext.js
├── utils/             # Helper functions
│   ├── formatters.js
│   └── validators.js
├── constants/         # App constants
│   ├── colors.js
│   └── config.js
└── types/             # TypeScript types (if using TS)
```

## 📱 Component Design Patterns

### Container/Presentation Pattern

**Container Component** (handles logic):
```javascript
function RequestsContainer() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <RequestsPresentation data={data} />;
}
```

**Presentation Component** (handles UI):
```javascript
function RequestsPresentation({ data }) {
  return (
    <View>
      {data.map(item => <RequestCard key={item.id} {...item} />)}
    </View>
  );
}
```

### Custom Hooks

Create reusable logic:

```javascript
// hooks/useRequests.js
export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchRequests = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchRequests();
  }, []);
  
  return { requests, loading, refetch: fetchRequests };
}

// Usage in component
function RequestsScreen() {
  const { requests, loading, refetch } = useRequests();
  // ...
}
```

## 🧪 Testing Approach

### Unit Tests
- Test individual components
- Test utility functions
- Test API service functions

### Integration Tests
- Test screen flows
- Test navigation
- Test state management

### E2E Tests
- Test complete user journeys
- Test critical paths (login, approve request, etc.)

## 🚀 Deployment

### Build for iOS
```bash
expo build:ios
```

### Build for Android
```bash
expo build:android
```

### Over-the-Air Updates
Use Expo Updates for instant app updates without app store review.

## 📈 Performance Optimization

1. **Memoization**: Use `React.memo` for expensive components
2. **Lazy Loading**: Load screens and components on demand
3. **Image Optimization**: Compress images, use appropriate formats
4. **List Virtualization**: Use `FlatList` instead of `ScrollView` for long lists
5. **API Response Caching**: Cache API responses to reduce network calls

## 🎨 Styling Best Practices

1. **Consistent Spacing**: Use multiples of 4 or 8 for spacing
2. **Color Constants**: Define colors in a separate file
3. **Responsive Design**: Use Dimensions API for dynamic sizing
4. **Dark Mode**: Support both light and dark themes
5. **Accessibility**: Ensure proper contrast ratios and touch targets

---

**This structure is designed to scale from a simple app to a complex production application.**
