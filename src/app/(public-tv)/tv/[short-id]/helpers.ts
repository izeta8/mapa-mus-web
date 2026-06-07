import { MatchupCardStyles } from "@/types";

export function getFontSize(totalItems: number, type: "partido" | "bye", containerWidth: number, containerHeight?: number): MatchupCardStyles {
  const gap = 12;
  
  const isBye = type === "bye";
  const itemsPerRow = isBye ? 12 : Math.ceil(Math.sqrt(totalItems * 1.5));
  const rows = Math.ceil(totalItems / itemsPerRow);
  
  let cardWidth: number;
  if (isBye && containerHeight) {
    const maxRows = 2;
    const maxRowsHeight = containerHeight * 0.28;
    const actualRows = Math.min(rows, maxRows);
    const availableRowsHeight = maxRowsHeight - (actualRows * gap);
    const cardHeight = availableRowsHeight / actualRows;
    cardWidth = Math.min(110, cardHeight * 1.2);
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

  // Cap dimensions to reasonable boundaries
  if (!isBye) {
    cardWidth = Math.max(120, Math.min(500, cardWidth));
  } else {
    cardWidth = Math.max(40, Math.min(110, cardWidth));
  }

  const cardHeight = isBye ? cardWidth : cardWidth / 1.5;
  const baseFontSize = isBye ? cardWidth * 0.35 : cardWidth * 0.085;
  
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
    "w-48": { num: "text-3xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2" },
    "w-52": { num: "text-3xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2" },
    "w-56": { num: "text-4xl", mesa: "text-lg", vs: "text-sm", badge: "text-lg", px: "px-5", py: "py-2.5" },
    "w-64": { num: "text-4xl", mesa: "text-lg", vs: "text-sm", badge: "text-lg", px: "px-6", py: "py-3" },
    "w-72": { num: "text-5xl", mesa: "text-xl", vs: "text-base", badge: "text-xl", px: "px-7", py: "py-4" },
    "w-80": { num: "text-6xl", mesa: "text-2xl", vs: "text-lg", badge: "text-2xl", px: "px-8", py: "py-4" },
  };

  const size = sizes[widthClass as keyof typeof sizes] || sizes["w-24"];
  return { 
    container: `${widthClass} ${size.px} ${size.py}`, 
    numero: isBye ? (cardWidth <= 50 ? "text-sm" : cardWidth <= 64 ? "text-lg" : cardWidth <= 80 ? "text-2xl" : cardWidth <= 96 ? "text-3xl" : "text-4xl") : size.num, 
    mesa: size.mesa, 
    vs: size.vs, 
    badge: size.badge,
    cardWidth,
    cardHeight,
    baseFontSize
  };
}