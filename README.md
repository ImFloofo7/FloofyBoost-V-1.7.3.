# FloofyBoost - Windows Gaming Optimization App

## 📋 Overview

FloofyBoost is a powerful Electron-based Windows desktop application for gaming optimization. It includes game profile management, real-time performance monitoring, system tweaks, and more.

**Version:** 1.7.3 (BETA)  
**Platform:** Windows (x64)

---

## 🚀 Thorough Installation Guide

Follow these steps carefully to set up FloofyBoost on your Windows machine.

### 1. Prerequisites
Ensure you have the following installed before starting:
- **Windows 10/11** (Required for native builds)
- **Node.js (v18 or higher)**: [Download](https://nodejs.org/)
- **Visual Studio Build Tools**: [Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
  - *Crucial for native dependencies.* During installation, select **"Desktop development with C++"**.

### 2. Setup the Project
1. **Download/Extract** the project folder to your preferred location.
2. **Open PowerShell** (Right-click "Start" -> Terminal/PowerShell).
3. **Navigate to the folder**:
   ```powershell
   cd "C:\Your\Path\To\FloofyBoostV2"
   ```
   *(Replace the path above with your actual folder location)*

### 3. Install Dependencies
Run the following command to install all necessary libraries:
```bash
# Correct command to install dependencies
npm install
```
*Note: Do NOT run `npm install electron-build`. The package you need is already in the project configuration. Just run `npm install`.*

**⚠️ IMPORTANT:** Do **NOT** run `npm audit fix --force`. This can automatically upgrade packages to incompatible versions and break the project's build configuration. If you see vulnerability warnings, they are typically for development tools and do not affect the final Windows application.

### 4. Build the Executable
To create the "FloofyBoost v1.7.3 BETA" application:
```bash
# Clean old files first
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Build the app
npm run electron-build
```

### 5. Run the App
After the build completes, open the `dist` folder. You will find:
- **`FloofyBoost Setup 1.7.3.exe`** (Installer)
- **`FloofyBoost-1.7.3.exe`** (Portable Version)

---

## ✨ Features Included

✅ **Game Profile Management** - Create, edit, delete, and favorite game profiles  
✅ **Boost Mode** - One-click performance optimization (START/STOP)  
✅ **Performance Monitoring** - 7 real-time metrics (CPU, GPU, RAM, FPS, etc.)  
✅ **Optimization Tweaks** - Apply system-level gaming optimizations  
✅ **System Health Tab** - Component monitoring with temperature warnings  
✅ **Undo/Revert Logs** - Track and revert all tweaks  

---

## 🔧 Troubleshooting (All Possible Fixes)

### `npm install` Issues
- **Error: `node-gyp` or `build error`**: Missing Visual Studio Build Tools. Install "Desktop development with C++" from the Prerequisites.
- **Error: `EACCES` or `Permission Denied`**: Run PowerShell as **Administrator**.
- **Error: `ERR_SOCKET_TIMEOUT`**: Slow internet. Run: `npm install --timeout=600000`.
- **Error: `Module not found`**: Corrupt `node_modules`. Run: `rm -r node_modules; rm package-lock.json; npm install`.
- **Error: `Missing Python`**: Some native modules need Python. Install Python 3.x and ensure "Add to PATH" is checked.

### `npm run build` / `electron-build` Issues
- **Error: `Missing script: electron-build`**: Run `npm pkg set scripts.electron-build="npm run build && electron-builder --win"`.
- **Error: `Cannot find module 'electron'`**: Run `npm install --save-dev electron electron-builder`.
- **Error: `JavaScript heap out of memory`**: PC low on RAM. Run: `$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run electron-build`.
- **Error: `Path too long`**: Windows 260-character limit. Move project to `C:\FloofyBoostV2`.
- **Error: `esbuild: command not found`**: Run `npm install -g esbuild`.
- **Error: `wine is required`**: You are trying to build for Windows on Linux/Mac without Wine. This project MUST be built on Windows for native support.

### Runtime Issues (After opening the EXE)
- **App shows in Task Manager but no window appears**: 
  1. End all FloofyBoost tasks.
  2. Delete `%APPDATA%\FloofyBoost` folder.
  3. Restart the app.
- **White Screen on launch**: Frontend build failed. Run `npm run build` and check for errors before running the electron-build again.
- **Tweaks not applying**: Ensure you are running the app as **Administrator**. Some tweaks require Registry access.
- **Installer hangs at 99%**: Antivirus is likely scanning the final executable. Disable real-time protection temporarily or use the Portable version.
- **Error opening file for writing**: The app is already running. Close all FloofyBoost processes and try again.

---

## 🗑️ Uninstall Guide

To completely remove FloofyBoost from your system:

### 1. Standard Uninstall
1. Open **Settings** on your Windows machine.
2. Go to **Apps** > **Installed Apps**.
3. Search for **FloofyBoost**.
4. Click the three dots and select **Uninstall**.
5. Follow the prompts to remove the application.

### 2. Manual Cleanup (Optional but Recommended)
To ensure no leftover configuration files remain:
1. Press `Win + R`, type `%appdata%`, and delete the `FloofyBoost` folder.
2. Press `Win + R`, type `%localappdata%`, and delete any `FloofyBoost` folder if present.
3. Check `C:\Program Files` or `C:\Program Files (x86)` and delete the `FloofyBoost` directory if it still exists.

---

## 🔄 Reinstall Guide (If App Won't Start)

If you're having issues with the app not launching or a corrupt installation, follow these steps for a clean reinstall:

### 1. Perform a Full Uninstall
Follow the **Uninstall Guide** above to completely remove the app and its data folders (`%appdata%`). This is the most important step to fix corrupt settings.

### 2. Clean Folders
Ensure the installation directories are empty:
*   `C:\Program Files\FloofyBoost`
*   `C:\Program Files (x86)\FloofyBoost`

### 3. Fresh Rebuild & Install
1. Follow the **Installation & Setup** section at the top of this guide.
2. Run `npm install` followed by `npm run electron-build`.
3. Use the new installer in the `dist/` folder.

---

### 7. Antivirus & SmartScreen
- **SmartScreen**: Since the app is unsigned, Windows will show "Windows protected your PC". Click **"More info"** and then **"Run anyway"**.
- **Antivirus**: If your antivirus blocks the build or the app, add the project folder and the `dist` folder to your **Exclusions/Whitelist**. This is common for custom Electron apps.
- **Build Flags**: The current build command includes `-c.win.forceCodeSigning=false` to ensure the build doesn't fail due to missing certificates.

---

If you encounter any other errors or malfunctions, please contact **"imfloof"** on discord or post an issue on the GitHub.

**FloofyBoost v1.7.3 (BETA)** - *Optimize. Play. Win.* 🎮
