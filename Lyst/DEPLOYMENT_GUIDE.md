# Deployment Guide for Lyst App

## Firebase Configuration Overview

Your app uses Firebase in two different contexts:

### 1. Frontend Firebase Config (`FirebaseConfig.ts`)

- **Purpose**: Client-side authentication and direct Firebase SDK operations
- **Security**: Uses public API keys (safe to expose in frontend)
- **Usage**: User login, signup, real-time features

### 2. Backend Firebase Config (`backend/config/firebase-config.ts`)

- **Purpose**: Server-side operations with elevated permissions
- **Security**: Uses service account (private, never expose)
- **Usage**: Token verification, admin operations

## Environment Variables Setup

### Frontend Environment Variables

Create a `.env` file in your frontend root:

```env
# Firebase Config (Public - Safe to expose)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend Host
EXPO_PUBLIC_HOST=your_backend_host.com
```

### Backend Environment Variables

Create a `.env` file in your backend root:

```env
PORT=3000
HOST=your_backend_host.com
NODE_ENV=production
```

## EAS Deployment Options

### Option 1: Web Hosting (Recommended for Testing)

For web deployment and sharing with testers:

#### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login to Expo

```bash
eas login
```

#### 3. Set Environment Variables for EAS

```bash
# Set environment variables for your project
eas env:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "your_api_key"
eas env:create --scope project --name EXPO_PUBLIC_AUTH_DOMAIN --value "your_auth_domain"
eas env:create --scope project --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "your_project_id"
eas env:create --scope project --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "your_storage_bucket"
eas env:create --scope project --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "your_sender_id"
eas env:create --scope project --name EXPO_PUBLIC_FIREBASE_APP_ID --value "your_app_id"
eas env:create --scope project --name EXPO_PUBLIC_HOST --value "your_backend_host.com"
```

#### 4. Deploy to Web

```bash
# Deploy to web hosting (creates a shareable URL)
eas update --branch production --message "Initial web deployment"
```

#### 5. Share with Testers

After deployment, you'll get a URL like:

```
https://expo.dev/@your-username/your-project-name
```

### Option 2: Development Builds (For Mobile Testing)

For creating test builds that you can send to testers:

#### 1. Configure EAS Build

```bash
eas build:configure
```

#### 2. Create Development Build

```bash
# For iOS testers
eas build --platform ios --profile development

# For Android testers
eas build --platform android --profile development
```

#### 3. Share Build with Testers

- iOS: Share the `.ipa` file or TestFlight link
- Android: Share the `.apk` file or Google Play internal testing

### Option 3: Production App Store Builds

For App Store and Google Play Store:

```bash
# iOS App Store
eas build --platform ios --profile production

# Android Google Play Store
eas build --platform android --profile production
```

## EAS Configuration

Update your `eas.json` for different build profiles:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_FIREBASE_API_KEY": "your_dev_api_key"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_FIREBASE_API_KEY": "your_staging_api_key"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_FIREBASE_API_KEY": "your_prod_api_key"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Quick Start for Testing

For immediate testing with testers:

1. **Deploy to web** (fastest option):

```bash
eas update --branch production --message "Test deployment"
```

2. **Share the URL** with your testers

3. **For mobile testing**, create development builds:

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

## Security Best Practices

### Frontend (Safe to expose)

- Firebase API keys are **public by design**
- They only identify your project, not grant access
- Firebase security rules protect your data

### Backend (Keep private)

- Service account JSON file
- Database credentials
- API secrets

### Environment Variables

- Use `EXPO_PUBLIC_` prefix for frontend variables
- Never commit `.env` files to git
- Use EAS environment variables for production deployment

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**: Ensure `EXPO_PUBLIC_` prefix
2. **Build failures**: Check all required environment variables are set
3. **Authentication errors**: Verify Firebase project configuration

### Debug Commands:

```bash
# Check environment variables
expo start --clear

# View EAS environment variables
eas env:list

# Test build locally
eas build --platform web --local
```
