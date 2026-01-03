import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

console.log("[STARTUP] Module loading started");

// CRITICAL: Write startup marker immediately
try {
  const appDataPath = path.join(process.env.APPDATA || "", "FloofyBoost");
  if (!fs.existsSync(appDataPath)) fs.mkdirSync(appDataPath, { recursive: true });
  fs.appendFileSync(path.join(appDataPath, "error.log"), `[${new Date().toISOString()}] APP STARTED - Initializing...\n`);
  console.log("[STARTUP] Error log initialized");
} catch (e) {
  console.error("CRITICAL: Could not initialize error.log", e);
}

// Placeholder - will be loaded later
let launchGame: any = () => {}, getSystemInfo: any = () => {}, getSystemMetrics: any = () => {}, applyGameOptimization: any = () => {}, applyBoostTweak: any = () => {}, applyNetworkSetting: any = () => {}, applyPowerPlan: any = () => {}, flushDnsCache: any = () => {}, loadProfiles: any = () => {}, saveProfiles: any = () => {}, loadTweaks: any = () => {}, saveTweaks: any = () => {};

// Setup error logging
let logPath: string;
const logError = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  console.error(logMessage);
  try {
    if (!logPath) {
      const appDataPath = path.join(process.env.APPDATA || "", "FloofyBoost");
      if (!fs.existsSync(appDataPath)) fs.mkdirSync(appDataPath, { recursive: true });
      logPath = path.join(appDataPath, "error.log");
    }
    fs.appendFileSync(logPath, logMessage);
  } catch (e) {
    console.error("Could not write to log file:", e);
  }
};

