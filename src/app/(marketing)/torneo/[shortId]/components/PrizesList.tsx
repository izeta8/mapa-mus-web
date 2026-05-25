import { Award } from 'lucide-react';
import { Prize } from '@/types';

interface PrizesListProps {
  prizes: Prize[];
}

export function PrizesList({ prizes }: PrizesListProps) {
  if (prizes.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F1F1F] mb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-[#33AD6A]" />
        Premios del Torneo
      </h2>
      <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EAEAEA] bg-[#F7F7F7]">
              <th className="p-4 text-xs font-bold text-[#737373] uppercase tracking-wider w-24">Posición</th>
              <th className="p-4 text-xs font-bold text-[#737373] uppercase tracking-wider">Descripción</th>
              <th className="p-4 text-xs font-bold text-[#737373] uppercase tracking-wider text-right">Efectivo</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((prize: Prize, idx: number) => (
              <tr key={idx} className="border-b border-[#EAEAEA] hover:bg-[#F7F7F7]/30 last:border-b-0 transition-colors">
                <td className="p-4 text-sm font-bold text-[#288A56]">
                  #{prize.rank || idx + 1}
                </td>
                <td className="p-4 text-sm text-[#1F1F1F]">
                  <span className="font-medium">{prize.description || '-'}</span>
                </td>
                <td className="p-4 text-sm font-extrabold text-[#1F1F1F] text-right">
                  {prize.cash ? `${prize.cash}€` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
