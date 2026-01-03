import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Plus, Settings, Gauge, HelpCircle, Download, AlertTriangle, Moon, Gamepad2, History, Network } from "lucide-react";

export function HelpView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Help & Guide</h2>
          <p className="text-muted-foreground text-sm">Complete documentation for FloofyBoost BETA - 1.3.3</p>
        </div>
      </div>

      <Tabs defaultValue="boost" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/5 border border-white/10 overflow-x-auto">
          <TabsTrigger value="boost">Boost Mode</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="boost" className="space-y-4 mt-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Boost Mode - Ultimate Performance
              </CardTitle>
              <CardDescription>System-wide gaming optimizations with real-time progress tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-1">How to Activate:</h4>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Navigate to Dashboard tab (default view)</li>
                    <li>Review enabled tweaks - click "BOOST TWEAKS" button to customize which optimizations to apply</li>
                    <li>Click the large purple "START BOOST" button in the main dashboard</li>
                    <li>Watch the progress bar as each tweak is applied sequentially</li>
                    <li>Receive confirmation when Boost Mode is fully activated</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">What Boost Mode Does:</h4>
                  <p className="text-muted-foreground mb-2">
                    Applies multiple system optimizations simultaneously to maximize gaming performance. Each enabled tweak targets specific bottlenecks:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">Disable Cortana</span> - Removes background Cortana processes, freeing RAM and CPU</li>
                    <li><span className="font-mono text-white">Stop Telemetry</span> - Disables Windows DiagTrack service to reduce background CPU usage</li>
                    <li><span className="font-mono text-white">Network Boost</span> - Modifies TCP settings for lower ping and reduced network latency</li>
                    <li><span className="font-mono text-white">RAM Flush</span> - Clears memory standby list to maximize available RAM</li>
                    <li><span className="font-mono text-white">Disable Game Bar</span> - Removes Xbox Game Bar overlay that can cause stuttering</li>
                    <li><span className="font-mono text-white">Fullscreen Optimizations</span> - Disables Windows fullscreen overlay for better input responsiveness</li>
                    <li><span className="font-mono text-white">Power Plan</span> - Forces CPU to maintain maximum frequency</li>
                    <li><span className="font-mono text-white">Hibernation Off</span> - Removes hibernation file to free SSD space and prevent sleep issues</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Deactivating Boost:</h4>
                  <p className="text-muted-foreground">
                    Click the "BOOST ACTIVE" button (displays when Boost is running) to disable Boost Mode. The system will revert all applied tweaks to previous settings automatically.
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <p className="text-xs text-yellow-300"><span className="font-bold">Tip:</span> Boost Mode works best when run before gaming sessions. All tweaks are safely reversible.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4 mt-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Game Profiles - One-Click Optimization
              </CardTitle>
              <CardDescription>Create and manage game-specific optimization profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-1">Create a New Profile:</h4>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>Click "NEW PROFILE" button in the Profiles tab</li>
                    <li>Enter game name (e.g., "Cyberpunk 2077", "Valorant", "Elden Ring")</li>
                    <li>Set main game executable name (e.g., "cyberpunk2077.exe", "valorant.exe")</li>
                    <li>Select CPU priority level: Realtime (maximum), High, AboveNormal, Normal, or Low</li>
                    <li>Optionally add sub-processes (launcher executables, anti-cheat, etc.)</li>
                    <li>Click "CREATE PROFILE" to save</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Using a Profile:</h4>
                  <p className="text-muted-foreground mb-2">
                    Click "OPTIMIZE & LAUNCH" on any profile card to immediately:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Apply the specified CPU priority to the game process</li>
                    <li>Automatically detect when the game launches (if Game Detection is enabled)</li>
                    <li>Adjust sub-process priorities as configured</li>
                    <li>Log all optimizations to the activity log</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Favorites System:</h4>
                  <p className="text-muted-foreground mb-2">
                    Click the star icon on any profile to mark as favorite. Favorites appear at the top for quick access. Maximum 7 profiles can be favorited.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Edit or Delete:</h4>
                  <p className="text-muted-foreground">
                    Click the gear icon to edit profile settings, or trash icon to delete. Changes are saved automatically and persist across sessions.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Profile Persistence:</h4>
                  <p className="text-muted-foreground">
                    All game profiles, tweaks, settings, and preferences are saved locally. Your configuration loads automatically when you restart the app - no need to reconfigure.
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                  <p className="text-xs text-blue-300"><span className="font-bold">Pro Tip:</span> Use priority levels strategically - "Realtime" for competitive games, "High" for balanced gaming, "Normal" for single-player.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4 mt-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Optimization Settings - Advanced Tweaks
              </CardTitle>
              <CardDescription>Configure system-level network and power settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-1">Global Boost Tweaks:</h4>
                  <p className="text-muted-foreground mb-2">
                    Use the toggles in the Optimization tab to enable/disable tweaks that will be applied when starting Boost Mode. Each toggle shows real-time activation/deactivation feedback.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Power Plan Selection:</h4>
                  <p className="text-muted-foreground mb-2">
                    Choose your system power profile:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">Ultimate Performance</span> - CPU runs at maximum frequency constantly (highest performance, higher power usage)</li>
                    <li><span className="font-mono text-white">High Performance</span> - Balanced approach, scales CPU frequency based on demand</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">MTU Size Configuration:</h4>
                  <p className="text-muted-foreground mb-2">
                    Adjust network MTU (Maximum Transmission Unit) size from 1400-1500 bytes. Lower values can reduce network latency in certain network conditions. Default (1500) is optimal for most users.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">DNS Configuration:</h4>
                  <p className="text-muted-foreground mb-2">
                    Configure DNS settings for faster website loading and reduced latency:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">Automatic</span> - Use system default DNS (ISP provider)</li>
                    <li><span className="font-mono text-white">Custom DNS</span> - Enter a single custom DNS server</li>
                    <li><span className="font-mono text-white">Dual DNS</span> - Set primary and secondary DNS servers for fallback</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Recommended public DNS: Google (8.8.8.8), Cloudflare (1.1.1.1), Quad9 (9.9.9.9)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4 mt-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" /> System Health Monitoring - Real-Time Analytics
              </CardTitle>
              <CardDescription>Monitor your system performance with detailed component metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-1">Performance Metrics (7 Real-Time Graphs):</h4>
                  <p className="text-muted-foreground mb-2">
                    Interactive charts display your system's performance over selectable time ranges (30s, 1m, 2m, 5m, 10m, 15m, or Realtime):
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">CPU %</span> - Processor utilization (0-100%)</li>
                    <li><span className="font-mono text-white">GPU %</span> - Graphics card load (0-100%)</li>
                    <li><span className="font-mono text-white">RAM %</span> - Memory usage (0-100%)</li>
                    <li><span className="font-mono text-white">FPS</span> - Actual frame rate in frames (typically 120-200 FPS)</li>
                    <li><span className="font-mono text-white">Drives %</span> - Storage I/O activity (0-100%)</li>
                    <li><span className="font-mono text-white">PSU W</span> - Power consumption in watts (150-450W typical range)</li>
                    <li><span className="font-mono text-white">Internet %</span> - Network utilization (0-100%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Network Latency Monitor:</h4>
                  <p className="text-muted-foreground">
                    Real-time latency tracking shows your network ping in milliseconds (ms). Lower latency = faster response in online games. Displayed in the metrics alongside other performance indicators.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Component Detailed Monitoring:</h4>
                  <p className="text-muted-foreground mb-2">
                    Expandable cards show detailed stats for each component:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">CPU</span> - Load %, temperature (°C), voltage (V), clock speed (GHz)</li>
                    <li><span className="font-mono text-white">GPU</span> - Load %, temperature (°C), voltage (V), core/memory clock speeds (MHz)</li>
                    <li><span className="font-mono text-white">RAM</span> - Usage %, temperature (°C), voltage (V), speed (MHz)</li>
                    <li><span className="font-mono text-white">Storage</span> - Load %, temperature (°C), read/write speeds (MB/s)</li>
                    <li><span className="font-mono text-white">PSU</span> - Load %, temperature (°C), output voltage (V)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Optional Hardware Components:</h4>
                  <p className="text-muted-foreground mb-2">
                    Enable additional monitoring in Settings:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Secondary GPU (for multi-GPU systems)</li>
                    <li>Additional storage drives</li>
                    <li>NVMe controllers</li>
                    <li>CPU/case fans</li>
                    <li>Liquid cooling systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">System Information Display:</h4>
                  <p className="text-muted-foreground">
                    View your CPU model, core count, total RAM, system uptime, and platform information in the System Information panel.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Advanced Features - Power-User Tools
              </CardTitle>
              <CardDescription>Comprehensive feature set for serious gamers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Hardware Monitoring Export
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Export all performance data to analyze offline:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">CSV Export</span> - Tabular format compatible with Excel/Sheets for data analysis and graphing</li>
                    <li><span className="font-mono text-white">JSON Export</span> - Complete structured data including system info and component details</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Access export buttons in System Health tab to download your performance history.</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Temperature Warning System
                  </h4>
                  <p className="text-muted-foreground">
                    Automatic detection alerts you when any hardware component exceeds 80°C. Red warning modal displays component name and suggests reducing load or improving cooling.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <History className="w-4 h-4" /> Undo/Revert Logs
                  </h4>
                  <p className="text-muted-foreground">
                    Tracks all tweaks applied during each session with timestamps. Review what was changed and when to troubleshoot performance changes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Network className="w-4 h-4" /> Network Latency Monitoring
                  </h4>
                  <p className="text-muted-foreground">
                    Real-time ping/latency tracking integrated into performance graphs. Monitor your network connection quality for online gaming.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" /> Game Detection
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Enable in Settings (Advanced tab) to automatically apply game profiles when games launch. FloofyBoost detects running game processes and applies optimizations without manual intervention.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">Auto-Update Check</h4>
                  <p className="text-muted-foreground">
                    Enable in Settings to check for FloofyBoost updates on startup. Stay current with latest optimizations and features. Current version: BETA - 1.3.3.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Dark/Light Theme Toggle
                  </h4>
                  <p className="text-muted-foreground">
                    Switch between dark and light modes in Settings (Appearance & Theme section). Preference is saved automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Settings & Configuration - Customization
              </CardTitle>
              <CardDescription>Fine-tune FloofyBoost behavior to your preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white mb-1">Appearance & Theme:</h4>
                  <p className="text-muted-foreground">
                    <span className="font-mono text-white">Dark Mode Toggle</span> - Switch between dark (default, OLED-friendly) and light themes. Persists across sessions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">Application Settings:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">Start with Windows</span> - Automatically launch FloofyBoost on system boot</li>
                    <li><span className="font-mono text-white">Disable Animations</span> - Turn off UI animations for maximum performance on low-end systems</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">Game Optimization:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">In-Game FPS Counter</span> - Display real-time FPS overlay during gameplay</li>
                    <li><span className="font-mono text-white">Monitor Refresh Rate Sync</span> - Synchronize game frame rate with monitor refresh rate</li>
                    <li><span className="font-mono text-white">Network Optimization</span> - Optimize network stack for competitive gaming</li>
                    <li><span className="font-mono text-white">CPU Affinity</span> - Lock game threads to specific CPU cores</li>
                    <li><span className="font-mono text-white">RAM Cache</span> - Optimize memory access patterns</li>
                    <li><span className="font-mono text-white">Discord RPC</span> - Display currently playing game in Discord status</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">Advanced Settings:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li><span className="font-mono text-white">Auto-Update Check</span> - Automatically check for updates on startup</li>
                    <li><span className="font-mono text-white">Game Detection</span> - Auto-apply profiles when games launch</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">System Monitoring:</h4>
                  <p className="text-muted-foreground mb-2">
                    In System Health tab (Settings section), toggle monitoring for optional hardware components:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Secondary GPU monitoring</li>
                    <li>Additional storage drives</li>
                    <li>NVMe controllers</li>
                    <li>Fan speed sensors</li>
                    <li>Liquid cooling systems</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Use "SCAN FOR HARDWARE" button to auto-detect additional devices.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-base">Pro Tips for Maximum Performance</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✓ Create profiles for your most-played games and mark as favorites for instant access</p>
          <p>✓ Enable Boost Mode before gaming sessions for consistent frame rates and reduced latency</p>
          <p>✓ Monitor System Health regularly to identify performance bottlenecks in your hardware</p>
          <p>✓ Adjust power plans based on your power supply capabilities (Ultimate for high-end systems)</p>
          <p>✓ Close unnecessary background apps before boosting to free up more resources</p>
          <p>✓ Use Network Latency monitoring to diagnose connection issues during online gaming</p>
          <p>✓ Export performance data periodically to track hardware health trends over time</p>
          <p>✓ Enable Game Detection for seamless optimization when launching games</p>
          <p>✓ Check temperature warnings and ensure proper case cooling for sustained performance</p>
          <p>✓ Keep auto-update enabled to receive the latest optimizations and improvements</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-base">Troubleshooting & FAQ</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <div>
            <p className="text-white font-semibold mb-1">Q: Why is Boost Mode not applying tweaks?</p>
            <p>A: Ensure you have administrator privileges and at least one tweak is enabled. Check the Optimization tab to verify tweak settings.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Q: How do I revert tweaks?</p>
            <p>A: Click "BOOST ACTIVE" button to disable Boost Mode. All tweaks will be reverted automatically. Check Undo/Revert logs to see what was changed.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Q: Are the optimizations safe?</p>
            <p>A: Yes. All tweaks are non-permanent Windows configuration changes that can be reverted. FloofyBoost includes automatic rollback functionality.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Q: Why is my temperature warning triggering?</p>
            <p>A: Check case airflow, clean dust filters, and ensure fans are spinning properly. Consider running fewer processes or upgrading cooling solutions.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Q: How often should I revert tweaks?</p>
            <p>A: No need to revert regularly. Tweaks are safe for continuous use. Revert only when you want to troubleshoot or restore system to stock state.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Q: Can I use FloofyBoost with other gaming tools?</p>
            <p>A: Yes. FloofyBoost works alongside most gaming overlays, Discord, OBS, and other optimization software without conflicts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
