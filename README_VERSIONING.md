# 🤖 Automatic Semantic Versioning - README

## 🎉 What's New?

Your project now has **FULLY AUTOMATIC semantic versioning**! No more manual version updates!

## 🚀 How to Use (Super Simple!)

### Step 1: Make Your Changes
```bash
# Edit your code
vim user-service/index.js
```

### Step 2: Commit with the Right Message

#### For Bug Fixes:
```bash
git add .
git commit -m "fix: Resolved login timeout issue"
git push origin main
```
**Result:** Version bumps from `1.0.0` → `1.0.1`

#### For New Features:
```bash
git add .
git commit -m "feat: Added user dashboard"
git push origin main
```
**Result:** Version bumps from `1.0.0` → `1.1.0`

#### For Breaking Changes:
```bash
git add .
git commit -m "breaking: Migrated to GraphQL API"
git push origin main
```
**Result:** Version bumps from `1.0.0` → `2.0.0`

### Step 3: That's It!
Jenkins automatically:
- ✅ Detects your commit message
- ✅ Bumps the version appropriately
- ✅ Updates the VERSION file
- ✅ Builds Docker images with new version
- ✅ Deploys to Kubernetes

## 📋 Commit Message Keywords

| Keyword | Version Change | Use When |
|---------|----------------|----------|
| `breaking:` | MAJOR (2.0.0) | API changes, removed features |
| `[major]` | MAJOR (2.0.0) | Breaking changes |
| `feat:` | MINOR (1.1.0) | New features added |
| `feature:` | MINOR (1.1.0) | New functionality |
| `[minor]` | MINOR (1.1.0) | Feature additions |
| `fix:` | PATCH (1.0.1) | Bug fixes |
| `bugfix:` | PATCH (1.0.1) | Bug fixes |
| `[patch]` | PATCH (1.0.1) | Small fixes |
| (no keyword) | PATCH (1.0.1) | Default behavior |

## 🏷️ Docker Tag Format

Each build creates a comprehensive tag:

```
v{MAJOR}.{MINOR}.{PATCH}-build{BUILD_NUMBER}-{GIT_COMMIT}
```

**Example:**
```
v1.2.3-build42-a1b2c3d
```

Where:
- `v1.2.3` = Semantic version (auto-generated)
- `build42` = Jenkins build number
- `a1b2c3d` = Git commit hash (for traceability)

## 📊 What Happens in Jenkins?

```
1. Checkout Code from GitHub
   ↓
2. Generate Semantic Version
   - Read VERSION file (current: 1.0.0)
   - Analyze commit message (found: "feat:")
   - Bump version (new: 1.1.0)
   - Create tag (v1.1.0-build123-a1b2c3d)
   ↓
3. Build Docker Images
   - Tag: v1.1.0-build123-a1b2c3d
   - Tag: latest
   ↓
4. Push to Docker Hub
   ↓
5. Load to kind Cluster
   ↓
6. Deploy to Kubernetes
   ↓
7. Verify Deployment
   ↓
8. Success! ✅
```

## 🔍 Check Current Version

```bash
# Method 1: Check VERSION file
cat VERSION

# Method 2: Check Jenkins logs
# Look for "NEW VERSION GENERATED" section

# Method 3: Check Docker images
docker images | grep pintaram369

# Method 4: Check Kubernetes
kubectl describe deployment user-service -n micro | grep Image
```

## 📚 Documentation

| File | Description |
|------|-------------|
| **`VERSIONING_QUICK_START.md`** | Quick reference guide |
| **`AUTOMATIC_VERSIONING_GUIDE.md`** | Complete detailed guide |
| **`DEPLOYMENT_SUMMARY.md`** | Deployment overview |
| **`JENKINS_DEPLOYMENT_GUIDE.md`** | Jenkins setup |
| **`VERSION`** | Current version (auto-updated) |

## ✅ Examples

### Example 1: Fix a Bug
```bash
# Current version: 1.0.0
git commit -m "fix: Corrected user validation"
git push

# Jenkins Output:
# 🟢 PATCH version bump detected (bug fix)
# Previous Version: 1.0.0
# New Version: 1.0.1
# Docker Tag: v1.0.1-build123-a1b2c3d
```

### Example 2: Add a Feature
```bash
# Current version: 1.0.1
git commit -m "feat: Added CSV export"
git push

# Jenkins Output:
# 🟡 MINOR version bump detected (new feature)
# Previous Version: 1.0.1
# New Version: 1.1.0
# Docker Tag: v1.1.0-build124-b2c3d4e
```

### Example 3: Breaking Change
```bash
# Current version: 1.1.0
git commit -m "breaking: Changed database schema"
git push

# Jenkins Output:
# 🔴 MAJOR version bump detected (breaking change)
# Previous Version: 1.1.0
# New Version: 2.0.0
# Docker Tag: v2.0.0-build125-c3d4e5f
```

## 🔄 Rollback

If you need to rollback to a previous version:

```bash
# Find the version you want (check Jenkins history or Docker Hub)

# Rollback user-service
kubectl set image deployment/user-service \
  user-service=pintaram369/user-service:v1.0.0-build120-abc123d \
  -n micro

# Verify
kubectl get pods -n micro
kubectl describe deployment user-service -n micro | grep Image
```

## 🎯 Best Practices

### ✅ DO:
- Use descriptive commit messages
- Use conventional commit format (`type: description`)
- One change type per commit
- Let Jenkins handle versioning

### ❌ DON'T:
- Don't manually edit VERSION file
- Don't use vague commit messages
- Don't mix multiple change types in one commit
- Don't manually update version in Jenkinsfile

## 🆘 Troubleshooting

### Version Not Bumping?
- Check commit message has correct keyword
- Verify VERSION file exists
- Check Jenkins logs

### Wrong Version Bump?
- Review commit message keywords
- Use explicit keywords: `[major]`, `[minor]`, `[patch]`

### Need Help?
1. Read `AUTOMATIC_VERSIONING_GUIDE.md`
2. Check Jenkins build logs
3. Review commit message keywords

## 🎓 Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│         AUTOMATIC VERSIONING CHEAT SHEET        │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔴 MAJOR (Breaking)    1.0.0 → 2.0.0          │
│     git commit -m "breaking: description"       │
│     git commit -m "[major] description"         │
│                                                 │
│  🟡 MINOR (Feature)     1.0.0 → 1.1.0          │
│     git commit -m "feat: description"           │
│     git commit -m "[minor] description"         │
│                                                 │
│  🟢 PATCH (Bug Fix)     1.0.0 → 1.0.1          │
│     git commit -m "fix: description"            │
│     git commit -m "[patch] description"         │
│                                                 │
│  ⚪ DEFAULT             1.0.0 → 1.0.1          │
│     git commit -m "any message"                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🎉 Summary

**You just need to remember:**

1. Write good commit messages with keywords
2. Push to GitHub
3. Jenkins does everything else automatically!

**No manual version updates ever again!** 🚀

---

**Happy Coding!** 💻

