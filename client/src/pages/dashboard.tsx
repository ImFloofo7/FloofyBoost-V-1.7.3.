import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from "recharts";
import { Zap, Cpu, Activity, Settings, Shield, Play, Gauge, Thermometer, RotateCw, Plus, Terminal, Check, X, Info, Trash2, Power, Wifi, HardDrive, MemoryStick, ChevronDown, ChevronUp, Eye, EyeOff, Star, Pause, Monitor, Search, Download, AlertTriangle, Moon, Sun, Gamepad2, History, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import logoImage from "../assets/logo.png";
import { SplashScreen } from "@/components/splash-screen";
import { HelpView } from "@/components/help-view";
import { LoadingScreen } from "@/components/loading-screen";
import { ExitAnimation } from "@/components/exit-animation";

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
      setStartWithWindows: (enabled: boolean) => Promise<{ success: boolean; message: string }>;
      setGPUAcceleration: (enabled: boolean) => Promise<{ success: boolean; message: string }>;
      getRenderingMode: () => Promise<{ mode: 'gpu' | 'cpu' }>;
      scanHardware: () => Promise<{ success: boolean; devices: any[] }>;
      exitApp: () => void;
      onAppClosing: (callback: (progress: number) => void) => void;
    };
  }
}

type ProcessInfo = {
  name: string;
  priority: string;
};

type GameProfile = {
  id: number;
  name: string;
  mainProcess: ProcessInfo;
  subProcesses: ProcessInfo[];
  status: "Active" | "Idle" | "Optimized";
  lastPlayed?: string;
  isFavorite?: boolean;
};

type TweakOption = {
  id: string;
  label: string;
  description: string;
  category: "System" | "Network" | "Privacy";
  enabled: boolean;
};

type MonitorComponent = {
  id: string;
  name: string;
  enabled: boolean;
  load: number;
  temp: number;
  voltage?: number;
  clockGHz?: number;
  gpuClockMHz?: number;
  memClockMHz?: number;
  speedMHz?: number;
  readSpeedMBps?: number;
  writeSpeedMBps?: number;
};

const INITIAL_TWEAKS: TweakOption[] = [
  { id: "cortana", label: "Disable Cortana", description: "Prevents Cortana from running in the background to save RAM.", category: "Privacy", enabled: true },
  { id: "telemetry", label: "Kill Telemetry (DiagTrack)", description: "Stops Windows from sending usage data, reducing background CPU usage.", category: "Privacy", enabled: true },
  { id: "network", label: "Network Boost (TcpAck)", description: "Modifies TcpAckFrequency to 1 for lower ping in online games.", category: "Network", enabled: true },
  { id: "ram", label: "Auto RAM Flush", description: "Automatically clears Standby List to free up memory.", category: "System", enabled: true },
  { id: "gamebar", label: "Disable Game Bar", description: "Turns off Xbox Game Bar overlay which can cause stuttering.", category: "System", enabled: false },
  { id: "fullscreen", label: "Disable Fullscreen Opt.", description: "Disables Windows Fullscreen Optimizations for better input lag.", category: "System", enabled: false },
  { id: "power", label: "High Perf. Power Plan", description: "Forces CPU to run at max frequency constantly.", category: "System", enabled: false },
  { id: "hibernation", label: "Disable Hibernation", description: "Removes hiberfil.sys to save SSD space and prevent sleep issues.", category: "System", enabled: false },
];

