import { MatchupCardStyles } from "@/types";

export function getFontSize(totalItems: number, type: "partido" | "bye", containerWidth: number, containerHeight?: number): MatchupCardStyles {
  const gap = 12;
  
  const isBye = type === "bye";
  const itemsPerRow = isBye ? 12 : Math.ceil(Math.sqrt(totalItems * 1.5));
  const rows = Math.ceil(totalItems / itemsPerRow);
  
  let cardWidth: number;
  if (isBye && containerHeight) {
    const maxRows = 2;
    const maxRowsHeight = containerHeight * 0.25;
    const actualRows = Math.min(rows, maxRows);
    const availableRowsHeight = maxRowsHeight - (actualRows * gap);
    const cardHeight = availableRowsHeight / actualRows;
    cardWidth = Math.min(80, cardHeight * 1.2);
  } else {
    const availableWidth = containerWidth - (itemsPerRow * gap) - (gap * 2);
    cardWidth = Math.max(80, Math.min(280, Math.floor(availableWidth / itemsPerRow)));
  }
  
  const widthClass = cardWidth <= 80 ? "w-16" : cardWidth <= 100 ? "w-20" : cardWidth <= 120 ? "w-24" : cardWidth <= 140 ? "w-28" : cardWidth <= 160 ? "w-32" : cardWidth <= 180 ? "w-36" : cardWidth <= 200 ? "w-40" : "w-44";
  
  const sizes = {
    "w-16": { num: "text-sm", mesa: "text-[6px]", vs: "text-[4px]", badge: "text-[6px]", px: "px-1", py: "py-0.5" },
    "w-20": { num: "text-base", mesa: "text-[8px]", vs: "text-[6px]", badge: "text-[8px]", px: "px-1", py: "py-0.5" },
    "w-24": { num: "text-lg", mesa: "text-[8px]", vs: "text-[8px]", badge: "text-[8px]", px: "px-2", py: "py-0.5" },
    "w-28": { num: "text-xl", mesa: "text-[10px]", vs: "text-[8px]", badge: "text-[10px]", px: "px-2", py: "py-1" },
    "w-32": { num: "text-2xl", mesa: "text-xs", vs: "text-[10px]", badge: "text-xs", px: "px-3", py: "py-1" },
    "w-36": { num: "text-2xl", mesa: "text-sm", vs: "text-xs", badge: "text-sm", px: "px-3", py: "py-1" },
    "w-40": { num: "text-3xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2" },
    "w-44": { num: "text-4xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2" },
  };

  const size = sizes[widthClass as keyof typeof sizes] || sizes["w-24"];
  return { container: `${widthClass} ${size.px} ${size.py}`, numero: size.num, mesa: size.mesa, vs: size.vs, badge: size.badge };
}