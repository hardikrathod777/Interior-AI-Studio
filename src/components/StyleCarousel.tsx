import React from "react";
import { motion } from "motion/react";
import { DesignStyle, DESIGN_STYLES } from "@/src/services/geminiService";
import { cn } from "@/src/lib/utils";

interface StyleCarouselProps {
  selectedStyleId: string | null;
  onSelectStyle: (style: DesignStyle) => void;
  disabled?: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  selectedStyleId,
  onSelectStyle,
  disabled,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-4 px-2">
        {DESIGN_STYLES.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectStyle(style)}
            disabled={disabled}
            className={cn(
              "shrink-0 w-48 p-4 rounded-xl border transition-all text-left",
              selectedStyleId === style.id
                ? "bg-white border-black text-black shadow-lg"
                : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <h3 className="font-semibold text-sm mb-1">{style.name}</h3>
            <p className="text-[10px] leading-tight opacity-70 line-clamp-2">
              {style.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
