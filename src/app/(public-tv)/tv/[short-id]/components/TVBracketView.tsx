"use client"

import { MatchWithCouples } from "@/types";

interface Props {
  matches: MatchWithCouples[]
}

export default function TVBracketView({matches}: Props) {

  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="flex flex-col gap-2 flex-3 min-w-0">

      </div>
    </div>
  );
}