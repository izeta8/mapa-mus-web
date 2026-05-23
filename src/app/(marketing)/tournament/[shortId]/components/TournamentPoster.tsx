import { Trophy } from 'lucide-react';

interface TournamentPosterProps {
  name: string;
  posterUrl?: string | null;
}

export function TournamentPoster({ name, posterUrl }: TournamentPosterProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white border border-[#EAEAEA] shadow-md">
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt={`Póster del torneo ${name}`}
          className="w-full h-auto block"
        />
      ) : (
        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center p-6 text-neutral-400 bg-[#F7F7F7]">
          <Trophy className="w-16 h-16 mb-2 text-[#737373]/30" />
          <span className="text-sm font-medium text-[#737373]">Sin póster disponible</span>
        </div>
      )}
    </div>
  );
}