// Catch uncaught exceptions
process.on("uncaughtException", (error: any) => {
  logError(`UNCAUGHT EXCEPTION: ${error.message}\n${error.stack}`);
  process.exit(1);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | null = null;

const isDev = () => !app.isPackaged;

function getIconPath() {
  // Try multiple possible paths for the icon
  const possiblePaths = [
    path.join(__dirname, "../assets/logo.ico"),
    path.join(__dirname, "../../assets/logo.ico"),
    path.join(process.resourcesPath, "assets/logo.ico"),
  ];

  for (const iconPath of possiblePaths) {
    if (require("fs").existsSync(iconPath)) {
      return iconPath;
    }
  }
  return undefined; // No icon found, will use default
}

function createWindow() {
  try {
    logError("Creating window...");
    const iconPath = getIconPath();
    const windowConfig: any = {
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
        sandbox: true,
      },
    };

    if (iconPath) {
      windowConfig.icon = iconPath;
    }

    mainWindow = new BrowserWindow(windowConfig);
    logError("BrowserWindow created successfully");

    if (isDev()) {
      logError("Loading dev URL: http://localhost:5173");
      mainWindow.loadURL("http://localhost:5173");
      mainWindow.webContents.openDevTools();
    } else {
      // Try multiple possible paths for production
      const possiblePaths = [
        // Standard asar path when packaged
        path.join(__dirname, "../public/index.html"),
        // When app folder structure is different
        path.join(__dirname, "../../public/index.html"),
        path.join(__dirname, "../../../public/index.html"),
        // Absolute resources path variations
        path.join(process.resourcesPath, "app/dist/public/index.html"),
        path.join(process.resourcesPath, "app/public/index.html"),
        path.join(process.resourcesPath, "public/index.html"),
        path.join(process.resourcesPath, "../public/index.html"),
        // Direct dist paths
        path.join(__dirname, "dist/public/index.html"),
        path.join(__dirname, "../dist/public/index.html"),
      ];

      logError(`App paths - __dirname: ${__dirname}`);
      logError(`process.resourcesPath: ${process.resourcesPath}`);
      logError(`app.getAppPath(): ${app.getAppPath()}`);

      let foundPath: string | null = null;
      for (const p of possiblePaths) {
        try {
          if (fs.existsSync(p)) {
            foundPath = p;
            logError(`✓ FOUND HTML at: ${p}`);
            break;
          }
        } catch (e) {
          logError(`Error checking path ${p}: ${e}`);
        }
      }

      if (foundPath) {
        logError(`Loading file from: ${foundPath}`);
        mainWindow.loadFile(foundPath).catch((err: any) => {
          logError(`Failed to load file: ${err.message}`);
          // Fallback to inline error HTML
          const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head><title>FloofyBoost - Error</title></head>
            <body style="font-family: Arial; padding: 20px;">
              <h1>FloofyBoost - File Load Error</h1>
              <p><strong>Error:</strong> ${err.message}</p>
              <p><strong>Tried path:</strong> ${foundPath}</p>
              <p>Please share this information with support.</p>
            </body>
            </html>
          `;
          if (mainWindow) {
          mainWindow.loadURL(`data:text/html,${encodeURIComponent(errorHtml)}`);
        }
        });
      } else {
        // Show error with actual paths for debugging
        const errorHtml = `
          <!DOCTYPE html>
          <html>
          <head><title>FloofyBoost - Path Error</title></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1>FloofyBoost - Setup Issue</h1>
            <p><strong>Could not find index.html</strong></p>
            <p><strong>__dirname:</strong> ${__dirname}</p>
            <p><strong>process.resourcesPath:</strong> ${process.resourcesPath}</p>
            <p><strong>app.getAppPath():</strong> ${app.getAppPath()}</p>
            <h3>Paths checked:</h3>
            <ul>${possiblePaths.map(p => `<li>${p}</li>`).join("")}</ul>
            <p>Please share this information with support or reinstall the application.</p>
          </body>
          </html>
        `;
        logError(`Could not find index.html. Falling back to error HTML.`);
        if (mainWindow) {
          mainWindow.loadURL(`data:text/html,${encodeURIComponent(errorHtml)}`);
        }
      }
    }

    // Ensure window is visible
    mainWindow.once("ready-to-show", () => {
      mainWindow?.show();
      mainWindow?.focus();
      logError("Window shown and focused");
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });

    mainWindow.webContents.on("did-fail-load", () => {
      logError("Page failed to load");
    });

    createMenu();
  } catch (error: any) {
    logError(`Failed to create window: ${error.message}\n${error.stack}`);
    dialog.showErrorBox("Error", `Failed to start FloofyBoost:\n${error.message}`);
    process.exit(1);
  }
}

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [{ label: "Exit", click: () => app.quit() }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About FloofyBoost",
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: "info",
              title: "FloofyBoost",
              message: "FloofyBoost BETA - 1.7.3",
              detail: "Making your gaming experience floofier!",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);
}

ipcMain.handle("launch-game", async (event, gamePath: string) => {
  return await launchGame(gamePath);
});

ipcMain.handle("apply-optimization", async (event, processName: string, priority: string) => {
  return await applyGameOptimization(processName, priority);
});

ipcMain.handle("apply-boost-tweak", async (event, tweakId: string, enabled: boolean) => {
  return await applyBoostTweak(tweakId, enabled);
});

ipcMain.handle("apply-network-setting", async (event, mtuSize: number) => {
  return await applyNetworkSetting(mtuSize);
});

ipcMain.handle("apply-power-plan", async (event, plan: string) => {
  return await applyPowerPlan(plan);
});

ipcMain.handle("flush-dns-cache", async () => {
  return await flushDnsCache();
});

ipcMain.handle("get-system-info", async () => {
  return await getSystemInfo();
});

ipcMain.handle("get-system-metrics", async () => {
  return await getSystemMetrics();
});

ipcMain.handle("load-profiles", async () => {
  return await loadProfiles();
});

ipcMain.handle("save-profiles", async (event, profiles: any[]) => {
  return await saveProfiles(profiles);
});

ipcMain.handle("load-tweaks", async () => {
  return await loadTweaks();
});

ipcMain.handle("save-tweaks", async (event, tweaks: any[]) => {
  return await saveTweaks(tweaks);
});

let revertProgress = 0;
let isQuitting = false;

console.log("[STARTUP] Setting up app event handlers");

app.on("ready", () => {
  console.log("[STARTUP] App ready event triggered");
  logError("App ready - calling createWindow");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle app quit to trigger revert sequence
app.on("before-quit", (event) => {
  if (!isQuitting && mainWindow) {
    event.preventDefault();
    isQuitting = true;
    
    // Signal to renderer that app is closing
    mainWindow.webContents.send("app-closing-sequence", { progress: 0 });
    
    // Gradually update progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 20, 100);
      if (mainWindow) {
        mainWindow.webContents.send("app-closing-sequence", { progress });
      }
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        // Give animation time to complete
        setTimeout(() => {
          app.quit();
        }, 3000);
      }
    }, 200);
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
