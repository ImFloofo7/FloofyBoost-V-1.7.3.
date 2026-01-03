# FloofyBoost-V-1.7.3.
Work in progress game booster.

# FloofyBoost - Windows Gaming Optimization App

## 📋 Overview

FloofyBoost is a powerful Electron-based Windows desktop application for gaming optimization. It includes game profile management, real-time performance monitoring, system tweaks, and more.

**Version:** 1.7.3  
**Platform:** Windows (x64)

---

## 🚀 Prerequisites

Before building the EXE, ensure you have:

- **Windows 10/11** (for native build)
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
cd C:\Users\YourUsername\Desktop\FloofyBoostV2\GameBoostFixer
```

Or clone via Git:
```bash
git clone <repository-url>
cd FloofyBoostV2
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including Electron and electron-builder.

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

## 🔨 Build the Windows EXE

### Step 1: Clean Previous Builds

```bash
Remove-Item -Recurse -Force dist
```

### Step 2: Build the Application

```bash
npm run electron-build
```

This will:
1. Build the frontend (React + Vite)
2. Compile the backend
3. Download Electron runtime (~137 MB)
4. Create Windows EXE files

**Build Time:** 5-15 minutes (depending on system and internet speed)

### Step 3: Locate Your EXE Files

After the build completes, your executables will be in:
```
dist/
├── FloofyBoost Setup 1.7.3.exe    (Installer - recommended)
└── FloofyBoost-1.7.3.exe          (Portable)
```

---

## 💾 Installation & Running

### Option 1: Use the Installer (Recommended)

1. Run `FloofyBoost Setup 1.7.3.exe`
2. Follow the installation wizard
3. Choose installation directory
4. Creates Start Menu shortcuts and Desktop icon
5. Launch from Start Menu or Desktop

### Option 2: Use the Portable Version

1. Run `FloofyBoost-1.7.3.exe` directly
2. No installation required
3. Runs from anywhere

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

### Build Hangs or Freezes

If the build seems to hang on "bufferutil":
```bash
npm run build
electron-builder --win --skip-build
```

### Missing Icon

Ensure `assets/logo.ico` exists. If missing:
1. Create the `assets/` folder
2. Add your `.ico` icon file
3. Rebuild: `npm run electron-build`

### Build Fails with "index.js not found"

Update `package.json` to include:
```json
{
  "name": "floofyboost",
  "version": "1.7.3",
  "description": "Windows gaming optimization Electron app",
  "author": "FloofyBoost",
  "main": "dist/index.js",
  ...
}
```

### "Missing script" Error

Ensure your `package.json` scripts section has:
```json
"scripts": {
  "dev:client": "vite dev --port 5000",
  "build": "vite build && esbuild server/index-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js",
  "electron-build": "npm run build && electron-builder --win",
  "electron-builder": "electron-builder"
}
```

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
"version": "1.8.0"
```

2. Update `electron-builder.json` if needed

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

## ✅ Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Clean old builds
Remove-Item -Recurse -Force dist

# 3. Build Windows EXE
npm run electron-build

# 4. Find your EXE
# dist/FloofyBoost Setup 1.7.3.exe  (Installer)
# dist/FloofyBoost-1.7.3.exe        (Portable)

# 5. Run installer or portable version
```

---

**FloofyBoost v1.7.3** - Making your gaming experience floofier! 🎮
