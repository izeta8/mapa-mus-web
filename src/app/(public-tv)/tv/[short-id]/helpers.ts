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
  } else if (!isBye && containerHeight) {
    // Both width and height constraints
    const availableWidth = containerWidth - (itemsPerRow * gap) - (gap * 2);
    const maxCardWidthByWidth = availableWidth / itemsPerRow;

    // Card has aspect-3/2, so height = width / 1.5
    const availableHeight = containerHeight - (rows * gap) - (gap * 2);
    const maxCardHeight = availableHeight / rows;
    const maxCardWidthByHeight = maxCardHeight * 1.5;

    cardWidth = Math.min(maxCardWidthByWidth, maxCardWidthByHeight);
  } else {
    const availableWidth = containerWidth - (itemsPerRow * gap) - (gap * 2);
    cardWidth = Math.max(80, Math.min(280, Math.floor(availableWidth / itemsPerRow)));
  }
  
  let widthClass = "w-24";
  if (cardWidth <= 80) widthClass = "w-16";
  else if (cardWidth <= 100) widthClass = "w-20";
  else if (cardWidth <= 120) widthClass = "w-24";
  else if (cardWidth <= 140) widthClass = "w-28";
  else if (cardWidth <= 160) widthClass = "w-32";
  else if (cardWidth <= 180) widthClass = "w-36";
  else if (cardWidth <= 200) widthClass = "w-40";
  else if (cardWidth <= 220) widthClass = "w-44";
  else if (cardWidth <= 240) widthClass = "w-48";
  else if (cardWidth <= 260) widthClass = "w-52";
  else if (cardWidth <= 280) widthClass = "w-56";
  else if (cardWidth <= 320) widthClass = "w-64";
  else if (cardWidth <= 380) widthClass = "w-72";
  else widthClass = "w-80";
  
  const sizes = {
    "w-16": { num: "text-xs", mesa: "text-[9px]", vs: "text-[8px]", badge: "text-[8px]", px: "px-1", py: "py-0.5" },
    "w-20": { num: "text-sm", mesa: "text-[10px]", vs: "text-[9px]", badge: "text-[9px]", px: "px-1.5", py: "py-1" },
    "w-24": { num: "text-base", mesa: "text-xs", vs: "text-xs", badge: "text-xs", px: "px-2", py: "py-1.5" },
    "w-28": { num: "text-lg", mesa: "text-sm", vs: "text-xs", badge: "text-sm", px: "px-3", py: "py-2" },
    "w-32": { num: "text-xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2.5" },
    "w-36": { num: "text-2xl", mesa: "text-lg", vs: "text-base", badge: "text-lg", px: "px-5", py: "py-3" },
    "w-40": { num: "text-3xl", mesa: "text-xl", vs: "text-lg", badge: "text-xl", px: "px-6", py: "py-4" },
    "w-44": { num: "text-4xl", mesa: "text-2xl", vs: "text-xl", badge: "text-2xl", px: "px-7", py: "py-4.5" },
    "w-48": { num: "text-4xl", mesa: "text-2xl", vs: "text-xl", badge: "text-2xl", px: "px-8", py: "py-5" },
    "w-52": { num: "text-5xl", mesa: "text-3xl", vs: "text-2xl", badge: "text-3xl", px: "px-9", py: "py-5.5" },
    "w-56": { num: "text-5xl", mesa: "text-3xl", vs: "text-2xl", badge: "text-3xl", px: "px-10", py: "py-6" },
    "w-64": { num: "text-6xl", mesa: "text-4xl", vs: "text-3xl", badge: "text-4xl", px: "px-12", py: "py-8" },
    "w-72": { num: "text-7xl", mesa: "text-5xl", vs: "text-4xl", badge: "text-5xl", px: "px-14", py: "py-10" },
    "w-80": { num: "text-8xl", mesa: "text-6xl", vs: "text-5xl", badge: "text-6xl", px: "px-16", py: "py-12" },
  };

  const size = sizes[widthClass as keyof typeof sizes] || sizes["w-24"];
  return { container: `${widthClass} ${size.px} ${size.py}`, numero: size.num, mesa: size.mesa, vs: size.vs, badge: size.badge };
}