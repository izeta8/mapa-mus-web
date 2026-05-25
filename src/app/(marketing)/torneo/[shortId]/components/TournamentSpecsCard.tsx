import { Calendar, MapPin, Coins, Users } from 'lucide-react';

interface TournamentSpecsCardProps {
  formattedDate: string;
  location?: string | null;
  pricePerCouple?: number | null;
  maxSpots?: number | null;
  mapsUrl: string;
}

export function TournamentSpecsCard({
  formattedDate,
  location,
  pricePerCouple,
  maxSpots,
  mapsUrl
}: TournamentSpecsCardProps) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-sm">
      <div className="flex items-start gap-3">
        <Calendar className="w-5 h-5 text-[#33AD6A] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">Fecha y Hora</h3>
          <p className="text-sm font-semibold text-[#1F1F1F] capitalize mt-0.5">{formattedDate}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-[#33AD6A] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">Ubicación / Sede</h3>
          <p className="text-sm font-semibold text-[#1F1F1F] mt-0.5">{location || 'Por definir'}</p>
          {location && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 bg-[#F7F7F7] hover:bg-[#EAEAEA] border border-[#EAEAEA] text-xs font-bold text-[#1F1F1F] rounded-lg transition-colors shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-[#33AD6A]" />
              Ver en Maps
            </a>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Coins className="w-5 h-5 text-[#33AD6A] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">Precio de Inscripción</h3>
          <p className="text-sm font-semibold text-[#1F1F1F] mt-0.5">
            {pricePerCouple ? `${pricePerCouple}€ por pareja` : 'Gratuito'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Users className="w-5 h-5 text-[#33AD6A] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-[#737373] uppercase tracking-wider">Límite de Parejas</h3>
          <p className="text-sm font-semibold text-[#1F1F1F] mt-0.5">
            {maxSpots ? `${maxSpots} parejas máximo` : 'Sin límite'}
          </p>
        </div>
      </div>
    </div>
  );
}
