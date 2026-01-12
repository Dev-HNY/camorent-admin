#!/bin/bash

# EAS Build Hook - Pre-install
# This script runs before the build process to configure Android build settings

echo "📦 Configuring Android build settings for production..."

# This will enable R8 minification and shrinking automatically
# Expo SDK 51+ uses R8 by default for production builds

echo "✅ Build configuration ready"
