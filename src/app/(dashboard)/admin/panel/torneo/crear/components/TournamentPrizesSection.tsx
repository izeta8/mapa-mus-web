import { Prize } from "@/types";

interface TournamentPrizesSectionProps {
  prizes: Prize[];
  isPending: boolean;
  onChange: (prizes: Prize[]) => void;
}

export default function TournamentPrizesSection({ prizes, isPending, onChange }: TournamentPrizesSectionProps) {
  const update = (index: number, field: keyof Prize, value: unknown) => {
    const next = [...prizes];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () =>
    onChange([...prizes, { rank: prizes.length + 1, description: "", cash: 0, tags: [] }]);

  const remove = (index: number) => onChange(prizes.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {prizes.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-neutral-100 rounded-2xl">
          <p className="text-sm text-neutral-400">Sin premios definidos.</p>
          <button type="button" onClick={add} disabled={isPending}
            className="mt-2 text-[#33AD6A] text-xs font-bold hover:underline cursor-pointer">
            Añadir el primero
          </button>
        </div>
      )}

      <div className="space-y-3">
        {prizes.map((prize, index) => (
          <div key={index} className="relative flex flex-col md:flex-row gap-3 p-4 bg-neutral-50 border border-[#EAEAEA] rounded-2xl items-start md:items-center">
            <div className="w-16 shrink-0 space-y-1">
              <label className="text-[10px] font-black text-neutral-400 uppercase">Puesto</label>
              <input type="number"
                className="w-full h-9 px-2 text-center border border-[#EAEAEA] rounded-lg text-sm font-bold bg-white focus:border-[#33AD6A] outline-none"
                value={prize.rank}
                disabled={isPending}
                onChange={(e) => update(index, "rank", parseInt(e.target.value))}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <label className="text-[10px] font-black text-neutral-400 uppercase">Descripción</label>
              <input type="text"
                placeholder="ej. Cordero + Trofeo"
                className="w-full h-9 px-3 border border-[#EAEAEA] rounded-lg text-sm bg-white focus:border-[#33AD6A] outline-none"
                value={prize.description}
                disabled={isPending}
                onChange={(e) => update(index, "description", e.target.value)}
              />
            </div>

            <div className="w-24 shrink-0 space-y-1">
              <label className="text-[10px] font-black text-neutral-400 uppercase">Metálico €</label>
              <input type="number"
                placeholder="0"
                className="w-full h-9 px-2 text-center border border-[#EAEAEA] rounded-lg text-sm font-bold text-[#33AD6A] bg-white focus:border-[#33AD6A] outline-none"
                value={prize.cash ?? 0}
                disabled={isPending}
                onChange={(e) => update(index, "cash", parseFloat(e.target.value))}
              />
            </div>

            <button type="button" onClick={() => remove(index)} disabled={isPending}
              className="shrink-0 text-[10px] text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer self-center">
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {prizes.length > 0 && (
        <button type="button" onClick={add} disabled={isPending}
          className="text-xs font-bold text-[#33AD6A] hover:text-[#288A56] hover:underline transition-colors cursor-pointer">
          + Añadir premio
        </button>
      )}
    </div>
  );
}

