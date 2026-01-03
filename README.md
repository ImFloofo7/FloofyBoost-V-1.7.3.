# FloofyBoost - Windows Gaming Optimization App

## 📋 Overview

FloofyBoost is a powerful Electron-based Windows desktop application for gaming optimization. It includes game profile management, real-time performance monitoring, system tweaks, and more.

**Version:** 1.7.3 (BETA)  
**Platform:** Windows (x64)

---

## ✅ Quick Start Summary

Get up and running in 5 minutes:

```bash
# 1. Install dependencies
npm install

# 2. Fix electron/electron-builder placement (if needed)
npm uninstall electron electron-builder
npm install --save-dev electron electron-builder

# 3. Add build script (if needed)
npm pkg set scripts.electron-build="npm run build && electron-builder --win"

# 4. Clean old builds
Remove-Item -Recurse -Force dist

# 5. Build Windows EXE
npm run electron-build

# 6. Find your EXE in dist/
# dist/FloofyBoost Setup 1.3.3.exe  (Installer)
# dist/FloofyBoost-1.3.3.exe        (Portable)

# 7. Run installer or portable version
```

**Build time:** 5-15 minutes on first build

---

## ✨ Features Included

✅ **Game Profile Management** - Create, edit, delete, and favorite game profiles  
✅ **Boost Mode** - One-click performance optimization (START/STOP)  
✅ **Performance Monitoring** - 7 real-time metrics:
  - CPU Usage
  - GPU Usage
  - RAM Usage
  - FPS (frames per second)
  - Drive Space
  - Power Supply (watts)
  - Network Quality & Latency

✅ **Optimization Tweaks** - Apply system-level gaming optimizations  
✅ **Settings Panel** - DNS configuration, power plans, MTU settings  
✅ **System Health Tab** - Real-time component monitoring with temperature warnings (80°C+)  
✅ **Dark/Light Theme Toggle** - Easy on the eyes  
✅ **Game Detection** - Auto-apply profiles when games launch  
✅ **Help & Guide** - 6-tab documentation with pro tips and FAQs  
✅ **Hardware Export** - Export system info as CSV/JSON  
✅ **Undo/Revert Logs** - Track and revert all tweaks  

---

## 🚀 Prerequisites

**Important:** You must build on a **Windows machine** (this repo is hosted on Linux, so you cannot build the Windows EXE here)

Before building the EXE, ensure you have:

- **Windows 10/11** (required for native build)
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version
npm --version
```

---

## 📥 Setup

### 1. Clone or Download the Project

If you have the project downloaded:
```bash
cd C:\Users\YourUsername\Desktop\FloofyBoost v1.7.3 BETA
```

Or clone via Git:
```bash
git clone <repository-url>
cd <name>
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including Electron and electron-builder.

---

## 🔨 Build the Windows EXE

### Step 1: Prepare Dependencies

Ensure electron and electron-builder are in devDependencies:

```bash
npm uninstall electron electron-builder
npm install --save-dev electron electron-builder
```

### Step 2: Add Build Script

If the `electron-build` script is missing:

```bash
npm pkg set scripts.electron-build="npm run build && electron-builder --win"
```

### Step 3: Clean Previous Builds

```bash
Remove-Item -Recurse -Force dist
```

### Step 4: Build the Application

```bash
npm run electron-build
```

This will:
1. Build the frontend (React + Vite)
2. Compile the backend
3. Download Electron runtime (~137 MB)
4. Create Windows EXE files

**Build Time:** 5-15 minutes (depending on system and internet speed)

### Step 5: Locate Your EXE Files

After the build completes, your executables will be in:
```
dist/
├── FloofyBoost Setup 1.3.3.exe    (Installer - recommended)
└── FloofyBoost-1.3.3.exe          (Portable)
```

---

## 💾 Installation & Running

### Option 1: Use the Portable Version (EASIEST)

**Recommended if you've had installation issues in the past:**

