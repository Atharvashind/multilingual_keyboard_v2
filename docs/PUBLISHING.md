# Publishing to GitHub

## Step-by-Step Guide

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `multilanguage-keyboard`
3. Description: `A versatile virtual keyboard supporting English, Hindi, Marathi, Telugu, Tamil, and Bengali`
4. Choose Public visibility
5. Don't initialize with README (we have our own)
6. Click "Create repository"

### 2. Upload Files

#### Option A: Command Line (Recommended)

```bash
# Navigate to the repository folder
cd multilanguage-keyboard-repo

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial release: v1.0.0 - 6 language support"

# Add remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/multilanguage-keyboard.git

# Push
git push -u origin main
```

#### Option B: GitHub Web Interface

1. Click "uploading an existing file"
2. Drag and drop all files from `multilanguage-keyboard-repo` folder
3. Commit message: "Initial release v1.0.0"
4. Click "Commit changes"

### 3. Create a Release

1. Go to repository page
2. Click "Releases" on right sidebar
3. Click "Create a new release"
4. Tag version: `v1.0.0`
5. Release title: "Version 1.0.0 - Initial Release"
6. Description:
   ```markdown
   ## 🎉 First Release

   MultiLanguage Keyboard v1.0.0 is here!

   ### ✨ Features
   - 6 Languages: English, Hindi, Marathi, Telugu, Tamil, Bengali
   - Zero dependencies
   - Mobile responsive
   - Accessible (ARIA support)
   - Text-to-speech

   ### 📦 Files
   - `dist/keyboard.js` - Production ready bundled file
   - `src/` - Source code
   - `examples/` - React, Vue, Vanilla examples

   ### 🚀 Quick Start
   ```html
   <script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/multilanguage-keyboard@v1.0.0/dist/keyboard.js"></script>
   ```
   ```
7. Click "Publish release"

### 4. Enable GitHub Pages (Optional - for demo)

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Click "Save"
5. Your demo will be at: `https://YOUR_USERNAME.github.io/multilanguage-keyboard/`

### 5. Submit to npm (Optional)

```bash
# Make sure you have npm account
npm login

# Update version in package.json if needed

# Publish
npm publish
```

### 6. Add Badges to README

Replace `YOUR_USERNAME` and `REPO_NAME` in these markdown badges:

```markdown
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Size](https://img.shields.io/badge/size-15KB-brightgreen.svg)

[Demo](https://YOUR_USERNAME.github.io/multilanguage-keyboard/)
```

### 7. CDN Links (After Release)

Once published, users can use:

#### jsDelivr (Recommended)
```html
<!-- Latest -->
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/multilanguage-keyboard@latest/dist/keyboard.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/multilanguage-keyboard@v1.0.0/dist/keyboard.js"></script>
```

#### unpkg (If published to npm)
```html
<script src="https://unpkg.com/multilanguage-keyboard@latest/dist/keyboard.js"></script>
```

### 8. Social Sharing

Share your keyboard on:
- Twitter/X: "Just released a free multilingual virtual keyboard supporting 6 Indian languages! 🌍⌨️"
- LinkedIn: Post in web development groups
- Reddit: r/webdev, r/javascript, r/opensource
- Hacker News: "Show HN: Multilingual Virtual Keyboard for Web"
- Dev.to: Write an article about it

Hashtags: `#javascript` `#accessibility` `#multilingual` `#opensource` `#webdev`

---

## Maintenance

### Updating the Keyboard

1. Make changes to `src/keyboard.js` or layouts
2. Update version in `package.json`
3. Update `CHANGELOG.md`
4. Build (if you have a build process)
5. Commit: `git commit -am "Fix: description of fix"`
6. Tag: `git tag v1.0.1`
7. Push: `git push origin main --tags`
8. Create new release on GitHub

### Adding New Languages

1. Create `src/layouts/LANGUAGE.js`
2. Update `dist/keyboard.js` to include the layout
3. Update README language table
4. Update examples
5. Test thoroughly
6. Release new version

---

## Troubleshooting

### Git push rejected

```bash
# Force push (careful!)
git push -f origin main

# Or pull first
git pull origin main --rebase
git push origin main
```

### Large file issues

If repo is too large:
```bash
# Remove node_modules from git history
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push origin main
```

### CDN not updating

jsDelivr caches files. To purge:
- Visit: `https://purge.jsdelivr.net/gh/YOUR_USERNAME/multilanguage-keyboard@version/dist/keyboard.js`
- Or use version-specific URLs instead of @latest
