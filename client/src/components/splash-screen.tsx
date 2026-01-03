import { useState, useEffect } from "react";
import logoImage from "@/assets/logo.png";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [foxPos, setFoxPos] = useState({ x: 50, y: 50 });
  const [ballPos, setBallPos] = useState({ x: 80, y: 30 });
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.02;

      // Fox chases ball in a smooth curve
      setFoxPos({
        x: 30 + Math.sin(time * 0.5) * 40,
        y: 40 + Math.cos(time * 0.3) * 30,
      });

      // Ball moves in a circular pattern
      setBallPos({
        x: 70 + Math.cos(time) * 30,
        y: 35 + Math.sin(time * 1.3) * 25,
      });

      if (time < 5) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // After 5 seconds, fade out
        setFade(false);
        setTimeout(onComplete, 1000);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0033] to-[#0a0a0a] flex flex-col items-center justify-center z-[9999] transition-opacity duration-1000 ${
        fade ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Title */}
      <div className="mb-16 text-center relative z-10">
        <h1 className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          FloofyBoost
        </h1>
        <p className="text-muted-foreground text-sm tracking-widest">GAMING OPTIMIZATION SUITE</p>
      </div>

      {/* Animation Container */}
      <div className="relative w-80 h-64 mb-16 perspective">
        {/* Ball */}
        <div
          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/50 transition-all duration-75"
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute inset-1 rounded-full bg-yellow-400/30 blur-lg" />
        </div>

        {/* Fox */}
        <div
          className="absolute w-20 h-20 transition-all duration-75"
          style={{
            left: `${foxPos.x}%`,
            top: `${foxPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={logoImage}
            alt="Floofy Fox"
            className="w-full h-full object-contain drop-shadow-2xl animate-bounce"
          />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Loading text */}
      <div className="text-center relative z-10">
        <p className="text-muted-foreground text-sm">Preparing your gaming experience...</p>
        <div className="flex gap-1 justify-center mt-4">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-100" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-200" />
        </div>
      </div>
    </div>
  );
}