1. Find `FloofyBoost-1.3.3.exe` in the `dist/` folder
2. Double-click to run immediately
3. No installation needed
4. App launches within 3-5 seconds
5. Data saved to: `%APPDATA%\FloofyBoost\`

### Option 2: Use the Installer

1. Run `FloofyBoost Setup 1.3.3.exe`
2. Follow the installation wizard
3. Choose installation directory
4. Creates Start Menu shortcuts and Desktop icon
5. Launch from Start Menu or Desktop

**Note:** If you've installed before, see the **Reinstall** section below.

---

## 🔄 Reinstall (If App Won't Start or Installation Issues)

### Quick Fix (5 minutes)

If the app won't launch or you're having installation issues, follow these steps:

#### Step 1: Clean Uninstall

1. **Uninstall the old version:**
   - Settings → Apps → Installed apps
   - Find "FloofyBoost" and click Uninstall
   - Complete the uninstall

2. **Delete leftover files:**
   ```bash
   # Open File Explorer and delete:
   C:\Program Files\FloofyBoost         (if exists)
   C:\Program Files (x86)\FloofyBoost   (if exists)
   C:\Program Files (x86)\Floofy Boost  (if exists)
   ```

3. **Clear app data:**
   - Press `Win + R`, type: `%appdata%`
   - Delete `FloofyBoost` folder if present
   - Press `Win + R`, type: `%localappdata%`
   - Delete `FloofyBoost` folder if present

#### Step 2: Fresh Build

```bash
# On your Windows machine in PowerShell:

# 1. Navigate to project
cd C:\Users\YourUsername\Desktop\FloofyBoostV2

# 2. Clean old build
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# 3. Rebuild
npm run electron-build

# Build time: 5-15 minutes
```

#### Step 3: Install Fresh

- **Use Portable Version (RECOMMENDED):**
  - Run: `dist/FloofyBoost-1.3.3.exe`
  - No installation needed, launches immediately

- **Or Use Installer:**
  - Run: `dist/FloofyBoost Setup 1.3.3.exe`
  - Follow wizard (choose different folder than before if possible)

### Troubleshooting If App Still Won't Start

#### App appears in Task Manager but no window shows

**This means the app is running but the window isn't displaying.** Check the error log:

1. Open File Explorer
2. Type in address bar: `%APPDATA%\FloofyBoost\`
3. Look for `error.log` file
4. Read the errors and share them if you need help

#### File Lock Error During Installation

"error opening file for writing: ... uninstallericon.ico"

**Solution:**
1. Close all browser windows and file explorers
2. Restart your computer
3. Try portable version instead (no installation issues)

#### Installation Hangs or Freezes

**Solution:**
1. Wait 2-3 minutes for it to complete
2. If still frozen, cancel and use portable version
3. Or rebuild with: `npm run electron-build --timeout=900000`

---

## 🔧 Recent Fixes & Improvements (v1.3.3)

### What's Fixed

✅ **Window Now Displays** - Fixed hidden window issue; app now properly shows on screen  
✅ **Automatic Error Logging** - All errors logged to `%APPDATA%\FloofyBoost\error.log` for diagnostics  
✅ **Multiple Path Resolution** - App finds files even if build structure varies  
✅ **Server Startup Disabled in Electron** - No more port conflicts or server errors  
✅ **Electron App Starts Immediately** - Window shows within 3-5 seconds  

### Using the Error Log

If the app crashes or doesn't work properly:

1. Open: `%APPDATA%\FloofyBoost\error.log`
2. This file contains detailed error messages
3. Use these logs to diagnose issues or share for support

**Example error log location:**
```
C:\Users\Lukas\AppData\Local\FloofyBoost\error.log
```

---

## 🎨 Customize the App Icon (Optional)

### Step 1: Create Assets Folder

Create an `assets` folder in your project root if it doesn't exist:
```
FloofyBoostV2/
├── assets/
├── electron/
├── client/
└── package.json
```

### Step 2: Add Your Icon

Place your Windows icon file (`.ico` format) in the assets folder:
```
assets/logo.ico
```

**Need to create an .ico file?**
- Convert PNG/JPG to ICO: https://convertio.co/png-ico/
- Size: 256x256 pixels recommended
- Must be `.ico` format

### Step 3: Update Configuration

The icon is configured in `electron-builder.json` (line 16):
```json
"icon": "assets/logo.ico"
```

This is already set up, just ensure your `.ico` file is in place.

---

## 🔧 Available npm Commands

```bash
# Frontend development
npm run dev:client

# Build frontend & backend
npm run build

# Build EXE (Windows)
npm run electron-build

# Build with just electron-builder
npm run electron-builder -- --win

