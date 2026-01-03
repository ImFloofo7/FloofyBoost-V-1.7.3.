import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  launchGame: (gamePath: string) => ipcRenderer.invoke("launch-game", gamePath),
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),
  getSystemMetrics: () => ipcRenderer.invoke("get-system-metrics"),
  applyOptimization: (processName: string, priority: string) =>
    ipcRenderer.invoke("apply-optimization", processName, priority),
  applyBoostTweak: (tweakId: string, enabled: boolean) =>
    ipcRenderer.invoke("apply-boost-tweak", tweakId, enabled),
  applyNetworkSetting: (mtuSize: number) =>
    ipcRenderer.invoke("apply-network-setting", mtuSize),
  applyPowerPlan: (plan: string) =>
    ipcRenderer.invoke("apply-power-plan", plan),
  flushDnsCache: () => ipcRenderer.invoke("flush-dns-cache"),
  loadProfiles: () => ipcRenderer.invoke("load-profiles"),
  saveProfiles: (profiles: any[]) => ipcRenderer.invoke("save-profiles", profiles),
  loadTweaks: () => ipcRenderer.invoke("load-tweaks"),
  saveTweaks: (tweaks: any[]) => ipcRenderer.invoke("save-tweaks", tweaks),
  exitApp: () => ipcRenderer.send("exit-app"),
  onAppClosing: (callback: (progress: number) => void) => {
    ipcRenderer.on("app-closing-sequence", (event, data) => {
      callback(data.progress);
    });
  },
});

declare global {
  interface Window {
    electronAPI?: {
      launchGame: (gamePath: string) => Promise<{ success: boolean; message: string }>;
      getSystemInfo: () => Promise<any>;
      getSystemMetrics: () => Promise<any>;
      applyOptimization: (processName: string, priority: string) => Promise<{ success: boolean; message: string }>;
      applyBoostTweak: (tweakId: string, enabled: boolean) => Promise<{ success: boolean; message: string }>;
      applyNetworkSetting: (mtuSize: number) => Promise<{ success: boolean; message: string }>;
      applyPowerPlan: (plan: string) => Promise<{ success: boolean; message: string }>;
      flushDnsCache: () => Promise<{ success: boolean; message: string }>;
      loadProfiles: () => Promise<any[]>;
      saveProfiles: (profiles: any[]) => Promise<{ success: boolean; message: string }>;
      loadTweaks: () => Promise<any[]>;
      saveTweaks: (tweaks: any[]) => Promise<{ success: boolean; message: string }>;
      exitApp: () => void;
      onAppClosing: (callback: (progress: number) => void) => void;
    };
  }
}