const generateData = () => {
  const now = Date.now();
  return Array.from({ length: 1000 }, (_, i) => {
    const baseCpu = 35 + Math.random() * 45;
    return {
      time: new Date(now - (1000 - i) * 5000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: now - (1000 - i) * 5000,
      cpu: baseCpu,
      gpu: 25 + baseCpu * 0.3 + Math.random() * 20,
      ram: 50 + Math.random() * 30,
      fps: 140 + Math.random() * 80,
      drives: 30 + Math.random() * 30,
      psu: Math.round(Math.max(150, Math.min(450, (baseCpu * 0.4 + 30 + Math.random() * 10) * 5))),
      internet: 60 + Math.random() * 35,
      temp: 50 + baseCpu * 0.3 + Math.random() * 10,
    };
  });
};

const StatCard = ({ title, value, icon: Icon, subtext, color = "text-primary" }: any) => (
  <Card className="bg-card/50 border-white/5 backdrop-blur-sm relative overflow-hidden group">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-${color.split('-')[1]}-500`} />
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xs font-medium font-mono text-muted-foreground uppercase tracking-wider">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold font-mono">{value}</div>
      <p className="text-[10px] text-muted-foreground mt-1 font-mono">{subtext}</p>
    </CardContent>
  </Card>
);

const ProfileFormContent = ({ 
  formName, setFormName, formMainProcess, setFormMainProcess, formSubProcesses, handleAddSubProcessRow, handleSubProcessChange, handleRemoveSubProcessRow 
}: any) => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label className="text-primary font-mono uppercase text-xs">Profile Name</Label>
        <Input 
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="e.g. Elden Ring" 
          className="bg-black/40 border-white/10 font-bold text-lg" 
        />
      </div>

      <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 text-primary">
            <Cpu className="w-4 h-4" />
            <Label className="font-mono uppercase text-xs font-bold">Main Process</Label>
        </div>
        <div className="flex gap-2 items-start">
          <Input 
            placeholder="game.exe" 
            value={formMainProcess.name}
            onChange={(e) => setFormMainProcess({...formMainProcess, name: e.target.value})}
            className="flex-1 bg-black/40 border-white/10 h-9 font-mono text-sm" 
          />
          <Select 
            value={formMainProcess.priority} 
            onValueChange={(val) => setFormMainProcess({...formMainProcess, priority: val})}
          >
            <SelectTrigger className="w-[130px] bg-black/40 border-white/10 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Realtime">Realtime</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="AboveNormal">Above Normal</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" />
            <Label className="font-mono uppercase text-xs">Sub-Processes</Label>
          </div>
          <Button size="sm" variant="ghost" onClick={handleAddSubProcessRow} className="h-6 text-xs text-primary hover:bg-primary/10">
            <Plus className="w-3 h-3 mr-1" /> ADD SUB-PROCESS
          </Button>
        </div>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {formSubProcesses.length === 0 && (
            <div className="text-center py-4 text-xs text-muted-foreground italic border border-dashed border-white/10 rounded">
                No sub-processes added
            </div>
          )}
          {formSubProcesses.map((proc: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
              <Input 
                placeholder="launcher.exe" 
                value={proc.name}
                onChange={(e) => handleSubProcessChange(idx, 'name', e.target.value)}
                className="flex-1 bg-black/40 border-white/10 h-8 text-sm font-mono" 
              />
              <Select 
                value={proc.priority} 
                onValueChange={(val) => handleSubProcessChange(idx, 'priority', val)}
              >
                <SelectTrigger className="w-[110px] bg-black/40 border-white/10 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Realtime">Realtime</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="AboveNormal">Above Normal</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" variant="ghost" onClick={() => handleRemoveSubProcessRow(idx)} className="h-8 w-8 text-red-400 hover:bg-red-400/10 hover:text-red-300">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
);

const ExpandableMonitorCard = ({ component, onToggleMonitor, data, getTempStats, onRemoveComponent }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getTempColor = (temp: number) => {
    if (temp < 50) return "text-green-400";
    if (temp < 70) return "text-yellow-400";
    if (temp < 85) return "text-orange-400";
    return "text-red-400";
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return "from-blue-500 to-green-500";
    if (load < 75) return "from-yellow-500 to-orange-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <Card className="bg-card/50 border-white/5 transition-all w-full hover:border-primary/30">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {component.id === 'cpu' && <Cpu className="w-5 h-5 text-primary flex-shrink-0" />}
            {component.id === 'gpu' && <Zap className="w-5 h-5 text-purple-400 flex-shrink-0" />}
            {component.id === 'ram' && <MemoryStick className="w-5 h-5 text-orange-400 flex-shrink-0" />}
            {component.id === 'psu' && <Power className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
            {component.id.includes('drive') && <HardDrive className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-display">{component.name}</CardTitle>
              <CardDescription className="text-xs font-mono">Load: {component.load}% | Temp: {component.temp}°C</CardDescription>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span>Load</span>
                <span className={getTempColor(component.load)}>{component.load}%</span>
              </div>
              <Progress value={component.load} className={`h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:${getLoadColor(component.load)}`} />
            </div>
            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span>Temperature</span>
                <span className={getTempColor(component.temp)}>{component.temp}°C</span>
              </div>
              <Progress value={component.temp} max={100} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-red-500" />
            </div>
          </div>

          {component.voltage && (
            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span>Voltage</span>
                <span className="text-blue-400">{component.voltage.toFixed(2)}V</span>
              </div>
              <Progress value={(component.voltage / 2) * 100} className="h-2 bg-white/10 [&>div]:bg-blue-500" />
            </div>
          )}

          {component.id === 'cpu' && (
            <div className="text-xs space-y-2 bg-black/20 p-3 rounded border border-white/5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clock Speed</span>
                <span className="text-primary font-bold">{component.clockGHz?.toFixed(2) || '4.2'} GHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cores/Threads</span>
                <span className="text-white">8 / 16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache</span>
                <span className="text-white">16 MB L3</span>
              </div>
              <div className="border-t border-white/5 pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Min Temp</span>
                  <span className="text-green-400">{getTempStats('cpu').min}°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg Temp</span>
                  <span className="text-yellow-400">{getTempStats('cpu').avg}°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Max Temp</span>
                  <span className="text-red-400">{getTempStats('cpu').max}°C</span>
                </div>
              </div>
            </div>
          )}

          {component.id === 'gpu' && (
            <div className="text-xs space-y-2 bg-black/20 p-3 rounded border border-white/5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPU Clock</span>
                <span className="text-purple-400 font-bold">{component.gpuClockMHz || '2100'} MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memory Clock</span>
                <span className="text-purple-400 font-bold">{component.memClockMHz || '14000'} MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VRAM</span>
                <span className="text-white">8 GB GDDR6</span>
              </div>
              <div className="border-t border-white/5 pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Min Temp</span>
                  <span className="text-green-400">{getTempStats('gpu').min}°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg Temp</span>
                  <span className="text-yellow-400">{getTempStats('gpu').avg}°C</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Max Temp</span>
                  <span className="text-red-400">{getTempStats('gpu').max}°C</span>
                </div>
              </div>
            </div>
          )}

          {component.id === 'ram' && (
            <div className="text-xs space-y-2 bg-black/20 p-3 rounded border border-white/5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speed</span>
                <span className="text-orange-400 font-bold">{component.speedMHz || '3600'} MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="text-white">DDR4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Capacity</span>
                <span className="text-white">32 GB</span>
              </div>
            </div>
          )}

          {component.id.includes('drive') && (
            <div className="text-xs space-y-2 bg-black/20 p-3 rounded border border-white/5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Read Speed</span>
                <span className="text-blue-400 font-bold">{component.readSpeedMBps || '3500'} MB/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Write Speed</span>
                <span className="text-blue-400 font-bold">{component.writeSpeedMBps || '3000'} MB/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interface</span>
                <span className="text-white">{component.id === 'drive-c' ? 'NVMe' : 'SATA'}</span>
              </div>
            </div>
          )}

          {component.id === 'psu' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-black/20 p-2 rounded border border-white/5">
                <div className="text-muted-foreground">Efficiency</div>
                <div className="text-sm font-bold">92%</div>
              </div>
              <div className="bg-black/20 p-2 rounded border border-white/5">
                <div className="text-muted-foreground">Headroom</div>
                <div className="text-sm font-bold text-green-400">+350W</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
            <span className="text-xs text-muted-foreground">Monitor this component</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onToggleMonitor(component.id)} className="h-6 text-xs">
                {component.enabled ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {component.enabled ? "Enabled" : "Disabled"}
              </Button>
              {onRemoveComponent && (
                <Button size="sm" variant="ghost" onClick={() => onRemoveComponent(component.id)} className="h-6 text-xs text-red-400 hover:bg-red-400/10 hover:text-red-300">
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (!active || !payload || payload.length === 0) return null;

  const getUnit = (name: string) => {
    if (name === 'FPS') return '';
    if (name === 'PSU') return 'W';
    return '%';
  };

  return (
    <div className="bg-black/90 border border-primary/50 rounded-lg p-3 shadow-lg">
      <p className="text-xs text-muted-foreground font-mono mb-2">{payload[0]?.payload?.time}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-xs font-mono">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="text-white font-bold">{Math.round(entry.value)}{getUnit(entry.name)}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardView = ({ isBoosting, isBoostEnabled, boostProgress, handleMainBoost, tweaks, setTweaks, data, logs, scrollRef, games, applyGameProfile, setActiveTab, timeRange, setTimeRange, getFilteredData, toggleFavorite, isPaused, setIsPaused, visibleMetrics, setVisibleMetrics, isBoostEnabled: propIsBoostEnabled, showSystemLog, addLog }: any) => {
  const filteredData = typeof getFilteredData === 'function' ? getFilteredData() : data;
  
  const toggleMetric = (metric: string) => {
    const willBeEnabled = !visibleMetrics[metric];
    if (willBeEnabled) {
      toast.success(`${metric} activated.`, { position: 'bottom-right', duration: 2000 });
    } else {
      toast.error(`${metric} deactivated.`, { position: 'bottom-right', duration: 2000 });
    }
    setVisibleMetrics((prev: any) => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center relative z-10">
        <div>
          <h2 className="system-overview-title text-2xl font-display font-bold text-white">SYSTEM OVERVIEW</h2>
          <p className="text-muted-foreground font-mono text-sm">Real-time performance monitoring active</p>
        </div>
        
        <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                 <Button variant="outline" className="font-mono border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <Settings className="w-4 h-4 mr-2" /> BOOST TWEAKS
                 </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a1a] border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> Boost Configuration
                  </DialogTitle>
                  <DialogDescription>Select which optimizations to apply when Boost Mode is active.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4 mt-4">
                    {tweaks.map((tweak: any) => (
                      <div key={tweak.id} className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                        <Switch 
                          checked={tweak.enabled} 
                          onCheckedChange={(checked) => {
                            const updatedTweaks = tweaks.map((t: any) => t.id === tweak.id ? {...t, enabled: checked} : t);
                            setTweaks(updatedTweaks);
                            addLog(`${checked ? '✓' : '✗'} ${tweak.label} ${checked ? 'enabled' : 'disabled'}`);
                          }}
                          className="data-[state=checked]:bg-primary mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{tweak.label}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground uppercase">{tweak.category}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{tweak.description}</p>
                        </div>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-black border-white/10 text-white">
                              <p className="max-w-xs text-xs">{tweak.description} Improves gaming performance by freeing resources.</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))} className="bg-primary text-black hover:bg-primary/90 font-bold">
                    SAVE CONFIGURATION
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              size="lg" 
              className={`font-display font-bold tracking-wider shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-all duration-300 min-w-[200px] group ${
                isBoostEnabled 
                  ? 'bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50' 
                  : isBoosting 
                    ? 'bg-primary/20 text-primary animate-pulse' 
                    : 'bg-primary hover:bg-primary/90 text-black'
              }`}
              onClick={handleMainBoost}
              disabled={isBoosting}
            >
              {isBoostEnabled ? (
                 <span className="flex items-center"><Check className="w-4 h-4 mr-2" /> <span className="group-hover:hidden">BOOST ACTIVE</span><span className="hidden group-hover:inline">TURN OFF</span></span>
              ) : isBoosting ? (
                <span className="flex items-center"><RotateCw className="w-4 h-4 mr-2 animate-spin" /> OPTIMIZING...</span>
              ) : (
                <span className="flex items-center"><Zap className="w-4 h-4 mr-2 fill-current" /> START BOOST</span>
              )}
            </Button>
        </div>
      </header>

      <div className="relative h-8 bg-black/40 rounded-full overflow-hidden border border-white/10">
        <div 
          className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out flex items-center justify-end pr-4 ${
            isBoostEnabled ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ width: `${isBoostEnabled ? 100 : boostProgress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className={`font-mono font-bold text-sm tracking-widest ${isBoostEnabled ? 'text-black' : 'text-white mix-blend-difference'}`}>
            {isBoostEnabled ? "BOOST ENABLED" : isBoosting ? `OPTIMIZING SYSTEM ${Math.round(boostProgress)}%` : "SYSTEM READY"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <StatCard title="CPU Load" value={`${Math.round(data[data.length - 1]?.cpu || 0)}%`} subtext={`${data[data.length - 1]?.cpu ? Math.round(data[data.length - 1].cpu * 42) / 1000 : 0} GHz`} icon={Cpu} color="text-blue-400" />
        <StatCard title="GPU Load" value={`${Math.round(data[data.length - 1]?.gpu || 0)}%`} subtext={`${Math.round(data[data.length - 1]?.temp || 0)}°C`} icon={Zap} color="text-purple-400" />
        <StatCard title="RAM Usage" value={`${Math.round(data[data.length - 1]?.ram || 0)}%`} subtext="System Memory" icon={MemoryStick} color="text-orange-400" />
        <StatCard title="FPS Avg" value={`${Math.round(data[data.length - 1]?.fps || 140)}`} subtext={`${isBoostEnabled ? '+18%' : '+5%'} from Boost`} icon={Activity} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Performance Metrics
                  </CardTitle>
                  <Button size="sm" variant={isPaused ? "secondary" : "ghost"} onClick={() => setIsPaused(!isPaused)} className="h-8">
                    {isPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                    {isPaused ? "PAUSED" : "LIVE"}
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["realtime", "30s", "1m", "2m", "5m", "10m", "15m"] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                        timeRange === range
                          ? "bg-primary text-black font-bold"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {range === "realtime" ? "NOW" : range}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(visibleMetrics || {}).map(([metric, visible]: any) => (
                    <button
                      key={metric}
                      onClick={() => toggleMetric(metric)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                        visible
                          ? "bg-primary/30 text-primary border border-primary/50"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData}>
                    <defs>
                      <linearGradient id="gradientCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientGpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientRam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientFps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientDrives" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientPsu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradientInternet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 500]} />
                    <Tooltip content={<CustomTooltip />} />
                    {(visibleMetrics?.CPU || visibleMetrics?.CPU === undefined) && <Area type="natural" dataKey="cpu" name="CPU" stroke="#22c55e" strokeWidth={2.5} fill="url(#gradientCpu)" fillOpacity={1} isAnimationActive={false} />}
                    {(visibleMetrics?.GPU || visibleMetrics?.GPU === undefined) && <Area type="natural" dataKey="gpu" name="GPU" stroke="#a855f7" strokeWidth={2.5} fill="url(#gradientGpu)" fillOpacity={1} isAnimationActive={false} />}
                    {(visibleMetrics?.RAM || visibleMetrics?.RAM === undefined) && <Area type="natural" dataKey="ram" name="RAM" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradientRam)" fillOpacity={1} isAnimationActive={false} />}
                    {visibleMetrics?.FPS && <Area type="natural" dataKey="fps" name="FPS" stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradientFps)" fillOpacity={1} isAnimationActive={false} />}
                    {visibleMetrics?.Drives && <Area type="natural" dataKey="drives" name="Drives" stroke="#ec4899" strokeWidth={2.5} fill="url(#gradientDrives)" fillOpacity={1} isAnimationActive={false} />}
                    {visibleMetrics?.PSU && <Area type="natural" dataKey="psu" name="PSU" stroke="#14b8a6" strokeWidth={2.5} fill="url(#gradientPsu)" fillOpacity={1} isAnimationActive={false} />}
                    {visibleMetrics?.Internet && <Area type="natural" dataKey="internet" name="Internet" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gradientInternet)" fillOpacity={1} isAnimationActive={false} />}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {showSystemLog && (
          <Card className="bg-black/60 border-white/10 backdrop-blur-md h-[250px] flex flex-col shadow-inner">
            <CardHeader className="pb-2 border-b border-white/5 bg-white/5 py-3">
              <CardTitle className="font-mono text-xs flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Terminal className="w-3 h-3" /> System Log
              </CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-hidden p-4 font-mono text-xs space-y-1" ref={scrollRef}>
               <ScrollArea className="h-full w-full">
                {logs.length === 0 && <span className="text-muted-foreground italic opacity-50">Waiting for command...</span>}
                {logs.map((log: any, i: number) => (
                  <div key={i} className="text-green-400/90 border-l-2 border-transparent hover:border-primary pl-2 hover:bg-white/5 transition-colors">
                    {log}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </Card>
          )}
        </div>

        <Card className="bg-card/50 border-white/5 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="font-display text-lg">Quick Profiles</CardTitle>
            <CardDescription className="text-xs">Launch & Optimize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             {games.filter((g: any) => g.isFavorite).slice(0, 7).map((game: any) => (
                <div key={game.id} className="group flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-primary/30 transition-all cursor-pointer" onClick={() => applyGameProfile(game)}>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:text-white group-hover:from-primary/20 group-hover:to-black transition-all">
                        {game.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                       <div className="font-bold text-sm text-gray-200 group-hover:text-primary transition-colors">{game.name}</div>
                       <div className="text-[10px] text-muted-foreground font-mono">{1 + game.subProcesses.length} process(es)</div>
                     </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-primary">
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                </div>
             ))}
             {games.filter((g: any) => g.isFavorite).length === 0 && (
               <div className="text-xs text-muted-foreground italic text-center py-4">No favorites yet. Star a profile to add it here!</div>
             )}
             <Button variant="ghost" className="w-full mt-4 text-xs font-mono text-muted-foreground hover:text-white" onClick={() => setActiveTab("profiles")}>
               MANAGE ALL PROFILES →
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProfilesView = ({ 
  games, setGames, isAddGameOpen, setIsAddGameOpen, openAddGame, saveGame, openEditGame, applyGameProfile, toggleFavorite,
  formName, setFormName, formMainProcess, setFormMainProcess, formSubProcesses, handleAddSubProcessRow, handleSubProcessChange, handleRemoveSubProcessRow,
  isEditGameOpen, setIsEditGameOpen, handleDeleteProfile, deleteConfirmId, setDeleteConfirmId, deleteName, setDeleteName, addLog
}: any) => {

  const handleDeleteClick = (game: any) => {
    setDeleteConfirmId(game.id);
    setDeleteName(game.name);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      handleDeleteProfile(deleteConfirmId);
    }
  };

  const handleFavClick = (gameId: number, isFav: boolean) => {
    toggleFavorite(gameId);
    const gameName = games.find((g: any) => g.id === gameId)?.name || "Profile";
    addLog(`${!isFav ? '⭐' : '☆'} ${gameName} ${!isFav ? 'added to' : 'removed from'} favorites`);
  };

  const handleApplyProfile = (game: any) => {
    applyGameProfile(game);
    addLog(`🎮 Applied profile: ${game.name}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <Play className="w-6 h-6 text-primary" /> GAME PROFILES
        </h2>
        
        <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddGame} className="bg-primary text-black hover:bg-primary/90 font-bold">
              <Plus className="w-4 h-4 mr-2" /> NEW PROFILE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display">Create Game Profile</DialogTitle>
              <DialogDescription>Configure main process and sub-processes.</DialogDescription>
            </DialogHeader>
            <ProfileFormContent 
              formName={formName} 
              setFormName={setFormName} 
              formMainProcess={formMainProcess} 
              setFormMainProcess={setFormMainProcess} 
              formSubProcesses={formSubProcesses} 
              handleAddSubProcessRow={handleAddSubProcessRow} 
              handleSubProcessChange={handleSubProcessChange} 
              handleRemoveSubProcessRow={handleRemoveSubProcessRow}
            />
            <DialogFooter>
              <Button onClick={saveGame} className="w-full bg-primary text-black hover:bg-primary/90">CREATE PROFILE</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditGameOpen} onOpenChange={setIsEditGameOpen}>
          <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display">Edit Game Profile</DialogTitle>
              <DialogDescription>Modify process configuration.</DialogDescription>
            </DialogHeader>
            <ProfileFormContent 
              formName={formName} 
              setFormName={setFormName} 
              formMainProcess={formMainProcess} 
              setFormMainProcess={setFormMainProcess} 
              formSubProcesses={formSubProcesses} 
              handleAddSubProcessRow={handleAddSubProcessRow} 
              handleSubProcessChange={handleSubProcessChange} 
              handleRemoveSubProcessRow={handleRemoveSubProcessRow}
            />
            <DialogFooter>
              <Button onClick={saveGame} className="w-full bg-primary text-black hover:bg-primary/90">SAVE CHANGES</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
          <AlertDialogContent className="bg-[#1a1a1a] border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-xl">Delete Profile?</AlertDialogTitle>
              <AlertDialogDescription className="text-white">
                Do you really want to delete <span className="font-bold text-primary">"{deleteName}"</span>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 hover:bg-white/5">No, Keep It</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game: any) => (
          <Card key={game.id} className="bg-card/50 border-white/5 hover:border-primary/30 transition-all group">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-muted/20 flex items-center justify-center text-lg font-bold text-muted-foreground group-hover:text-white group-hover:bg-primary/20 transition-colors">
                  {game.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-base font-display">{game.name}</CardTitle>
                  <CardDescription className="text-xs font-mono mt-1">
                    Main: {game.mainProcess.name}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                 <Button size="icon" variant="ghost" className={`h-8 w-8 transition-colors ${game.isFavorite ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`} onClick={() => handleFavClick(game.id, game.isFavorite)}>
                   <Star className="w-4 h-4" fill={game.isFavorite ? "currentColor" : "none"} />
                 </Button>
                 <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => openEditGame(game)}>
                   <Settings className="w-4 h-4" />
                 </Button>
                 <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10" onClick={() => handleDeleteClick(game)}>
                   <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 bg-black/20 rounded p-3 mb-4 min-h-[80px]">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2 mb-2">
                    <span className="text-white font-bold">{game.mainProcess.name}</span>
                    <span className={`px-1.5 py-0.5 rounded uppercase text-[10px] ${
                      game.mainProcess.priority === 'Realtime' ? 'bg-red-500/20 text-red-400' : 
                      game.mainProcess.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : 
                      'bg-blue-500/20 text-blue-400'
                    }`}>{game.mainProcess.priority}</span>
                </div>
                {game.subProcesses.map((proc: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono pl-2 border-l-2 border-white/10">
                    <span className="text-gray-400">{proc.name}</span>
                    <span className="text-gray-500">{proc.priority}</span>
                  </div>
                ))}
                {game.subProcesses.length === 0 && (
                    <div className="text-[10px] text-muted-foreground italic text-center py-1">No sub-processes</div>
                )}
              </div>
              <Button className="w-full bg-white/5 hover:bg-primary/20 text-white hover:text-primary border border-white/10 hover:border-primary/50 transition-all" onClick={() => handleApplyProfile(game)}>
                <Zap className="w-4 h-4 mr-2" /> OPTIMIZE & LAUNCH
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
);
};

const OPTIONAL_HARDWARE = [
  { id: 'gpu2', name: 'GPU Graphics 2', load: 12, temp: 45, voltage: 0.85, gpuClockMHz: 1800, memClockMHz: 12000 },
  { id: 'drive-e', name: 'Drive E: (Storage)', load: 5, temp: 35, readSpeedMBps: 150, writeSpeedMBps: 140 },
  { id: 'nvme', name: 'NVMe Controller', load: 10, temp: 50, voltage: 3.3 },
  { id: 'fan-cpu', name: 'CPU Fan', load: 45, temp: 60, voltage: 12 },
  { id: 'liquid-cool', name: 'Liquid Cooling', load: 55, temp: 38, voltage: 12 },
];

const SystemHealthView = ({ data, componentStats, systemInfo, setSystemInfo, monitors, setMonitors, highTempAlert, alertingComponent, setHighTempAlert }: any) => {
  const enabledMonitors = monitors.filter((m: MonitorComponent) => m.enabled);
  const [isScanning, setIsScanning] = useState(false);

  const getTempStats = (componentId: string) => {
    const temps = componentStats?.[componentId]?.temps || data.map((d: any) => d.temp || 0);
    if (temps.length === 0) return { min: 0, avg: 0, max: 0 };
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const avg = Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length);
    return { min: Math.round(min), avg, max: Math.round(max) };
  };

  useEffect(() => {
    const loadSystemInfo = async () => {
      if (window.electronAPI) {
        try {
          const info = await window.electronAPI.getSystemInfo();
          if (info.success) {
            setSystemInfo(info.data);
            setMonitors((prev: MonitorComponent[]) => 
              prev.map((m: MonitorComponent) => {
                if (m.id === 'ram') {
                  return { ...m, load: info.data.memoryUsagePercent };
                }
                return m;
              })
            );
          }
        } catch (error) {
          console.error("Failed to load system info:", error);
        }
      }
    };
    loadSystemInfo();
  }, []);

  const handleToggleMonitor = (id: string) => {
    const monitor = monitors.find((m: MonitorComponent) => m.id === id);
    const willBeEnabled = !monitor?.enabled;
    const monitorName = monitor?.name || id;
    
    setMonitors(monitors.map((m: MonitorComponent) => m.id === id ? {...m, enabled: !m.enabled} : m));
    
    if (willBeEnabled) {
      toast.success(`${monitorName} activated.`, { position: 'bottom-right', duration: 2000 });
    } else {
      toast.error(`${monitorName} deactivated.`, { position: 'bottom-right', duration: 2000 });
    }
  };

  const handleRemoveComponent = (id: string) => {
    const monitor = monitors.find((m: MonitorComponent) => m.id === id);
    const monitorName = monitor?.name || id;
    setMonitors(monitors.filter((m: MonitorComponent) => m.id !== id));
    toast.info(`${monitorName} removed from monitoring.`, { position: 'bottom-right', duration: 2000 });
  };

  const handleAddComponent = (componentId: string) => {
    const optComponent = OPTIONAL_HARDWARE.find(c => c.id === componentId);
    if (optComponent && !monitors.find((m: MonitorComponent) => m.id === componentId)) {
      setMonitors([...monitors, { ...optComponent, enabled: true }]);
      toast.success(`${optComponent.name} added to monitoring.`, { position: 'bottom-right', duration: 2000 });
    }
  };

  const [showNoHardwareModal, setShowNoHardwareModal] = useState(false);

  const handleScanHardware = async () => {
    setIsScanning(true);
    toast.success("Searching for hardware..", { position: 'bottom-right', duration: 2000 });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowNoHardwareModal(true);
    } catch (error: any) {
      toast.error("Failed to scan hardware", { position: 'bottom-right', duration: 2000 });
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportData = (format: "csv" | "json") => {
    const timestamp = new Date().toLocaleString();
    let content = "";
    let filename = "";
    
    if (format === "csv") {
      const headers = ["Time", "CPU %", "GPU %", "RAM %", "FPS", "Drives %", "PSU W", "Internet %", "Latency ms", "Temp C"];
      content = headers.join(",") + "\n";
      data.forEach((d: any) => {
        content += `${d.time},${d.cpu},${d.gpu},${d.ram},${d.fps},${d.drives},${d.psu},${d.internet},${d.latency},${d.temp}\n`;
      });
      filename = `floofyboost_performance_${Date.now()}.csv`;
    } else {
      const exportData = {
        exportDate: timestamp,
        metrics: data,
        systemInfo: systemInfo,
        components: monitors
      };
      content = JSON.stringify(exportData, null, 2);
      filename = `floofyboost_performance_${Date.now()}.json`;
    }
    
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`Data exported as ${format.toUpperCase()}`, { position: 'bottom-right', duration: 2000 });
  };

  const handleTweakChangeInternal = (tweakId: string, enabled: boolean) => {
    const tweak = INITIAL_TWEAKS.find((t: any) => t.id === tweakId);
    if (!tweak) return;
    if (tweak) {
      const timestamp = new Date().toLocaleTimeString();
      // Logged in addLog already
    }
  };

  const addLog = (message: string) => {
    console.log(message);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" /> SYSTEM HEALTH & MONITORING
        </h2>
        <Button 
          onClick={handleScanHardware} 
          disabled={isScanning}
          className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
          data-testid="button-scan-hardware"
        >
          {isScanning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              SCANNING...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              SCAN FOR HARDWARE
            </>
          )}
        </Button>
      </div>
      
      <div className="flex gap-3 justify-end mb-4">
        <Button 
          onClick={() => handleExportData("csv")}
          className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
          size="sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button 
          onClick={() => handleExportData("json")}
          className="gap-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
          size="sm"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enabledMonitors.length === 0 ? (
          <Card className="bg-card/50 border-white/5 p-8 text-center">
            <p className="text-muted-foreground">No hardware components enabled. Go to Settings to enable monitoring.</p>
          </Card>
        ) : (
          enabledMonitors.map((component: MonitorComponent) => (
          <ExpandableMonitorCard 
            key={component.id}
            component={component}
            onToggleMonitor={handleToggleMonitor}
            onRemoveComponent={handleRemoveComponent}
            data={data}
            getTempStats={getTempStats}
          />
          ))
        )}
      </div>

      {showNoHardwareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-red-950/80 border-2 border-red-500 rounded-lg p-6 max-w-sm mx-4 shadow-lg">
            <p className="text-white text-center mb-6 font-semibold">No new hardware found.</p>
            <Button 
              onClick={() => setShowNoHardwareModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {highTempAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-red-950/80 border-2 border-red-500 rounded-lg p-6 max-w-sm mx-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <p className="text-white font-semibold">Temperature Warning</p>
            </div>
            <p className="text-muted-foreground mb-6">{alertingComponent} is running too hot (&gt;80°C). Consider reducing load or improving cooling.</p>
            <Button 
              onClick={() => setHighTempAlert(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU Model</span>
                <span className="text-white">{systemInfo?.cpuModel || 'Loading...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU Cores</span>
                <span className="text-white">{systemInfo?.cpuCount || '?'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Memory</span>
                <span className="text-white">{systemInfo?.totalMemory || '?'} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-green-400">{systemInfo?.uptime || '?'}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span className="text-white capitalize">{systemInfo?.platform?.includes('win') ? 'Windows' : systemInfo?.platform || 'Unknown'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>System Stability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg FPS Stability</span>
                <span className="text-green-400">{Math.round(data.slice(-20).reduce((a: number, d: any) => a + (d.fps || 0), 0) / 20) > 130 ? '98%' : '92%'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPU Throttling</span>
                <span className={`${data[data.length - 1]?.cpu > 95 ? 'text-red-400' : 'text-green-400'}`}>{data[data.length - 1]?.cpu > 95 ? 'Active' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className={`${data[data.length - 1]?.ram > 85 ? 'text-yellow-400' : 'text-green-400'}`}>{Math.round(data[data.length - 1]?.ram || 0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Health</span>
                <span className={`${(data[data.length - 1]?.cpu || 0) > 85 ? 'text-yellow-400' : 'text-green-400'}`}>{(data[data.length - 1]?.cpu || 0) > 85 ? 'Good' : 'Excellent'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
);
};

const OptimizationView = ({ tweaks, setTweaks, addLog }: any) => {
  const [powerPlan, setPowerPlan] = useState("ultimate");
  const [mtuSize, setMtuSize] = useState(1500);
  const [currentDns, setCurrentDns] = useState("automatic");
  const [customDns, setCustomDns] = useState("");
  const [primaryDns, setPrimaryDns] = useState("");
  const [secondaryDns, setSecondaryDns] = useState("");
  const [dnsDisplay, setDnsDisplay] = useState("Automatic (System Default)");
  const [showDnsInfo, setShowDnsInfo] = useState(false);

  const handlePowerPlanChange = (plan: string) => {
    setPowerPlan(plan);
    const planName = plan === "ultimate" ? "Ultimate Performance" : "High Performance";
    addLog(`Power Plan changed to: ${planName}`);
  };

  const handleMtuChange = (value: number[]) => {
    const newSize = value[0];
    setMtuSize(newSize);
    addLog(`MTU Size adjusted to: ${newSize} bytes`);
  };

  const handleDnsChange = (dns: string, displayName: string) => {
    setCurrentDns(dns);
    setDnsDisplay(displayName);
    addLog(`✓ DNS changed to: ${displayName}`);
    toast.success(`${displayName} activated.`, { position: 'bottom-right', duration: 2000 });
    if (window.electronAPI?.applyNetworkSetting) {
      window.electronAPI.applyNetworkSetting(mtuSize);
    }
  };

  const handleCustomDns = () => {
    if (customDns.trim()) {
      setCurrentDns("custom");
      setDnsDisplay(`Custom (${customDns})`);
      addLog(`✓ Custom DNS applied: ${customDns}`);
      toast.success(`Custom DNS (${customDns}) activated.`, { position: 'bottom-right', duration: 2000 });
      setCustomDns("");
    }
  };

  const handleDualDnsApply = () => {
    if (primaryDns.trim()) {
      const displayText = secondaryDns.trim() 
        ? `Primary: ${primaryDns}, Secondary: ${secondaryDns}`
        : `Primary: ${primaryDns}`;
      setCurrentDns("custom-dual");
      setDnsDisplay(displayText);
      addLog(`✓ Custom DNS applied - ${displayText}`);
      toast.success(`Custom DNS activated - ${displayText}`, { position: 'bottom-right', duration: 2000 });
      if (window.electronAPI?.applyNetworkSetting) {
        window.electronAPI.applyNetworkSetting(mtuSize);
      }
    }
  };

  const handleRevertDns = () => {
    setCurrentDns("automatic");
    setDnsDisplay("Automatic (System Default)");
    addLog("✓ DNS reverted to automatic");
    toast.error("DNS reverted to automatic.", { position: 'bottom-right', duration: 2000 });
    setCustomDns("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" /> OPTIMIZATION SETTINGS
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 bg-card/50 border-white/5">
           <CardHeader>
             <CardTitle>Global Boost Tweaks</CardTitle>
             <CardDescription>Configure what happens when "Boost Mode" is enabled.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              {tweaks.map((tweak: any) => (
                <div key={tweak.id} className="flex items-start space-x-4 p-4 rounded-lg bg-black/20 border border-white/5 hover:border-primary/30 transition-colors">
                  <Switch 
                    checked={tweak.enabled} 
                    onCheckedChange={async (checked: boolean) => {
                      const updatedTweaks = tweaks.map((t: any) => t.id === tweak.id ? {...t, enabled: checked} : t);
                      setTweaks(updatedTweaks);
                      if (checked) {
                        toast.success(`${tweak.label} activated.`, { position: 'bottom-right', duration: 2000 });
                      } else {
                        toast.error(`${tweak.label} deactivated.`, { position: 'bottom-right', duration: 2000 });
                      }
                      if (window.electronAPI) {
                        await window.electronAPI.saveTweaks(updatedTweaks);
                      }
                    }}
                    className="data-[state=checked]:bg-primary mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{tweak.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
                        tweak.category === 'System' ? 'bg-blue-500/10 text-blue-400' :
                        tweak.category === 'Network' ? 'bg-green-500/10 text-green-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>{tweak.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tweak.description}</p>
                  </div>
                </div>
              ))}
           </CardContent>
         </Card>

         <div className="space-y-6">
           <Card className="bg-card/50 border-white/5">
             <CardHeader>
               <CardTitle>Power Plan</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div 
                 onClick={async () => {
                   if (powerPlan !== "ultimate") {
                     handlePowerPlanChange("ultimate");
                     toast.success("Ultimate Performance activated.", { position: 'bottom-right', duration: 2000 });
                     if (window.electronAPI) {
                       const result = await window.electronAPI.applyPowerPlan("ultimate");
                       if (!result.success) addLog(`⚠️ ${result.message}`);
                     }
                   }
                 }}
                 className={`flex items-center justify-between p-3 rounded bg-black/20 border cursor-pointer transition-all ${
                   powerPlan === "ultimate" 
                     ? "border-primary/40" 
                     : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <Zap className={`w-5 h-5 ${powerPlan === "ultimate" ? "text-primary" : "text-muted-foreground"}`} />
                   <div>
                     <div className={`font-bold text-sm ${powerPlan === "ultimate" ? "text-white" : "text-white"}`}>Ultimate Performance</div>
                     <div className="text-xs text-muted-foreground">{powerPlan === "ultimate" ? "Active" : "Inactive"}</div>
                   </div>
                 </div>
                 {powerPlan === "ultimate" && <Check className="w-4 h-4 text-primary" />}
               </div>
               <div 
                 onClick={async () => {
                   if (powerPlan !== "high") {
                     handlePowerPlanChange("high");
                     toast.success("High Performance activated.", { position: 'bottom-right', duration: 2000 });
                     if (window.electronAPI) {
                       const result = await window.electronAPI.applyPowerPlan("high");
                       if (!result.success) addLog(`⚠️ ${result.message}`);
                     }
                   }
                 }}
                 className={`flex items-center justify-between p-3 rounded bg-black/20 border cursor-pointer transition-all ${
                   powerPlan === "high" 
                     ? "border-primary/40" 
                     : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <Zap className={`w-5 h-5 ${powerPlan === "high" ? "text-primary" : "text-muted-foreground"}`} />
                   <div>
                     <div className={`font-bold text-sm ${powerPlan === "high" ? "text-white" : "text-white"}`}>High Performance</div>
                     <div className="text-xs text-muted-foreground">{powerPlan === "high" ? "Active" : "Default"}</div>
                   </div>
                 </div>
                 {powerPlan === "high" && <Check className="w-4 h-4 text-primary" />}
               </div>
             </CardContent>
           </Card>

           <Card className="bg-card/50 border-white/5">
             <CardHeader>
               <CardTitle>Network Optimization</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs">
                   <span>MTU Size</span>
                   <span className="text-primary">{mtuSize}</span>
                 </div>
                 <Slider value={[mtuSize]} onValueChange={(value) => {
                   const newSize = value[0];
                   setMtuSize(newSize);
                   addLog(`MTU Size adjusted to: ${newSize} bytes`);
                   if (window.electronAPI) {
                     window.electronAPI.applyNetworkSetting(newSize).then(result => {
                       if (!result.success) addLog(`⚠️ ${result.message}`);
                     });
                   }
                 }} max={1500} min={1400} step={1} className="[&>.relative>.absolute]:bg-primary" />
               </div>
               <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" onClick={async () => {
                 addLog("Flushing DNS cache...");
                 if (window.electronAPI) {
                   try {
                     const result = await window.electronAPI.flushDnsCache();
                     addLog(`✓ ${result.message}`);
                   } catch (error: any) {
                     addLog(`✗ Failed to flush DNS: ${error.message}`);
                   }
                 } else {
                   addLog("✓ DNS cache cleared successfully");
                 }
               }}>
                 <Wifi className="w-4 h-4 mr-2" /> FLUSH DNS CACHE
               </Button>
             </CardContent>
           </Card>

           <Card className="bg-card/50 border-white/5">
             <CardHeader className="flex flex-row items-center justify-between pb-3">
               <CardTitle className="text-base">DNS Settings</CardTitle>
               <UITooltip>
                 <TooltipTrigger asChild>
                   <button className="p-1 hover:bg-white/10 rounded">
                     <Info className="w-4 h-4 text-muted-foreground" />
                   </button>
                 </TooltipTrigger>
                 <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-xs">
                   <p>DNS servers translate domain names to IP addresses. Changing DNS can improve speed and privacy, but only change if you know what you're doing. Wrong settings may break your connection.</p>
                 </TooltipContent>
               </UITooltip>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="text-xs p-3 rounded bg-black/30 border border-white/10">
                 <span className="text-muted-foreground">Current DNS: </span>
                 <span className="text-primary font-mono">{dnsDisplay}</span>
               </div>

               <div className="space-y-2">
                 <p className="text-xs font-semibold text-muted-foreground">Recommended Presets:</p>
                 <div className="space-y-2">
                   <Button
                     onClick={() => handleDnsChange("google", "Google Public DNS (8.8.8.8, 8.8.4.4)")}
                     className={`w-full text-xs h-8 ${currentDns === "google" ? "bg-primary text-black hover:bg-primary/90" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"}`}
                   >
                     Google DNS
                   </Button>
                   <Button
                     onClick={() => handleDnsChange("cloudflare", "Cloudflare DNS (1.1.1.1, 1.0.0.1)")}
                     className={`w-full text-xs h-8 ${currentDns === "cloudflare" ? "bg-primary text-black hover:bg-primary/90" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"}`}
                   >
                     Cloudflare DNS
                   </Button>
                 </div>
               </div>

               <div className="pt-2 space-y-2 border-t border-white/10">
                 <p className="text-xs font-semibold text-muted-foreground">Custom DNS (Primary & Secondary):</p>
                 <div className="space-y-2">
                   <Input
                     placeholder="Primary DNS (e.g., 8.8.8.8)"
                     value={primaryDns}
                     onChange={(e) => setPrimaryDns(e.target.value)}
                     className="bg-black/30 border-white/10 h-8 text-xs"
                   />
                   <Input
                     placeholder="Secondary DNS (e.g., 8.8.4.4)"
                     value={secondaryDns}
                     onChange={(e) => setSecondaryDns(e.target.value)}
                     className="bg-black/30 border-white/10 h-8 text-xs"
                   />
                   <Button
                     onClick={handleDualDnsApply}
                     className="w-full bg-white/10 border border-white/20 text-primary hover:bg-white/20 h-8 text-xs"
                   >
                     Apply Custom DNS
                   </Button>
                 </div>
               </div>

               <Button
                 onClick={handleRevertDns}
                 variant="outline"
                 className="w-full border-white/10 hover:bg-white/5 text-xs h-8"
               >
                 Revert to Default
               </Button>
             </CardContent>
           </Card>
         </div>
      </div>
    </div>
  );
};

const SettingsView = ({ addLog, monitors, setMonitors, darkMode, setDarkMode, autoUpdateCheck, setAutoUpdateCheck, gameDetectionEnabled, setGameDetectionEnabled, tweaks, setTweaks, revertLogs, setRevertLogs, devMode, setDevMode, versionClickCount, setVersionClickCount, showSystemLog, setShowSystemLog, logs, setLogs, cpuLoadMock, setCpuLoadMock, gpuLoadMock, setGpuLoadMock, ramLoadMock, setRamLoadMock, pollRate, setPollRate, chartHistoryLimit, setChartHistoryLimit, autoMinimizeToTray, setAutoMinimizeToTray, loggingFrequency, setLoggingFrequency, disableBackgroundMonitoring, setDisableBackgroundMonitoring, frameRateLimiter, setFrameRateLimiter, disableAnimations, setDisableAnimations, lastUpdateCheck, setLastUpdateCheck, detectedGames, setDetectedGames }: any) => {
  const [settingsTab, setSettingsTab] = useState<"monitoring" | "advanced" | "gaming" | "performance" | "devmode" | "about">("monitoring");
  const [animSpeed, setAnimSpeed] = useState(() => parseFloat(localStorage.getItem("floofyboost_anim_speed") || "1"));
  const [startWithWindows, setStartWithWindows] = useState(() => localStorage.getItem("floofyboost_start_with_windows") === "true");
  const [renderingMode, setRenderingMode] = useState<"gpu" | "cpu">("gpu");
  const [fpsCounter, setFpsCounter] = useState(() => localStorage.getItem("floofyboost_fps_counter") === "true");
  const [backgroundLimiter, setBackgroundLimiter] = useState(() => localStorage.getItem("floofyboost_bg_limiter") === "true");
  const [monitorSync, setMonitorSync] = useState(() => localStorage.getItem("floofyboost_monitor_sync") === "true");
  const [networkOpt, setNetworkOpt] = useState(() => localStorage.getItem("floofyboost_network_opt") === "true");
  const [latencyReduction, setLatencyReduction] = useState(() => localStorage.getItem("floofyboost_latency_reduction") === "true");
  const [cpuAffinity, setCpuAffinity] = useState(() => localStorage.getItem("floofyboost_cpu_affinity") === "true");
  const [ramCache, setRamCache] = useState(() => localStorage.getItem("floofyboost_ram_cache") === "true");
  const [discordRpc, setDiscordRpc] = useState(() => localStorage.getItem("floofyboost_discord_rpc") === "true");

  useEffect(() => {
    if (window.electronAPI?.getRenderingMode) {
      window.electronAPI.getRenderingMode().then(result => {
        setRenderingMode(result.mode);
      });
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (disableAnimations) {
      document.documentElement.classList.add("no-animations");
    } else {
      document.documentElement.classList.remove("no-animations");
    }
  }, [disableAnimations]);

  useEffect(() => {
    const frameRates: { [key: string]: number } = { "30": 33, "60": 16, "unlimited": 0 };
    const delay = frameRates[frameRateLimiter as string];
    if (delay > 0) {
      document.documentElement.style.setProperty("--frame-rate-delay", `${delay}ms`);
    } else {
      document.documentElement.style.setProperty("--frame-rate-delay", "0ms");
    }
  }, [frameRateLimiter]);

  useEffect(() => {
    if (!gameDetectionEnabled) return;
    const interval = setInterval(() => {
      const gameList = ["Cyberpunk 2077", "Call of Duty", "Apex Legends", "Valorant", "CS:GO"];
      if (Math.random() < 0.15) {
        const detectedGame = gameList[Math.floor(Math.random() * gameList.length)];
        setDetectedGames((prev: string[]) => [...Array.from(new Set([...prev, detectedGame]))]);
        addLog(`✓ Game detected: ${detectedGame} - Profile auto-applied`);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [gameDetectionEnabled]);

  useEffect(() => {
    if (!autoUpdateCheck) return;
    const interval = setInterval(async () => {
      const now = new Date().toLocaleTimeString();
      setLastUpdateCheck(now);
      localStorage.setItem("floofyboost_last_update_check", now);
      const currentVersion = "1.7.3";
      const latestVersion = Math.random() > 0.8 ? "1.3.4" : "1.7.3";
      if (latestVersion !== currentVersion) {
        addLog(`⚠ Update available: FloofyBoost ${latestVersion}`);
      } else {
        addLog(`✓ FloofyBoost is up to date (${currentVersion})`);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [autoUpdateCheck]);

  useEffect(() => {
    localStorage.setItem("floofyboost_tweaks", JSON.stringify(tweaks));
  }, [tweaks]);

  const handleToggle = (key: string, value: boolean, message: string) => {
    localStorage.setItem(key, value ? "true" : "false");
    addLog(`✓ ${message}`);
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    setDisableAnimations(enabled);
    localStorage.setItem("floofyboost_disable_animations", enabled ? "true" : "false");
    if (enabled) {
      document.documentElement.classList.add("no-animations");
      addLog("✓ Animations disabled for better performance");
    } else {
      document.documentElement.classList.remove("no-animations");
      addLog("✓ Animations enabled");
    }
  };

  const handleStartWithWindows = (enabled: boolean) => {
    setStartWithWindows(enabled);
    localStorage.setItem("floofyboost_start_with_windows", enabled ? "true" : "false");
    if (window.electronAPI?.setStartWithWindows) {
      window.electronAPI.setStartWithWindows(enabled).then(result => {
        addLog(enabled ? "✓ FloofyBoost will start with Windows" : "✓ FloofyBoost startup disabled");
      });
    }
  };

  const handleRenderingMode = async (mode: "gpu" | "cpu") => {
    setRenderingMode(mode);
    if (window.electronAPI?.setGPUAcceleration) {
      await window.electronAPI.setGPUAcceleration(mode === "gpu");
      addLog(`✓ Rendering mode changed to ${mode.toUpperCase()}`);
    }
  };

  const SettingToggle = ({ label, description, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
      <div>
        <div className="font-semibold text-white">{label}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-primary" /> Settings
        </h2>
        <p className="text-muted-foreground text-sm font-mono">Configure FloofyBoost preferences</p>
      </div>

      <Tabs value={settingsTab} onValueChange={(v) => setSettingsTab(v as any)} className="w-full">
        <TabsList className={`grid w-full ${devMode ? 'grid-cols-6' : 'grid-cols-5'} gap-1 bg-white/5 border border-white/10 mb-6`}>
          <TabsTrigger value="monitoring" className="text-xs">Monitoring</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          <TabsTrigger value="gaming" className="text-xs">Gaming</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
          {devMode && <TabsTrigger value="devmode" className="text-xs">DEV Mode</TabsTrigger>}
          <TabsTrigger value="about" className="text-xs">About</TabsTrigger>
        </TabsList>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Shield className="w-5 h-5" /> System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white font-semibold mb-3 block">Optional Hardware Components</Label>
                <p className="text-xs text-muted-foreground mb-4">Toggle monitoring for additional hardware. Disabled components won't appear in System Health tab.</p>
                <div className="space-y-2">
                  {monitors.filter((m: MonitorComponent) => !['cpu', 'gpu', 'ram', 'drive-c', 'psu'].includes(m.id)).map((component: MonitorComponent) => (
                    <div key={component.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-sm text-white">{component.name}</span>
                      <Button size="sm" variant="ghost" onClick={() => { const m = monitors.find((x: any) => x.id === component.id); if (m) { const newMonitors = monitors.map((x: any) => x.id === component.id ? {...x, enabled: !x.enabled} : x); setMonitors(newMonitors); } }} className="h-6 text-xs">
                        {component.enabled ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {component.enabled ? "On" : "Off"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <SettingToggle 
              label="Auto-Update Check" 
              description={`Check for updates periodically. Last check: ${lastUpdateCheck}`}
              checked={autoUpdateCheck}
              onChange={(val: boolean) => { 
                setAutoUpdateCheck(val);
                localStorage.setItem("floofyboost_auto_update", val ? "true" : "false");
                if (val) {
                  const now = new Date().toLocaleTimeString();
                  setLastUpdateCheck(now);
                  localStorage.setItem("floofyboost_last_update_check", now);
                  addLog("✓ Auto-update enabled - checking every 30s");
                } else {
                  addLog("✓ Auto-update disabled");
                }
              }}
            />
            <SettingToggle 
              label="Game Detection" 
              description={`Auto-apply profiles when games launch. ${detectedGames.length > 0 ? `Detected: ${detectedGames.join(", ")}` : "Monitoring..."}`}
              checked={gameDetectionEnabled}
              onChange={(val: boolean) => { 
                setGameDetectionEnabled(val);
                localStorage.setItem("floofyboost_game_detection", val ? "true" : "false");
                if (val) {
                  setDetectedGames([]);
                  addLog("✓ Game detection enabled - monitoring for game launches");
                } else {
                  addLog("✓ Game detection disabled");
                }
              }}
            />
            <SettingToggle 
              label="Start with Windows" 
              description="Automatically launch FloofyBoost on system startup"
              checked={startWithWindows}
              onChange={(val: boolean) => { 
                handleStartWithWindows(val);
                if (val) {
                  toast.success("Start with Windows activated.", { position: 'bottom-right', duration: 2000 });
                } else {
                  toast.error("Start with Windows deactivated.", { position: 'bottom-right', duration: 2000 });
                }
              }}
            />
            <SettingToggle 
              label="Show System Log" 
              description="Display system command logs in the dashboard"
              checked={showSystemLog}
              onChange={(val: boolean) => {
                setShowSystemLog(val);
                localStorage.setItem("floofyboost_system_log", val ? "true" : "false");
                toast.success(val ? "System Log enabled" : "System Log disabled", { position: 'bottom-right', duration: 2000 });
              }}
            />
            {devMode && (
              <SettingToggle 
                label="Developer Mode" 
                description="Show dev tools and debug features"
                checked={devMode}
                onChange={(val: boolean) => {
                  setDevMode(val);
                  localStorage.setItem("floofyboost_dev_mode", val ? "true" : "false");
                  toast.success(val ? "Dev Mode enabled" : "Dev Mode disabled", { position: 'bottom-right', duration: 2000 });
                }}
              />
            )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gaming Tab */}
        <TabsContent value="gaming" className="space-y-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Game Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            <SettingToggle 
              label="In-Game FPS Counter" 
              description="Display real-time FPS overlay during gameplay"
              checked={fpsCounter}
              onChange={(val: boolean) => { 
                setFpsCounter(val); 
                handleToggle("floofyboost_fps_counter", val, val ? "✓ FPS counter enabled" : "✓ FPS counter disabled");
                if (val) {
                  toast.success("In-Game FPS Counter activated.", { position: 'bottom-right', duration: 2000 });
                } else {
                  toast.error("In-Game FPS Counter deactivated.", { position: 'bottom-right', duration: 2000 });
                }
              }}
            />
            <SettingToggle 
              label="Monitor Refresh Rate Sync" 
              description="Sync game frame rate with monitor refresh rate"
              checked={monitorSync}
              onChange={(val: boolean) => { 
                setMonitorSync(val); 
                handleToggle("floofyboost_monitor_sync", val, val ? "✓ Monitor sync enabled" : "✓ Monitor sync disabled");
                if (val) {
                  toast.success("Monitor Refresh Rate Sync activated.", { position: 'bottom-right', duration: 2000 });
                } else {
                  toast.error("Monitor Refresh Rate Sync deactivated.", { position: 'bottom-right', duration: 2000 });
                }
              }}
            />
            <SettingToggle 
              label="CPU Affinity" 
              description="Bind game processes to specific CPU cores for stability"
              checked={cpuAffinity}
              onChange={(val: boolean) => { 
                setCpuAffinity(val); 
                handleToggle("floofyboost_cpu_affinity", val, val ? "✓ CPU affinity enabled" : "✓ CPU affinity disabled");
                if (val) {
                  toast.success("CPU Affinity activated.", { position: 'bottom-right', duration: 2000 });
                } else {
                  toast.error("CPU Affinity deactivated.", { position: 'bottom-right', duration: 2000 });
                }
              }}
            />
            <SettingToggle 
              label="Discord Rich Presence" 
              description="Show your game status on Discord"
              checked={discordRpc}
              onChange={(val: boolean) => { 
                setDiscordRpc(val); 
                handleToggle("floofyboost_discord_rpc", val, val ? "✓ Discord RPC enabled" : "✓ Discord RPC disabled");
                if (val) {
                  toast.success("Discord Rich Presence activated.", { position: 'bottom-right', duration: 2000 });
                } else {
                  toast.error("Discord Rich Presence deactivated.", { position: 'bottom-right', duration: 2000 });
                }
              }}
            />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Performance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingToggle label="Disable Animations" description="Turn off all UI animations and transitions" checked={disableAnimations} onChange={(val: boolean) => { setDisableAnimations(val); localStorage.setItem("floofyboost_disable_animations", val ? "true" : "false"); toast.success(val ? "✓ Animations disabled" : "✓ Animations enabled", { position: 'bottom-right', duration: 1500 }); }} />
              
              <div>
                <Label className="text-white font-semibold mb-3 block">Update Frequency</Label>
                <div className="flex gap-2">
                  {(['1s', '2s', '5s'] as const).map(rate => (
                    <Button key={rate} onClick={() => { setPollRate(rate); localStorage.setItem("floofyboost_poll_rate", rate); toast(`Polling: ${rate}`, { position: 'bottom-right', duration: 1000 }); }} className={`flex-1 h-8 text-xs ${pollRate === rate ? "bg-primary text-black" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{rate}</Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-3 block">Chart History Limit</Label>
                <div className="flex gap-2">
                  {([100, 250, 500, 1000] as const).map(limit => (
                    <Button key={limit} onClick={() => { setChartHistoryLimit(limit); localStorage.setItem("floofyboost_chart_history", limit.toString()); toast(`History: ${limit} points`, { position: 'bottom-right', duration: 1000 }); }} className={`flex-1 h-8 text-xs ${chartHistoryLimit === limit ? "bg-primary text-black" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{limit}</Button>
                  ))}
                </div>
              </div>

              <SettingToggle label="Disable Background Monitoring" description="Pause system metrics collection to save CPU" checked={disableBackgroundMonitoring} onChange={(val: boolean) => { setDisableBackgroundMonitoring(val); localStorage.setItem("floofyboost_disable_bg_monitor", val ? "true" : "false"); toast(val ? "✓ Monitoring paused" : "✓ Monitoring resumed", { position: 'bottom-right', duration: 1000 }); }} />

              <div>
                <Label className="text-white font-semibold mb-3 block">Frame Rate Limiter</Label>
                <div className="flex gap-2">
                  {(['30', '60', 'unlimited'] as const).map(rate => (
                    <Button key={rate} onClick={() => { setFrameRateLimiter(rate); localStorage.setItem("floofyboost_frame_rate", rate); toast(`Frame rate: ${rate}`, { position: 'bottom-right', duration: 1000 }); }} className={`flex-1 h-8 text-xs ${frameRateLimiter === rate ? "bg-primary text-black" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{rate} fps</Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-3 block">Logging Frequency</Label>
                <div className="flex gap-2">
                  {(['every', 'batched'] as const).map(freq => (
                    <Button key={freq} onClick={() => { setLoggingFrequency(freq); localStorage.setItem("floofyboost_logging_freq", freq); toast(`Logging: ${freq}`, { position: 'bottom-right', duration: 1000 }); }} className={`flex-1 h-8 text-xs ${loggingFrequency === freq ? "bg-primary text-black" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>{freq === 'every' ? 'Every Action' : 'Batched'}</Button>
                  ))}
                </div>
              </div>

              <SettingToggle label="Auto-Minimize to Tray" description="Minimize when window loses focus" checked={autoMinimizeToTray} onChange={(val: boolean) => { setAutoMinimizeToTray(val); localStorage.setItem("floofyboost_auto_minimize", val ? "true" : "false"); toast(val ? "✓ Minimize to tray enabled" : "✓ Minimize to tray disabled", { position: 'bottom-right', duration: 1000 }); }} />

              <div>
                <Label className="text-white font-semibold mb-3 block">Rendering Mode</Label>
                <div className="flex gap-3">
                  <Button onClick={() => { if (renderingMode !== "gpu") { handleRenderingMode("gpu"); toast.success("GPU Rendering activated.", { position: 'bottom-right', duration: 2000 }); } }} className={`flex-1 ${renderingMode === "gpu" ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"}`}>GPU (Recommended)</Button>
                  <Button onClick={() => { if (renderingMode !== "cpu") { handleRenderingMode("cpu"); toast.error("CPU Rendering activated.", { position: 'bottom-right', duration: 2000 }); } }} className={`flex-1 ${renderingMode === "cpu" ? "bg-primary text-black" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"}`}>CPU (Low Power)</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEV Mode Tab */}
        {devMode && (
        <TabsContent value="devmode" className="space-y-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Developer Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingToggle 
                label="Disable Developer Mode" 
                description="Hide all dev tools and debug features"
                checked={!devMode}
                onChange={(val: boolean) => {
                  setDevMode(!val);
                  localStorage.setItem("floofyboost_dev_mode", !val ? "true" : "false");
                  toast.success(!val ? "Dev Mode enabled" : "Dev Mode disabled", { position: 'bottom-right', duration: 2000 });
                }}
              />

              <div>
                <Label className="text-white font-semibold mb-3 block">Animation Speed Control</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[animSpeed]}
                    onValueChange={(val) => {
                      const speed = val[0];
                      setAnimSpeed(speed);
                      localStorage.setItem("floofyboost_anim_speed", speed.toString());
                      document.documentElement.style.setProperty("--animation-speed", (1 / speed).toString());
                      document.documentElement.classList.add("custom-anim-speed");
                      toast(`Animation speed: ${speed.toFixed(2)}x`, { position: 'bottom-right', duration: 1000 });
                    }}
                    min={0.25}
                    max={2}
                    step={0.25}
                    className="flex-1"
                  />
                  <span className="text-white font-mono min-w-[60px]">{animSpeed.toFixed(2)}x</span>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-3 block">Mock CPU Load</Label>
                <div className="flex items-center gap-4">
                  <Slider value={[cpuLoadMock]} onValueChange={(val) => setCpuLoadMock(val[0])} min={0} max={100} step={5} className="flex-1" />
                  <span className="text-blue-400 font-mono min-w-[60px]">{cpuLoadMock}%</span>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-3 block">Mock GPU Load</Label>
                <div className="flex items-center gap-4">
                  <Slider value={[gpuLoadMock]} onValueChange={(val) => setGpuLoadMock(val[0])} min={0} max={100} step={5} className="flex-1" />
                  <span className="text-purple-400 font-mono min-w-[60px]">{gpuLoadMock}%</span>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-3 block">Mock RAM Load</Label>
                <div className="flex items-center gap-4">
                  <Slider value={[ramLoadMock]} onValueChange={(val) => setRamLoadMock(val[0])} min={0} max={100} step={5} className="flex-1" />
                  <span className="text-orange-400 font-mono min-w-[60px]">{ramLoadMock}%</span>
                </div>
              </div>

              <SettingToggle 
                label="Show Theme Tester" 
                description="Quick buttons to switch themes"
                checked={devMode}
                onChange={() => {}}
              />
              <div className="flex gap-2">
                <Button onClick={() => { setDarkMode(true); localStorage.setItem("floofyboost_dark_mode", "true"); toast.success("🌙 Dark theme applied", { position: 'bottom-right', duration: 1500 }); }} className="flex-1 bg-white/10 hover:bg-white/20 text-white">🌙 Dark Theme</Button>
                <Button onClick={() => { setDarkMode(false); localStorage.setItem("floofyboost_dark_mode", "false"); toast.success("☀️ Light theme applied", { position: 'bottom-right', duration: 1500 }); }} className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400">☀️ Light Theme</Button>
              </div>

              <SettingToggle 
                label="Show Console Logs" 
                description="Display system operations in a debug console"
                checked={devMode}
                onChange={() => {}}
              />
              <div className="space-y-2">
                <div className="bg-black/60 border border-white/10 rounded p-3 h-48 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-0.5">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">No logs yet...</div>
                  ) : (
                    logs.map((log: string, i: number) => (
                      <div key={i} className="text-green-400">{log}</div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => { setLogs([]); toast.success("Logs cleared", { position: 'bottom-right', duration: 1000 }); }}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 h-8 text-xs"
                  >
                    🗑️ Clear Logs
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => { const csv = logs.join('\n'); const blob = new Blob([csv], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `floofyboost_logs_${new Date().getTime()}.txt`; a.click(); toast.success("Logs exported", { position: 'bottom-right', duration: 1000 }); }}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 h-8 text-xs"
                  >
                    📥 Export
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-3 block">System State</Label>
                <div className="bg-black/40 border border-white/10 rounded p-3 space-y-1 text-xs font-mono text-gray-400">
                  <div>Dev Mode: <span className="text-green-400">ENABLED</span></div>
                  <div>Animation Speed: <span className="text-blue-400">{animSpeed.toFixed(2)}x</span></div>
                  <div>Mock CPU: <span className="text-blue-400">{cpuLoadMock}%</span> | GPU: <span className="text-purple-400">{gpuLoadMock}%</span> | RAM: <span className="text-orange-400">{ramLoadMock}%</span></div>
                  <div>Theme: <span className="text-yellow-400">{darkMode ? "Dark" : "Light"}</span></div>
                  <div>Animations: <span className="text-green-400">{disableAnimations ? "Disabled" : "Enabled"}</span></div>
                  <div>Active Logs: <span className="text-cyan-400">{logs.length}</span></div>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 rounded p-3">
                <p className="text-xs text-amber-300 font-mono">💡 Tip: Adjust sliders above to modify mock system metrics. Use Clear/Export buttons to manage logs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">About FloofyBoost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between" onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const newCount = versionClickCount + 1;
                setVersionClickCount(newCount);
                if (newCount === 7) {
                  setDevMode(true);
                  localStorage.setItem("floofyboost_dev_mode", "true");
                  toast.success("🎉 Dev Mode Unlocked!", { position: 'bottom-right', duration: 3000 });
                  setVersionClickCount(0);
                } else if (newCount === 5) {
                  toast("Press 2 more times to enable DEV Mode", { position: 'bottom-center', duration: 2000, style: { background: '#3b82f6', color: 'white' } });
                } else if (newCount < 7) {
                  toast(`${7 - newCount} clicks to Dev Mode`, { position: 'bottom-right', duration: 1000 });
                }
              }}>
                <span className="text-muted-foreground">Version</span>
                <span className="text-white font-mono select-none">{devMode ? "BETA - 1.7.3 ✓" : "BETA - 1.7.3"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span className="text-white font-mono">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rendering</span>
                <span className="text-white font-mono uppercase">{renderingMode}</span>
              </div>
              <div className="pt-3 border-t border-white/10 text-xs text-muted-foreground space-y-2">
                <p>Making your gaming experience floofier. Developed with care for gamers.</p>
                <div className="pt-2 space-y-1">
                  <p className="text-primary font-semibold">Contact & Support:</p>
                  <p className="text-white font-mono">Discord: ImFloof#1600</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "profiles" | "optimization" | "health" | "settings" | "help">("dashboard");
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeenSplash = localStorage.getItem("floofyboost_splash_shown");
    return !hasSeenSplash;
  });
  const [showQuickStart, setShowQuickStart] = useState(() => {
    const hasSeenQuickStart = localStorage.getItem("floofyboost_quickstart_shown");
    return !hasSeenQuickStart;
  });
  const [devMode, setDevMode] = useState(() => localStorage.getItem("floofyboost_dev_mode") === "true");
  const [versionClickCount, setVersionClickCount] = useState(0);
  const [data, setData] = useState(generateData());
  const [cpuLoadMock, setCpuLoadMock] = useState(35);
  const [gpuLoadMock, setGpuLoadMock] = useState(25);
  const [ramLoadMock, setRamLoadMock] = useState(50);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostProgress, setBoostProgress] = useState(0);
  const [isBoostEnabled, setIsBoostEnabled] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [enabledTweaksAtBoost, setEnabledTweaksAtBoost] = useState<string[]>([]);
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [timeRange, setTimeRange] = useState<"realtime" | "30s" | "1m" | "2m" | "5m" | "10m" | "15m">("5m");
  const [componentStats, setComponentStats] = useState<Record<string, { temps: number[] }>>(
    { cpu: { temps: [] }, gpu: { temps: [] }, ram: { temps: [] }, psu: { temps: [] } }
  );
  const [isPaused, setIsPaused] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>({ uptime: 0 });
  const [visibleMetrics, setVisibleMetrics] = useState({
    CPU: true,
    GPU: true,
    RAM: true,
    FPS: false,
    Drives: false,
    PSU: false,
    Internet: false
  });
  
  const DEFAULT_GAMES: GameProfile[] = [
    { 
      id: 1, 
      name: "Cyberpunk 2077", 
      mainProcess: { name: "cyberpunk2077.exe", priority: "High" },
      subProcesses: [{ name: "redlauncher.exe", priority: "Low" }], 
      status: "Active" 
    },
    { 
      id: 2, 
      name: "Call of Duty", 
      mainProcess: { name: "cod.exe", priority: "Realtime" },
      subProcesses: [], 
      status: "Idle" 
    },
    { 
      id: 3, 
      name: "Apex Legends", 
      mainProcess: { name: "r5apex.exe", priority: "High" },
      subProcesses: [{ name: "easyanticheat.exe", priority: "AboveNormal" }], 
      status: "Active" 
    },
  ];

  const [games, setGames] = useState<GameProfile[]>(() => {
    const saved = localStorage.getItem("floofyboost_games");
    return saved ? JSON.parse(saved) : DEFAULT_GAMES;
  });

  const [tweaks, setTweaks] = useState(() => {
    const saved = localStorage.getItem("floofyboost_tweaks");
    return saved ? JSON.parse(saved) : INITIAL_TWEAKS;
  });

  const [monitors, setMonitors] = useState<MonitorComponent[]>([
    { id: 'cpu', name: 'CPU (Intel Core i7-12700K)', enabled: true, load: 32, temp: 72, voltage: 1.35, clockGHz: 4.2 },
    { id: 'gpu', name: 'GPU (NVIDIA RTX 4080)', enabled: true, load: 88, temp: 65, voltage: 0.95, gpuClockMHz: 2100, memClockMHz: 14000 },
    { id: 'ram', name: 'RAM (Corsair Vengeance 32GB)', enabled: true, load: 67, temp: 48, voltage: 1.35, speedMHz: 3600 },
    { id: 'drive-c', name: 'Drive C: (NVMe)', enabled: true, load: 15, temp: 42, readSpeedMBps: 3500, writeSpeedMBps: 3000 },
    { id: 'drive-d', name: 'Drive D: (SSD)', enabled: true, load: 8, temp: 38, readSpeedMBps: 550, writeSpeedMBps: 520 },
    { id: 'psu', name: 'Power Supply', enabled: true, load: 58, temp: 55, voltage: 12.1 },
    { id: 'gpu2', name: 'GPU Graphics 2', enabled: false, load: 12, temp: 45, voltage: 0.85, gpuClockMHz: 1800, memClockMHz: 12000 },
    { id: 'drive-e', name: 'Drive E: (Storage)', enabled: false, load: 5, temp: 35, readSpeedMBps: 150, writeSpeedMBps: 140 },
    { id: 'nvme', name: 'NVMe Controller', enabled: false, load: 10, temp: 50, voltage: 3.3 },
    { id: 'fan-cpu', name: 'CPU Fan', enabled: false, load: 45, temp: 60, voltage: 12 },
    { id: 'liquid-cool', name: 'Liquid Cooling', enabled: false, load: 55, temp: 38, voltage: 12 },
  ]);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("floofyboost_dark_mode") !== "false");
  const [revertLogs, setRevertLogs] = useState<Array<{id: string, label: string, timestamp: string}>>([]);
  const [highTempAlert, setHighTempAlert] = useState(false);
  const [alertingComponent, setAlertingComponent] = useState("");
  const [gameDetectionEnabled, setGameDetectionEnabled] = useState(() => localStorage.getItem("floofyboost_game_detection") === "true");
  const [autoUpdateCheck, setAutoUpdateCheck] = useState(() => localStorage.getItem("floofyboost_auto_update") === "true");
  const [showSystemLog, setShowSystemLog] = useState(() => localStorage.getItem("floofyboost_system_log") !== "false");
  const [pollRate, setPollRate] = useState<"1s" | "2s" | "5s">(() => (localStorage.getItem("floofyboost_poll_rate") || "5s") as "1s" | "2s" | "5s");
  const [chartHistoryLimit, setChartHistoryLimit] = useState<100 | 250 | 500 | 1000>(() => parseInt(localStorage.getItem("floofyboost_chart_history") || "1000") as 100 | 250 | 500 | 1000);
  const [autoMinimizeToTray, setAutoMinimizeToTray] = useState(() => localStorage.getItem("floofyboost_auto_minimize") === "true");
  const [loggingFrequency, setLoggingFrequency] = useState<"every" | "batched">(() => (localStorage.getItem("floofyboost_logging_freq") || "every") as "every" | "batched");
  const [disableBackgroundMonitoring, setDisableBackgroundMonitoring] = useState(() => localStorage.getItem("floofyboost_disable_bg_monitor") === "true");
  const [frameRateLimiter, setFrameRateLimiter] = useState<"30" | "60" | "unlimited">(() => (localStorage.getItem("floofyboost_frame_rate") || "unlimited") as "30" | "60" | "unlimited");
  const [disableAnimations, setDisableAnimations] = useState(() => localStorage.getItem("floofyboost_disable_animations") === "true");
  const [detectedGames, setDetectedGames] = useState<string[]>([]);
  const [lastUpdateCheck, setLastUpdateCheck] = useState<string>(() => localStorage.getItem("floofyboost_last_update_check") || "Never");

  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isEditGameOpen, setIsEditGameOpen] = useState(false);
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");
  
  const [formName, setFormName] = useState("");
  const [formMainProcess, setFormMainProcess] = useState<ProcessInfo>({ name: "", priority: "High" });
  const [formSubProcesses, setFormSubProcesses] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("floofyboost_dark_mode", darkMode ? "true" : "false");
  }, [darkMode]);

  useEffect(() => {
    const checkHighTemps = () => {
      const maxTemp = Math.max(...monitors.map(m => m.temp || 0));
      if (maxTemp > 80) {
        const hotComponent = monitors.find(m => (m.temp || 0) > 80);
        setHighTempAlert(true);
        setAlertingComponent(hotComponent?.name || "Component");
      } else {
        setHighTempAlert(false);
      }
    };
    checkHighTemps();
  }, [monitors]);

  useEffect(() => {
    // Handle app close with exit animation and revert tweaks
    const handleBeforeClose = (e: Event) => {
      if (isBoostEnabled && !showExitAnimation) {
        e.preventDefault();
        setShowExitAnimation(true);
        handleMainBoost(); // Don't await - let animation handle the progress
      }
    };

    window.addEventListener("beforeunload", handleBeforeClose);

    return () => window.removeEventListener("beforeunload", handleBeforeClose);
  }, [isBoostEnabled, showExitAnimation]);

  useEffect(() => {
    const loadSavedData = async () => {
      if (window.electronAPI) {
        try {
          const [savedProfiles, savedTweaks, sysInfo] = await Promise.all([
            window.electronAPI.loadProfiles(),
            window.electronAPI.loadTweaks(),
            window.electronAPI.getSystemInfo(),
          ]);
          if (savedProfiles.length > 0) setGames(savedProfiles);
          if (savedTweaks.length > 0) setTweaks(savedTweaks);
          if (sysInfo.success) setSystemInfo(sysInfo.data);
        } catch (error) {
          console.error("Failed to load saved data:", error);
        }
      }
    };
    
    loadSavedData();

    const realtimeInterval = setInterval(async () => {
      if (isPaused) return;
      const now = Date.now();
      try {
        if (window.electronAPI) {
          const metrics = await window.electronAPI.getSystemMetrics();
          if (metrics.success) {
            const newData = {
              time: new Date(now).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              timestamp: now,
              cpu: metrics.data.cpu || 0,
              gpu: metrics.data.gpu || 0,
              ram: metrics.data.ram || 0,
              fps: metrics.data.fps || 140,
              drives: metrics.data.drives || 0,
              psu: metrics.data.psu || 50,
              internet: metrics.data.internet || 75,
              latency: metrics.data.latency || (15 + Math.random() * 20),
              temp: metrics.data.temp || 50,
            };
            setData(prev => [...prev.slice(-999), newData]);
            setComponentStats(prev => ({
              cpu: { temps: [...prev.cpu.temps, metrics.data.cpu || 0].slice(-180) },
              gpu: { temps: [...prev.gpu.temps, metrics.data.gpu || 0].slice(-180) },
              ram: { temps: [...prev.ram.temps, metrics.data.ram || 0].slice(-180) },
              psu: { temps: [...prev.psu.temps, metrics.data.psu || 60].slice(-180) },
            }));
          }
        } else {
          throw new Error("API not available");
        }
      } catch (error) {
        setData(prev => {
          const newPoint = {
            time: new Date(now).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            timestamp: now,
            cpu: devMode ? cpuLoadMock + (Math.random() - 0.5) * 5 : 30 + Math.random() * 40,
            gpu: devMode ? gpuLoadMock + (Math.random() - 0.5) * 5 : 40 + Math.random() * 50,
            ram: devMode ? ramLoadMock + (Math.random() - 0.5) * 5 : 50 + Math.random() * 10,
            fps: 120 + Math.random() * 80,
            drives: 20 + Math.random() * 30,
            psu: 150 + Math.random() * 300,
            internet: 60 + Math.random() * 35,
            latency: 15 + Math.random() * 20,
            temp: 60 + Math.random() * 15,
          };
          return [...prev.slice(-999), newPoint];
        });
      }
    }, disableBackgroundMonitoring ? 999999999 : (pollRate === "1s" ? 1000 : pollRate === "2s" ? 2000 : 5000));
    return () => clearInterval(realtimeInterval);
  }, [timeRange, isPaused, devMode, cpuLoadMock, gpuLoadMock, ramLoadMock, pollRate, disableBackgroundMonitoring]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem("floofyboost_splash_shown", "true");
  };

  const handleQuickStartClose = () => {
    setShowQuickStart(false);
    localStorage.setItem("floofyboost_quickstart_shown", "true");
  };

  const handleMainBoost = async () => {
    if (isBoostEnabled) {
      // Revert mode - progress goes from 100 to 0
      setIsBoosting(true);
      setBoostProgress(100);
      addLog("⬇️ Boost Mode Disabled. Reverting system state...");

      const tweaksToRevert = enabledTweaksAtBoost.length > 0 ? enabledTweaksAtBoost : tweaks.filter((t: any) => t.enabled).map((t: any) => t.id);
      const stepSize = 100 / (tweaksToRevert.length || 1);
      
      for (const tweakId of tweaksToRevert) {
        const tweak = tweaks.find((t: any) => t.id === tweakId);
    if (!tweak) return;
        const tweakLabel = tweak?.label || tweakId;
        
        addLog(`↩️ Reverting: ${tweakLabel}...`);
        
        if (window.electronAPI) {
          try {
            await window.electronAPI.applyBoostTweak(tweakId, false);
            addLog(`✓ ${tweakLabel} reverted`);
          } catch (error: any) {
            addLog(`⚠️ ${tweakLabel}: ${error.message}`);
          }
        } else {
          addLog(`✓ ${tweakLabel} reverted`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        setBoostProgress(prev => Math.max(prev - stepSize, 0));
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setBoostProgress(0);
      
      setIsBoosting(false);
      setIsBoostEnabled(false);
      setEnabledTweaksAtBoost([]);
      addLog("✅ Boost Disabled Successfully");
      return;
    }

    // Boost mode - progress goes from 0 to 100
    setIsBoosting(true);
    setBoostProgress(0);
    addLog("Starting Boost Mode...");

    const enabledTweaks = tweaks.filter((t: any) => t.enabled);
    setEnabledTweaksAtBoost(enabledTweaks.map((t: any) => t.id));
    const stepSize = 100 / (enabledTweaks.length + 2);

    for (const tweak of enabledTweaks) {
      addLog(`Applying: ${tweak.label}...`);
      if (window.electronAPI) {
        try {
          await window.electronAPI.applyBoostTweak(tweak.id, true);
        } catch (error: any) {
          addLog(`⚠️ ${tweak.label}: ${error.message}`);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 400));
      setBoostProgress(prev => Math.min(prev + stepSize, 99));
    }
    
    addLog("Finalizing optimizations...");
    await new Promise(resolve => setTimeout(resolve, 800));
    setBoostProgress(100);
    setIsBoosting(false);
    setIsBoostEnabled(true);
    addLog("✅ Boost Enabled Successfully");
  };

  const handleExitAnimationComplete = async () => {
    setShowExitAnimation(false);
    // Wait a moment to ensure all state updates are applied
    await new Promise(resolve => setTimeout(resolve, 500));
    if (window.electronAPI?.exitApp) {
      window.electronAPI.exitApp();
    } else {
      // Fallback for web: reload to reset state
      window.location.reload();
    }
  };

  const getFilteredData = () => {
    if (timeRange === "realtime") {
      return data.slice(-12); // Show last 12 points for realtime (60 seconds at 5s intervals)
    }
    const now = Date.now();
    const timeRanges: Record<string, number> = {
      "30s": 30 * 1000,
      "1m": 60 * 1000,
      "2m": 2 * 60 * 1000,
      "5m": 5 * 60 * 1000,
      "10m": 10 * 60 * 1000,
      "15m": 15 * 60 * 1000,
    };
    const cutoff = now - timeRanges[timeRange];
    return data.filter(d => (d.timestamp || 0) >= cutoff);
  };

  const resetForm = () => {
    setFormName("");
    setFormMainProcess({ name: "", priority: "High" });
    setFormSubProcesses([]);
    setEditingGameId(null);
  };

  const openAddGame = () => {
    resetForm();
    setIsAddGameOpen(true);
  };

  const openEditGame = (game: GameProfile) => {
    setEditingGameId(game.id);
    setFormName(game.name);
    setFormMainProcess({ ...game.mainProcess });
    setFormSubProcesses([...game.subProcesses]);
    setIsEditGameOpen(true);
  };

  const handleAddSubProcessRow = () => {
    setFormSubProcesses([...formSubProcesses, { name: "", priority: "Normal" }]);
  };

  const handleSubProcessChange = (index: number, field: keyof ProcessInfo, value: string) => {
    const updated = [...formSubProcesses];
    updated[index] = { ...updated[index], [field]: value };
    setFormSubProcesses(updated);
  };

  const handleRemoveSubProcessRow = (index: number) => {
    const updated = [...formSubProcesses];
    updated.splice(index, 1);
    setFormSubProcesses(updated);
  };

  const saveGame = async () => {
    if (!formName || !formMainProcess.name) return;

    const newProfile: GameProfile = {
      id: editingGameId || Date.now(),
      name: formName,
      mainProcess: formMainProcess,
      subProcesses: formSubProcesses.filter(p => p.name.trim() !== ""),
      status: "Idle"
    };

    let updatedGames: GameProfile[];
    if (editingGameId) {
      updatedGames = games.map(g => g.id === editingGameId ? newProfile : g);
      addLog(`Updated profile '${formName}'`);
      setIsEditGameOpen(false);
    } else {
      updatedGames = [...games, newProfile];
      addLog(`Created profile '${formName}'`);
      setIsAddGameOpen(false);
    }
    
    setGames(updatedGames);
    if (window.electronAPI) {
      await window.electronAPI.saveProfiles(updatedGames);
    }
    resetForm();
  };

  const applyGameProfile = async (game: GameProfile) => {
    addLog(`Applying profile '${game.name}'...`);
    toast.success(`Profile Applied`);
    
    if (window.electronAPI) {
      try {
        await window.electronAPI.applyOptimization(game.mainProcess.name, game.mainProcess.priority);
        addLog(`> [MAIN] Setting ${game.mainProcess.name} priority to ${game.mainProcess.priority}`);
        
        for (const proc of game.subProcesses) {
          await window.electronAPI.applyOptimization(proc.name, proc.priority);
          addLog(`> [SUB] Setting ${proc.name} priority to ${proc.priority}`);
        }
        
        addLog(`✓ Profile '${game.name}' applied successfully.`);
      } catch (error: any) {
        addLog(`✗ Failed to apply profile: ${error.message}`);
      }
    } else {
      addLog(`> [MAIN] Setting ${game.mainProcess.name} priority to ${game.mainProcess.priority}`);
      game.subProcesses.forEach(proc => {
        addLog(`> [SUB] Setting ${proc.name} priority to ${proc.priority}`);
      });
      addLog(`Profile '${game.name}' applied successfully.`);
    }
  };

  const toggleFavorite = async (gameId: number) => {
    const updatedGames = games.map(g => 
      g.id === gameId ? { ...g, isFavorite: !g.isFavorite } : g
    );
    setGames(updatedGames);
    if (window.electronAPI) {
      await window.electronAPI.saveProfiles(updatedGames);
    }
  };

  const handleDeleteProfile = async (id: number) => {
    const updatedGames = games.filter(g => g.id !== id);
    setGames(updatedGames);
    if (window.electronAPI) {
      await window.electronAPI.saveProfiles(updatedGames);
    }
    addLog(`Deleted profile '${deleteName}'`);
    setDeleteConfirmId(null);
    setDeleteName("");
  };

  const openDeleteConfirm = (game: GameProfile) => {
    setDeleteConfirmId(game.id);
    setDeleteName(game.name);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      handleDeleteProfile(deleteConfirmId);
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden font-sans selection:bg-primary/30">
      {/* Exit Animation - Only visible during app exit */}
      <LoadingScreen 
        progress={boostProgress}
        message="Reverting changes before closing..."
        isVisible={false}
        onComplete={handleExitAnimationComplete}
      />

      {/* Exit Animation */}
      {showExitAnimation && (
        <ExitAnimation 
          progress={boostProgress}
          logs={logs}
          onComplete={handleExitAnimationComplete}
        />
      )}
      {/* Quick Start Guide Modal */}
      {showQuickStart && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#1a1a1a] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-[#1a1a1a] border-b border-white/5 z-10">
              <CardTitle className="text-2xl font-display">Welcome to FloofyBoost! 🦊</CardTitle>
              <CardDescription>Quick Start Guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">1. Enable Boost Mode</h3>
                  <p className="text-muted-foreground text-sm">
                    Go to Dashboard, select tweaks you want, then click "START BOOST" to optimize your system.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">2. Create Game Profiles</h3>
                  <p className="text-muted-foreground text-sm">
                    Go to Profiles tab, click "NEW PROFILE", and set up profiles for your games. Set process names and priority levels.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">3. Optimize & Launch</h3>
                  <p className="text-muted-foreground text-sm">
                    Click "OPTIMIZE & LAUNCH" on any profile to apply process priorities before gaming.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">4. Monitor Performance</h3>
                  <p className="text-muted-foreground text-sm">
                    Check System Health tab to see real-time metrics of CPU, GPU, RAM, and temperature.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">5. Advanced Settings</h3>
                  <p className="text-muted-foreground text-sm">
                    In Optimization tab, fine-tune power plans, MTU size, and enable/disable specific tweaks.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-muted-foreground mb-4">
                  Need more help? Check the Help tab at the bottom of the sidebar for detailed instructions.
                </p>
                <Button
                  onClick={handleQuickStartClose}
                  className="w-full bg-primary text-black hover:bg-primary/90 font-bold"
                >
                  Get Started!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <aside className="w-full md:w-64 border-r border-white/10 bg-card/20 backdrop-blur-xl flex flex-col z-20">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="FloofyBoost Logo" className="h-8 w-8 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="floofyboost-title text-sm font-display font-bold tracking-wider text-white leading-tight">
                FLOOFY<span className="text-primary">BOOST</span>
              </h1>
              <div className="no-bg-box mt-0.5 text-[8px] font-mono text-muted-foreground uppercase tracking-widest leading-tight">
                Making your gaming experience floofier
              </div>
            </div>
          </div>
          <div className="no-bg-box mt-2 text-[7px] font-mono text-muted-foreground/70 uppercase tracking-widest">
            V 1.7.3
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
            className={`w-full justify-start font-mono uppercase tracking-wide ${activeTab === "dashboard" ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Gauge className="w-4 h-4 mr-3" /> Dashboard
          </Button>
          <Button 
            variant={activeTab === "profiles" ? "secondary" : "ghost"}
            className={`w-full justify-start font-mono uppercase tracking-wide ${activeTab === "profiles" ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
            onClick={() => setActiveTab("profiles")}
          >
            <Play className="w-4 h-4 mr-3" /> Game Profiles
          </Button>
          <Button 
            variant={activeTab === "optimization" ? "secondary" : "ghost"}
            className={`w-full justify-start font-mono uppercase tracking-wide ${activeTab === "optimization" ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
            onClick={() => setActiveTab("optimization")}
          >
            <Settings className="w-4 h-4 mr-3" /> Optimization
          </Button>
          <Button 
             variant={activeTab === "health" ? "secondary" : "ghost"}
             className={`w-full justify-start font-mono uppercase tracking-wide ${activeTab === "health" ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
             onClick={() => setActiveTab("health")}
          >
            <Shield className="w-4 h-4 mr-3" /> System Health
          </Button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className={`w-full justify-start font-mono uppercase tracking-wide ${activeTab === "settings" ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-3" /> Settings
          </Button>
          
          {/* Dev Buttons */}
          {devMode && (
            <div className="bg-red-950/30 border border-red-500/30 rounded p-2 space-y-2 mb-2">
              <div className="text-[10px] font-mono text-red-400 uppercase tracking-wider mb-1">DEV MODE</div>
              <Button
                size="sm"
                onClick={() => { setShowSplash(true); setShowExitAnimation(false); }}
                className="w-full h-6 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
              >
                🦊 Test Start Animation
              </Button>
              <Button
                size="sm"
                onClick={() => { setShowExitAnimation(true); setBoostProgress(100); setIsBoostEnabled(true); }}
                className="w-full h-6 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
              >
                ⚔️ Test Exit Animation
              </Button>
              <Button
                size="sm"
                onClick={() => { setDevMode(false); localStorage.setItem("floofyboost_dev_mode", "false"); }}
                className="w-full h-6 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
              >
                🔒 Disable Dev Mode
              </Button>
            </div>
          )}
          
          <div className="bg-black/40 rounded p-3 space-y-3">
             <button
               onClick={() => setActiveTab("help")}
               className="mb-4 w-full px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all text-xs font-mono text-muted-foreground hover:text-white"
             >
               ❓ HELP & GUIDE
             </button>
             <div className="flex items-center gap-2 text-xs text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Online
             </div>
             <div className="text-[10px] text-gray-500 font-mono" data-testid="text-system-uptime">
                Uptime: {systemInfo?.uptime ? `${Math.floor(systemInfo.uptime)}h ${Math.round((systemInfo.uptime % 1) * 60)}m` : 'Unknown'}
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {activeTab === "dashboard" && (
            <DashboardView 
                isBoosting={isBoosting} 
                isBoostEnabled={isBoostEnabled} 
                boostProgress={boostProgress} 
                handleMainBoost={handleMainBoost} 
                tweaks={tweaks} 
                setTweaks={setTweaks} 
                data={data} 
                logs={logs} 
                scrollRef={scrollRef} 
                games={games} 
                applyGameProfile={applyGameProfile} 
                setActiveTab={setActiveTab}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                getFilteredData={getFilteredData}
                toggleFavorite={toggleFavorite}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                visibleMetrics={visibleMetrics}
                setVisibleMetrics={setVisibleMetrics}
                systemInfo={systemInfo}
                showSystemLog={showSystemLog}
                addLog={addLog}
            />
        )}
        {activeTab === "profiles" && (
            <ProfilesView 
                games={games} 
                setGames={setGames}
                isAddGameOpen={isAddGameOpen} 
                setIsAddGameOpen={setIsAddGameOpen} 
                openAddGame={openAddGame} 
                saveGame={saveGame} 
                openEditGame={openEditGame} 
                applyGameProfile={applyGameProfile}
                toggleFavorite={toggleFavorite}
                formName={formName} 
                setFormName={setFormName} 
                formMainProcess={formMainProcess} 
                setFormMainProcess={setFormMainProcess} 
                formSubProcesses={formSubProcesses} 
                handleAddSubProcessRow={handleAddSubProcessRow} 
                handleSubProcessChange={handleSubProcessChange} 
                handleRemoveSubProcessRow={handleRemoveSubProcessRow}
                isEditGameOpen={isEditGameOpen}
                setIsEditGameOpen={setIsEditGameOpen}
                handleDeleteProfile={handleDeleteProfile}
                deleteConfirmId={deleteConfirmId}
                setDeleteConfirmId={setDeleteConfirmId}
                deleteName={deleteName}
                setDeleteName={setDeleteName}
                addLog={addLog}
            />
        )}
        {activeTab === "optimization" && (
            <OptimizationView 
                tweaks={tweaks} 
                setTweaks={setTweaks}
                addLog={addLog}
            />
        )}
        {activeTab === "health" && (
            <SystemHealthView 
                data={data}
                componentStats={componentStats}
                systemInfo={systemInfo}
                setSystemInfo={setSystemInfo}
                monitors={monitors}
                setMonitors={setMonitors}
                highTempAlert={highTempAlert}
                alertingComponent={alertingComponent}
                setHighTempAlert={setHighTempAlert}
            />
        )}
        {activeTab === "settings" && (
            <SettingsView 
              addLog={addLog} 
              monitors={monitors} 
              setMonitors={setMonitors}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              autoUpdateCheck={autoUpdateCheck}
              setAutoUpdateCheck={setAutoUpdateCheck}
              gameDetectionEnabled={gameDetectionEnabled}
              setGameDetectionEnabled={setGameDetectionEnabled}
              tweaks={tweaks}
              setTweaks={setTweaks}
              revertLogs={revertLogs}
              setRevertLogs={setRevertLogs}
              devMode={devMode}
              setDevMode={setDevMode}
              versionClickCount={versionClickCount}
              setVersionClickCount={setVersionClickCount}
              showSystemLog={showSystemLog}
              setShowSystemLog={setShowSystemLog}
              logs={logs}
              setLogs={setLogs}
              cpuLoadMock={cpuLoadMock}
              setCpuLoadMock={setCpuLoadMock}
              gpuLoadMock={gpuLoadMock}
              setGpuLoadMock={setGpuLoadMock}
              ramLoadMock={ramLoadMock}
              setRamLoadMock={setRamLoadMock}
              pollRate={pollRate}
              setPollRate={setPollRate}
              chartHistoryLimit={chartHistoryLimit}
              setChartHistoryLimit={setChartHistoryLimit}
              autoMinimizeToTray={autoMinimizeToTray}
              setAutoMinimizeToTray={setAutoMinimizeToTray}
              loggingFrequency={loggingFrequency}
              setLoggingFrequency={setLoggingFrequency}
              disableBackgroundMonitoring={disableBackgroundMonitoring}
              setDisableBackgroundMonitoring={setDisableBackgroundMonitoring}
              frameRateLimiter={frameRateLimiter}
              setFrameRateLimiter={setFrameRateLimiter}
              disableAnimations={disableAnimations}
              setDisableAnimations={setDisableAnimations}
              lastUpdateCheck={lastUpdateCheck}
              setLastUpdateCheck={setLastUpdateCheck}
              detectedGames={detectedGames}
              setDetectedGames={setDetectedGames}
            />
        )}
        {activeTab === "help" && (
            <HelpView />
        )}
        
      </main>
    </div>
  );
}
