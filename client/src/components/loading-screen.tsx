import { useState, useEffect, useRef } from "react";
import logoImage from "@/assets/logo.png";

export function LoadingScreen({ 
  progress = 0,
  message = "Initializing FloofyBoost...",
  isVisible = true,
  onComplete
}: { 
  progress?: number;
  message?: string;
  isVisible?: boolean;
  onComplete?: () => void;
}) {
  const [animState, setAnimState] = useState({
    ballPos: { x: -300, y: -300 },
    foxPos: { y: 0, x: 0 },
    foxRotation: 0,
    tailWag: 0,
    ballVisible: true,
    textOpacity: 0,
    containerScale: 1,
    containerPos: { x: 0, y: 0 },
    bgBlur: 0,
    mistParticles: [] as Array<{id: number, x: number, y: number, scale: number, opacity: number, color: string}>,
  });

  const timeRef = useRef(0);
  const phaseRef = useRef<"initial" | "ball-flying" | "jumping" | "catching" | "sitting" | "dropping" | "vaporizing" | "text-reveal" | "zooming" | "complete">("initial");

  useEffect(() => {
    if (!isVisible) return;
    
    let animationFrame: number;

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const phase = phaseRef.current;
      let newState = { ...animState };

      if (phase === "initial") {
        const tensProgress = Math.min(time / 0.4, 1);
        newState.foxPos = { y: tensProgress * 15, x: Math.sin(tensProgress * Math.PI) * 8 };
        if (time > 0.4) {
          phaseRef.current = "ball-flying";
          timeRef.current = 0;
        }
      } 
      else if (phase === "ball-flying") {
        const progressVal = Math.min(time / 1.8, 1);
        const arcHeight = Math.sin(progressVal * Math.PI) * 150;
        newState.ballPos = { x: -300 + progressVal * 300, y: -300 + progressVal * 300 - arcHeight };
        if (progressVal >= 1) {
          phaseRef.current = "jumping";
          timeRef.current = 0;
        }
      } 
      else if (phase === "jumping") {
        const jumpProgress = Math.min(time / 0.9, 1);
        const jumpHeight = Math.sin(jumpProgress * Math.PI) * 160;
        const jumpX = Math.sin(jumpProgress * Math.PI * 2) * 20;
        newState.tailWag = Math.sin(jumpProgress * Math.PI * 4) * 25;
        newState.foxRotation = Math.sin(jumpProgress * Math.PI) * 8;
        newState.foxPos = { y: -jumpHeight, x: jumpX };
        
        if (jumpProgress >= 0.45 && jumpProgress < 0.55) {
          newState.ballVisible = false;
        }
        if (jumpProgress >= 1) {
          phaseRef.current = "catching";
          timeRef.current = 0;
        }
      } 
      else if (phase === "catching") {
        const landProgress = Math.min(time / 0.5, 1);
        newState.foxPos = { y: -160 + landProgress * 160, x: 0 };
        newState.foxRotation = 0;
        newState.tailWag = 0;
        if (landProgress >= 1) {
          phaseRef.current = "sitting";
          timeRef.current = 0;
        }
      }
      else if (phase === "sitting") {
        if (time < 0.5) {
          newState.tailWag = Math.sin(time * Math.PI * 3) * 8;
        }
        if (time > 1.5) {
          phaseRef.current = "dropping";
          timeRef.current = 0;
          newState.tailWag = 0;
        }
      }
      else if (phase === "dropping") {
        const dropProgress = Math.min(time / 0.6, 1);
        const bounce = Math.sin(dropProgress * Math.PI) * 20;
        newState.ballVisible = true;
        newState.ballPos = { x: 0, y: 50 + dropProgress * 80 - bounce };
        if (dropProgress >= 1) {
          phaseRef.current = "vaporizing";
          timeRef.current = 0;
        }
      }
      else if (phase === "vaporizing") {
        const vaporProgress = Math.min(time / 1.2, 1);
        if (vaporProgress < 0.3) {
          const particles = Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 150;
            const colors = ["#a855f7", "#ec4899", "#f43f5e", "#8b5cf6", "#d946ef"];
            return {
              id: i,
              x: Math.cos(angle) * distance * (vaporProgress / 0.3),
              y: Math.sin(angle) * distance * (vaporProgress / 0.3),
              scale: 1 + vaporProgress / 0.3 * 2,
              opacity: 1 - vaporProgress / 0.3 * 0.5,
              color: colors[i % colors.length],
            };
          });
          newState.mistParticles = particles;
          newState.ballVisible = false;
        }
        if (vaporProgress >= 1) {
          phaseRef.current = "text-reveal";
          timeRef.current = 0;
        }
      }
      else if (phase === "text-reveal") {
        const textProgress = Math.min(time / 0.8, 1);
        newState.textOpacity = Math.pow(textProgress, 2);
        if (textProgress >= 1) {
          phaseRef.current = "zooming";
          timeRef.current = 0;
        }
      }
      else if (phase === "zooming") {
        if (time > 1) {
          const zoomProgress = Math.min((time - 1) / 1.2, 1);
          newState.containerScale = 1 - zoomProgress * 0.85;
          newState.containerPos = { x: -280 * zoomProgress, y: -240 * zoomProgress };
          newState.bgBlur = zoomProgress * 0;
          if (zoomProgress >= 1) {
            phaseRef.current = "complete";
            timeRef.current = 0;
          }
        }
      }
      else if (phase === "complete") {
        if (time > 0.5 && onComplete) {
          onComplete();
          return;
        }
      }

      setAnimState(newState);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const colors = ["#a855f7", "#ec4899", "#f43f5e", "#8b5cf6", "#d946ef", "#f97316"];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #2d1b69 25%, #3b1a6f 50%, #4c1a5e 75%, #2d1b4b 100%)",
        filter: `blur(${animState.bgBlur}px)`,
        transition: "filter 0.3s ease-out",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-pink-500/10 animate-pulse" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}} />
      </div>

      <div
        style={{
          transform: `scale(${animState.containerScale}) translate(${animState.containerPos.x}px, ${animState.containerPos.y}px)`,
          transition: "transform 0.05s ease-out",
        }}
      >
        <div className="relative w-80 h-80 flex items-center justify-center mb-12">
          {animState.ballVisible && (
            <div
              className="absolute w-10 h-10 rounded-full"
              style={{
                left: `calc(50% + ${animState.ballPos.x}px)`,
                top: `calc(50% + ${animState.ballPos.y}px)`,
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle at 30% 30%, rgba(220, 38, 38, 1), rgba(139, 0, 0, 1))",
                boxShadow: "0 0 40px rgba(220, 38, 38, 0.9), 0 0 80px rgba(220, 38, 38, 0.5), inset 0 0 20px rgba(255, 100, 100, 0.4)",
              }}
            />
          )}

          {animState.mistParticles.map((particle) => (
            <div
              key={particle.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${particle.x}px), calc(-50% + ${particle.y}px)) scale(${particle.scale})`,
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 30%, ${particle.color}80, ${particle.color}20)`,
                filter: `blur(16px)`,
                opacity: particle.opacity,
                boxShadow: `0 0 30px ${particle.color}`,
              }}
            />
          ))}

          <div
            className="relative w-48 h-48"
            style={{
              transform: `translateY(${animState.foxPos.y}px) translateX(${animState.foxPos.x}px) rotateZ(${animState.foxRotation}deg)`,
              transition: "none",
            }}
          >
            <img
              src={logoImage}
              alt="FloofyBoost Fox"
              className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
            />
          </div>
        </div>

        <div
          className="flex gap-0 justify-center items-center mb-6 h-16"
          style={{ opacity: animState.textOpacity }}
        >
          {["F", "L", "O", "O", "F", "Y", "B", "O", "O", "S", "T"].map((letter, i) => (
            <span
              key={i}
              className="text-5xl font-display font-black"
              style={{
                background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 20px ${colors[i % colors.length]})`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          className="text-purple-300 text-sm font-light tracking-widest text-center"
          style={{ opacity: animState.textOpacity, animation: "pulse 2s ease-in-out infinite" }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
