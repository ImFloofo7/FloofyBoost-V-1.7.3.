import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Zap, Play, Settings, Gauge } from "lucide-react";

export function QuickStartGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4">
      <Card className="bg-[#1a1a1a] border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-white/5">
          <div>
            <CardTitle className="text-2xl font-display text-white">Welcome to FloofyBoost</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">First-Time Startup Guide (BETA - 1.7.3)</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">1</div>
              <div>
                <h3 className="font-bold text-white mb-1">Understand Boost Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Boost Mode applies system-wide gaming optimizations (disable Cortana, kill telemetry, flush RAM, etc.). All tweaks are reversible and safe.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">2</div>
              <div>
                <h3 className="font-bold text-white mb-1">Create Game Profiles (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Profiles tab → Click "NEW PROFILE" → Enter game name and main executable (e.g., "cyberpunk2077.exe"). Save with CPU priority level. Profiles auto-save and persist.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">3</div>
              <div>
                <h3 className="font-bold text-white mb-1">Customize Tweaks (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Optimization tab → Toggle tweaks on/off to customize what applies when you activate Boost. Changes are saved automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">4</div>
              <div>
                <h3 className="font-bold text-white mb-1">Start Boost Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Go to Dashboard tab → Click the large "START BOOST" button → Watch progress bar as tweaks apply → Boost Active shows real-time performance monitoring.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">5</div>
              <div>
                <h3 className="font-bold text-white mb-1">Monitor Performance</h3>
                <p className="text-sm text-muted-foreground">
                  System Health tab shows real-time CPU/GPU/RAM/Network graphs. Check 7 performance metrics with detailed component breakdowns. Export data as CSV or JSON.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">6</div>
              <div>
                <h3 className="font-bold text-white mb-1">Deactivate Boost</h3>
                <p className="text-sm text-muted-foreground">
                  Click "BOOST ACTIVE" button to disable. System automatically reverts all applied tweaks. Exit animation shows progress. All changes are logged.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> Key Features
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li>All settings, profiles, tweaks auto-save and persist on app restart</li>
              <li>System Log shows every action in real-time at the bottom of dashboard</li>
              <li>Auto-Update Check monitors for new versions every 30 seconds</li>
              <li>Game Detection auto-applies profiles when games launch (enable in Settings)</li>
              <li>Dark/Light theme toggle in Settings preserves across sessions</li>
              <li>Performance options (poll rate, chart history, frame limiter) are adjustable</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-400 mb-2">Pro Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Run Boost before gaming sessions for best results</li>
              <li>✓ Mark your most-played game profiles as favorites (star icon)</li>
              <li>✓ Use Realtime CPU priority for competitive games, High for balanced play</li>
              <li>✓ Check System Log for detailed action history (enable in Settings)</li>
              <li>✓ Export performance data regularly to track system trends</li>
            </ul>
          </div>

          <Button onClick={onClose} className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
            Got It! Start Using FloofyBoost
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
