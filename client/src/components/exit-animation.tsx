import { useState, useEffect, useRef } from "react";
import logoImage from "@/assets/logo.png";

type ExitPhase = "reverting" | "holding" | "countdown" | "fadeout";

export function ExitAnimation({ 
  progress,
  logs,
  onComplete
}: { 
  progress: number;
  logs?: string[];
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<ExitPhase>("reverting");
  const [opacity, setOpacity] = useState(1);
  const [foxWave, setFoxWave] = useState(0);
  const [countdownValue, setCountdownValue] = useState(3);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  useEffect(() => {
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.02;

      if (phase === "reverting") {
        // Fox waving animation
        const waveAmount = Math.sin(time * 3) * 15;
        setFoxWave(waveAmount);

        // When progress reaches 100%, move to holding phase
        if (progress >= 100) {
          setPhase("holding");
          time = 0;
        }
      } else if (phase === "holding") {
        // Hold for 1.5 seconds before countdown
        if (time > 1.5) {
          setPhase("countdown");
          time = 0;
          setCountdownValue(3);
        }
      } else if (phase === "countdown") {
        // 3 second countdown
        const countdown = Math.max(0, 3 - Math.floor(time));
        setCountdownValue(countdown);

        if (time > 3) {
          setPhase("fadeout");
          time = 0;
        }
      } else if (phase === "fadeout") {
        // Fade to black over 3 seconds
        const fadeDuration = 3;
        setOpacity(Math.max(0, 1 - time / fadeDuration));

        if (time > fadeDuration) {
          onComplete();
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, progress, onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]"
      style={{ opacity }}
    >
      <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center px-4 space-y-6">
        {/* Fox Waving */}
        <div className="relative w-40 h-40">
          <img
            src={logoImage}
            alt="Floofy Fox Goodbye"
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{
              transform: `rotate(${foxWave}deg)`,
              transition: "transform 0.05s ease-out",
            }}
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-1">
            {phase === "reverting" && "Reverting boost tweaks before closing..."}
            {phase === "holding" && "All clean!"}
            {phase === "countdown" && `Closing in ${countdownValue}...`}
            {phase === "fadeout" && "Goodbye!"}
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            {phase === "reverting" && `${Math.round(progress)}% Complete`}
            {phase === "countdown" && "See you next time!"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Reverting Boost</span>
            <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-purple-500/40">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transition-all duration-200 rounded-full shadow-lg shadow-purple-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* System Log */}
        <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-lg p-3 h-32 overflow-y-auto">
          <div className="space-y-1 text-[11px] font-mono">
            {logs && logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="text-gray-400 italic">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">Preparing to close...</div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