# Type checking
npm check
```

---

## 🐛 Troubleshooting

### npm install Issues

#### `ERR! code ERR_MODULE_NOT_FOUND` or `Cannot find module`

**Solution:**
```bash
rm -r node_modules
rm package-lock.json
npm install
```

#### `gyp ERR! build error` or `node-gyp not found`

This means you're missing Visual Studio Build Tools. Windows needs native compilation tools.

**Solution - Install Visual Studio Build Tools:**
1. Download: [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Run the installer
3. Select "Desktop development with C++"
4. Complete installation
5. Restart PowerShell/Command Prompt
6. Retry: `npm install`

#### `error ERR_SOCKET_TIMEOUT` during npm install

Network timeout - packages are taking too long to download.

**Solution:**
```bash
npm install --timeout=600000 --verbose
```

Or increase npm timeout:
```bash
npm config set fetch-timeout 600000
npm install
```

#### `EACCES: permission denied` errors

**Solution:**
Run PowerShell as Administrator, or:
```bash
npm install --unsafe-perm
```

#### Missing Python error during install

Some packages need Python.

**Solution:**
1. Install Python 3: [python.org](https://www.python.org/downloads/)
2. During install, check "Add Python to PATH"
3. Restart PowerShell
4. Retry: `npm install`

---

### npm run build Issues

#### `error TS2552: Cannot find name` (TypeScript errors)

**Solution:**
```bash
npm run check
```

This shows all TypeScript errors. Fix them before building, or:
```bash
npm run build -- --ignore-typescript-errors
```

#### `ERR! esbuild: command not found`

**Solution:**
```bash
npm install -g esbuild
npm run build
```

#### `ENOENT: no such file or directory` for frontend files

**Solution - Check file paths:**
1. Ensure `client/src/pages/` and `client/src/components/` exist
2. Run from project root directory
3. Clear build cache:
```bash
rm -r dist
npm run build
```

#### Build runs out of memory / `JavaScript heap out of memory`

Your system doesn't have enough RAM available.

**Solution:**
```bash
node --max-old-space-size=4096 node_modules/vite/bin/vite.js build
```

Or in package.json, modify the build script to:
```bash
"build": "NODE_OPTIONS=--max-old-space-size=4096 vite build && esbuild ..."
```

#### Path too long error (OneDrive/Desktop)

Windows has a 260-character path limit. OneDrive paths are long.

**Solution - Move project to shorter path:**
```bash
C:\FloofyBoostV2
```

Instead of:
```bash
C:\Users\Lukas\OneDrive\Desktop\FloofyBoostV2
```

Or enable long paths in Windows:
1. Open Group Policy Editor: `gpedit.msc`
2. Navigate to: Local Computer Policy > Computer Configuration > Administrative Templates > System > Filesystem
3. Enable "Enable Win32 long paths"
4. Restart PowerShell

---

### npm run electron-build Issues

#### `Missing script: electron-build` Error

**Solution - Option 1 (Easy):**
```bash
npm pkg set scripts.electron-build="npm run build && electron-builder --win"
npm run electron-build
```

**Solution - Option 2 (Manual):**
Add to `package.json` scripts section:
```json
"electron-build": "npm run build && electron-builder --win"
```

#### `Cannot find module 'electron'`

**Solution:**
```bash
npm install --save-dev electron
npm install --save-dev electron-builder
npm run electron-build
```

#### `Package "electron" is only allowed in "devDependencies"`

Electron must be in devDependencies, not dependencies.

**Solution:**
```bash
npm uninstall electron electron-builder
npm install --save-dev electron electron-builder
npm run electron-build
```

#### Build Hangs or Freezes

If stuck on "bufferutil", "node-gyp", or "electron download":

**Solution - Skip native rebuild:**
```bash
npm run build
npx electron-builder --win --skip-build
```

Or with timeout:
```bash
npm run electron-build --timeout=900000
```

#### `ENOENT: no such file or directory, open 'dist\index.js'`

The build hasn't completed or dist folder is missing.

**Solution:**
```bash
rm -r dist
npm run build
```

Verify `dist/` folder exists with files before running electron-builder.

#### `Error: Entitlements file (entitlements.mac.plist) not found`

Wrong platform configuration.

**Solution - Ensure you're building for Windows:**
```bash
npx electron-builder --win
```

Not `--mac` or `--linux`

#### Electron download fails / `ECONNREFUSED`

Network issue downloading Electron runtime.

**Solution:**
```bash
npm install --no-optional
npx electron-builder --win --publish=never
```

Or pre-cache Electron:
```bash
npx @electron/get
npm run electron-build
```

#### `NSIS installer not found` error

NSIS (installer builder) failed to download or install.

**Solution:**
```bash
npm install -g nsis
npm run electron-build
```

Or build portable only:
```bash
npx electron-builder --win portable
```

#### Build succeeds but .exe not created

Check if it's in the wrong location.

**Solution - Look in these locations:**
```bash
dist/           # Main output folder
dist/installers/
dist/win-unpacked/
```

If still missing, rebuild with verbose output:
```bash
npx electron-builder --win -p always
```

---

### Antivirus / Security Issues

#### Build blocked by Windows Defender or antivirus

Some security software blocks build tools.

**Solution:**
1. Temporarily disable antivirus during build
2. Or add project folder to antivirus whitelist:
   - Windows Defender > Virus & threat protection > Manage settings > Add exclusions
3. Retry build

---

### Post-Build Issues

#### EXE won't run / Crashes immediately

**Solution:**
1. Check app log: `%APPDATA%\FloofyBoost\logs.txt`
2. Run with terminal to see errors:
```bash
cd dist
FloofyBoost-1.3.3.exe
```
3. Check event viewer for crash details

#### Installer won't launch

**Solution:**
```bash
FloofyBoost Setup 1.3.3.exe /S  # Silent install
```

Or right-click > Run as Administrator

#### Missing Game Profiles / Settings Lost

Data stored at: `%APPDATA%\FloofyBoost\`

**Solution - Backup and restore:**
```bash
# Backup
copy %APPDATA%\FloofyBoost C:\Backup\FloofyBoost

