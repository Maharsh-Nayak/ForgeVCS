# ForgeVCS - npm Publishing Guide

## ✅ Package Preparation Complete

Your ForgeVCS package is now ready for npm publishing with automated CI/CD!

## 📋 What Was Set Up

### 1. **Module Exports** ✓
Created index files in:
- `Core-engine/repo/index.js` - Exports all repository functions
- `Core-engine/objects/index.js` - Exports object storage functions
- `Core-engine/index/index.js` - Exports index management functions
- `Core-engine/commit/index.js` - Exports commit functions

### 2. **package.json** ✓
Added:
- `main` field for default import
- `exports` field for subpath imports
- `description`, `keywords`, `author`, `license`
- `repository`, `bugs`, `homepage` URLs
- `engines` requirement (Node.js >= 16)

### 3. **.npmignore** ✓
Excludes test files and development artifacts from npm package

### 4. **GitHub Actions CI/CD** ✓
Created `.github/workflows/publish.yml` for automatic publishing

---

## 🚀 Publishing Steps

### Step 1: Update package.json Metadata

Edit `package.json` and replace placeholders:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/ForgeVCS.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/ForgeVCS/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/ForgeVCS#readme"
}
```

### Step 2: Create npm Account (if you don't have one)

```bash
# Visit https://www.npmjs.com/signup
# Create your account
```

### Step 3: Login to npm from Terminal

```bash
npm login
# Enter your username, password, and email
```

### Step 4: Create npm Access Token (for GitHub Actions)

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Classic Token"
3. Select "Automation" type
4. Copy the token (starts with `npm_...`)

### Step 5: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click "Add secret"

### Step 6: Test Package Locally

```bash
# See what will be published
npm pack --dry-run

# Create actual tarball for testing
npm pack

# Test installation locally
npm install -g ./forgevcs-1.0.0.tgz

# Verify CLI works
forge --help

# Uninstall test version
npm uninstall -g forgevcs
```

### Step 7: Publish First Version Manually

```bash
# Make sure you're logged in
npm whoami

# Publish to npm
npm publish --access public

# Your package is now live at:
# https://www.npmjs.com/package/forgevcs
```

### Step 8: Set Up Automated Publishing

For future releases, use version tags to trigger automatic publishing:

```bash
# Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
# OR
npm version minor  # 1.0.0 → 1.1.0
# OR
npm version major  # 1.0.0 → 2.0.0

# Push the version tag to GitHub
git push origin main --tags

# GitHub Actions will automatically:
# 1. Detect the new tag
# 2. Run tests (if any)
# 3. Publish to npm
```

---

## 📦 Using Your Published Package

### As a CLI Tool

```bash
npm install -g forgevcs
forge init
forge add file.txt
forge commit "Initial commit"
```

### As a Library

```bash
npm install forgevcs
```

```javascript
import { initRepo, addRepo, commitRepo } from 'forgevcs/repo';
import { readObject } from 'forgevcs/objects';

await initRepo('./my-repo');
await addRepo('./my-repo', 'file.txt');
await commitRepo('./my-repo', 'Initial commit', 'John Doe');
```

---

## 🔄 CI/CD Workflow Details

The GitHub Actions workflow (`.github/workflows/publish.yml`) triggers on version tags:

**Trigger:**
- Push tags matching `v*.*.*` (e.g., `v1.0.0`, `v1.2.3`)

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run tests if any exist
5. Publish to npm with provenance

**Security:**
- Uses npm provenance for supply chain security
- Requires `NPM_TOKEN` secret in GitHub

---

## 🛠️ Version Management Best Practices

### Semantic Versioning

Follow [semver](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards-compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

### Release Workflow

```bash
# 1. Make your changes
git add .
git commit -m "Add new feature"

# 2. Update version
npm version minor  # Creates git tag automatically

# 3. Push to GitHub
git push origin main --tags

# 4. GitHub Actions publishes to npm automatically
```

---

## 📊 Monitoring Releases

### Check npm Package

- Package page: https://www.npmjs.com/package/forgevcs
- Download stats: https://npmjs.com/package/forgevcs
- Version history: Check "Versions" tab

### Check GitHub Actions

- Go to: https://github.com/YOUR_USERNAME/ForgeVCS/actions
- See workflow runs and logs
- Verify successful publishing

---

## 🐛 Troubleshooting

### "Package name already taken"

Change the name in `package.json`:
```json
{
  "name": "@YOUR_USERNAME/forgevcs"
}
```

Then publish as scoped package:
```bash
npm publish --access public
```

### "No permission to publish"

Make sure you're logged in:
```bash
npm whoami
npm login
```

### GitHub Actions failing

1. Check `NPM_TOKEN` secret is set correctly
2. Verify token has "Automation" permissions
3. Check workflow logs in Actions tab

### Test without publishing

```bash
# Install from local directory
cd /path/to/github-clone-project
npm install ../ForgeVCS

# Or use npm link for development
cd /ForgeVCS
npm link

cd /github-clone-project
npm link forgevcs
```

---

## ✨ Next Steps for GitHub Clone Project

1. **Create new GitHub clone project:**
   ```bash
   mkdir github-clone
   cd github-clone
   npm init -y
   ```

2. **Install ForgeVCS:**
   ```bash
   npm install forgevcs
   ```

3. **Create VCS service wrapper:**
   ```javascript
   // src/services/vcs-service.js
   import { initRepo, addRepo, commitRepo } from 'forgevcs/repo';
   
   export class VCSService {
     constructor(repoPath) {
       this.repoPath = repoPath;
     }
     // ... methods
   }
   ```

4. **Build Express backend with VCS integration**

---

## 📝 Additional Resources

- npm Documentation: https://docs.npmjs.com/
- GitHub Actions: https://docs.github.com/actions
- Semantic Versioning: https://semver.org/
- npm Provenance: https://docs.npmjs.com/generating-provenance-statements
