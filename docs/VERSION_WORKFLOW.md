# Automated Version Badge Workflow

## ✅ Setup Complete

Your automated version badge system is now ready! Here's how it works:

## 🔄 How It Works

1. **Update Version**: Change the version in `VERSION` file
2. **Push to GitHub**: The GitHub Action triggers automatically
3. **Badge Updates**: README.md gets updated with new badge
4. **Auto-Commit**: Changes are committed back to the repository

## 📝 Usage

### Method 1: Using Make (if Python is available)
```bash
make version-update VERSION=1.0.3
git add .
git commit -m "Update version to 1.0.3"
git push origin main
```

### Method 2: Manual Update
```bash
# Edit VERSION file
echo "1.0.3" > VERSION

# Commit and push
git add VERSION
git commit -m "Update version to 1.0.3"
git push origin main
```

## 🧪 Testing

Run the test script to verify everything is working:
```bash
./test_version_workflow.sh
```

## 📍 What Gets Updated

When you update the version:

- ✅ **VERSION file**: Contains the new version number
- ✅ **README.md**: Badge automatically updates
- ✅ **API endpoints**: `/api/version`, `/api/health`, `/api/data`
- ✅ **Admin panel**: Shows new version
- ✅ **Dashboard**: Version displayed in footer

## 🔧 GitHub Action Details

**File**: `.github/workflows/update-version-badge.yml`

**Triggers**:
- Push to `VERSION` file on main/master branch
- Manual trigger via GitHub Actions tab

**What it does**:
1. Reads version from `VERSION` file
2. Updates badge in `README.md`
3. Commits and pushes changes

## 🎯 Result

Your GitHub repository will now show:
```
# PDashboard - Dashboard Fabril Modular

![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)
```

The badge will automatically update whenever you change the version! 🚀 