# Restore
copy C:\Backup\FloofyBoost %APPDATA%\FloofyBoost
```

---

### npm Audit Warnings

#### `2 moderate severity vulnerabilities` warning

**Solution - These are usually safe to ignore, but to fix:**
```bash
npm audit fix
```

Only use `npm audit fix --force` if absolutely necessary (may break things).

---

### Clean Rebuild (Nuclear Option)

If everything is broken, do a complete clean rebuild:

```bash
# Delete everything
rm -r node_modules
rm -r dist
rm package-lock.json

# Reinstall from scratch
npm install

# Fix electron placement
npm uninstall electron electron-builder
npm install --save-dev electron electron-builder

# Add script if needed
npm pkg set scripts.electron-build="npm run build && electron-builder --win"

# Build
npm run electron-build
```

**Expected build time:** 10-15 minutes on first build

---

## 📦 Project Structure

```
FloofyBoostV2/
├── client/                 # React frontend
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # UI components
│       └── styles/        # CSS files
├── electron/              # Electron main process
│   ├── main.ts           # Main entry point
│   ├── preload.ts        # IPC preload
│   └── api.ts            # Native APIs
├── server/               # Backend (Node.js)
├── dist/                 # Build output
├── assets/               # App icon & resources
├── package.json          # Dependencies & scripts
├── electron-builder.json # EXE build config
└── vite.config.ts        # Vite build config
```

---

## 🚢 Distribution

### Creating Release Packages

The build automatically creates:
- **Setup Installer** - Full installation with uninstaller
- **Portable Executable** - Standalone, no installation needed

Both are production-ready and can be distributed to users.

### Code Signing (Optional)

For production releases, consider code signing to avoid security warnings:
1. Obtain a code signing certificate
2. Update `electron-builder.json` with signing credentials
3. Rebuild - will auto-sign EXE files

---

## 📝 Version Updates

To update the app version:

1. Edit `package.json`:
```json
"version": "1.3.3"
```

2. Update the GUI display version in `client/src/components/` if needed (shows as "BETA - 1.3.3")

3. Rebuild:
```bash
npm run electron-build
```

New EXE will be in `dist/` with updated version number.

---

## 📞 Support

For issues or feature requests:
1. Check the **Help & Guide** tab in the app
2. Review the FAQ section
3. Check troubleshooting above

---

**FloofyBoost v1.3.3 (BETA)** - Making your gaming experience floofier! 🎮
