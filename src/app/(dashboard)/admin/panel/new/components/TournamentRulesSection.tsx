interface TournamentRulesSectionProps {
  rules: string[];
  isPending: boolean;
  onChange: (rules: string[]) => void;
}

export default function TournamentRulesSection({ rules, isPending, onChange }: TournamentRulesSectionProps) {
  const update = (index: number, value: string) => {
    const next = [...rules];
    next[index] = value;
    onChange(next);
  };

  const add = () => onChange([...rules, ""]);
  const remove = (index: number) => onChange(rules.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {rules.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-neutral-100 rounded-2xl">
          <p className="text-sm text-neutral-400">Sin reglas específicas.</p>
          <button type="button" onClick={add} disabled={isPending}
            className="mt-2 text-[#33AD6A] text-xs font-bold hover:underline cursor-pointer">
            Añadir la primera
          </button>
        </div>
      )}

      {rules.map((rule, index) => (
        <div key={index} className="flex gap-3 items-center">
          <div className="shrink-0 bg-[#33AD6A]/10 text-[#33AD6A] w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
            {index + 1}
          </div>
          <input type="text"
            placeholder="ej. Se juega a 40 tantos"
            className="flex-1 h-10 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-neutral-50 focus:bg-white transition-all"
            value={rule}
            disabled={isPending}
            onChange={(e) => update(index, e.target.value)}
          />
          <button type="button" onClick={() => remove(index)} disabled={isPending}
            className="shrink-0 text-[10px] text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer">
            ✕
          </button>
        </div>
      ))}

      {rules.length > 0 && (
        <button type="button" onClick={add} disabled={isPending}
          className="text-xs font-bold text-[#33AD6A] hover:text-[#288A56] hover:underline transition-colors cursor-pointer">
          + Añadir regla
        </button>
      )}
    </div>
  );
}
