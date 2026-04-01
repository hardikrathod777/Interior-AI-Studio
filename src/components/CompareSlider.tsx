import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";

interface CompareSliderProps {
  original: string;
  reimagined: string;
  className?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  original,
  reimagined,
  className,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-2xl cursor-col-resize select-none border border-white/10 shadow-2xl",
        className
      )}
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onMouseDown={handleMove}
      onTouchMove={handleMove}
    >
      {/* Reimagined Image (Background) */}
      <img
        src={reimagined}
        alt="Reimagined"
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />

      {/* Original Image (Foreground with Clip) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={original}
          alt="Original"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-neutral-400 rounded-full" />
            <div className="w-0.5 h-3 bg-neutral-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full pointer-events-none">
        Original
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full pointer-events-none">
        Reimagined
      </div>
    </div>
  );
};
