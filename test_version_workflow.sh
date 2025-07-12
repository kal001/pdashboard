#!/bin/bash

# Test script to simulate the GitHub Action workflow
echo "🧪 Testing Version Badge Workflow..."

# Read current version
CURRENT_VERSION=$(cat VERSION)
echo "📋 Current version: $CURRENT_VERSION"

# Create badge URL
BADGE_URL="https://img.shields.io/badge/version-$CURRENT_VERSION-blue.svg"
echo "🏷️  Badge URL: $BADGE_URL"

# Check if badge is in README
if grep -q "badge/version-$CURRENT_VERSION" README.md; then
    echo "✅ Badge is correctly set in README.md"
else
    echo "❌ Badge needs to be updated in README.md"
    echo "   Expected: badge/version-$CURRENT_VERSION"
    echo "   Found: $(grep -o 'badge/version-[^"]*' README.md)"
fi

echo ""
echo "🚀 When you push this to GitHub:"
echo "   1. GitHub Action will trigger automatically"
echo "   2. Badge will be updated to version $CURRENT_VERSION"
echo "   3. README.md will be committed with the new badge"
echo ""
echo "📝 To test the workflow:"
echo "   git add ."
echo "   git commit -m 'Update version to $CURRENT_VERSION'"
echo "   git push origin main" 