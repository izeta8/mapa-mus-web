interface TournamentGameSettingsProps {
  kingsModality: "4" | "8";
  pointsModality: "20" | "30" | "40" | null;
  maxSpots: string;
  registrationDetails: string;
  isPending: boolean;
  onKingsModalityChange: (val: "4" | "8") => void;
  onPointsModalityChange: (val: "20" | "30" | "40" | null) => void;
  onMaxSpotsChange: (val: string) => void;
  onRegistrationDetailsChange: (val: string) => void;
}

const inputClass =
  "w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white";

export function TournamentGameSettings({
  kingsModality,
  pointsModality,
  maxSpots,
  registrationDetails,
  isPending,
  onKingsModalityChange,
  onPointsModalityChange,
  onMaxSpotsChange,
  onRegistrationDetailsChange,
}: TournamentGameSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Kings & Points modality toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
            Modalidad de Reyes <span className="text-red-500">*</span>
          </label>
          <div className="flex bg-neutral-50 p-1 rounded-xl border border-[#EAEAEA] gap-1">
            {(["4", "8"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onKingsModalityChange(val)}
                disabled={isPending}
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  kingsModality === val
                    ? "bg-white text-[#1F1F1F] shadow-sm border border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                A {val} Reyes
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
            Puntos por juego
          </label>
          <div className="flex bg-neutral-50 p-1 rounded-xl border border-[#EAEAEA] gap-1">
            {(["20", "30", "40", "Otro"] as const).map((pts) => {
              const isSelected = pts === "Otro" ? pointsModality === null : pointsModality === pts;
              return (
                <button
                  key={pts}
                  type="button"
                  onClick={() => onPointsModalityChange(pts === "Otro" ? null : (pts as "20" | "30" | "40"))}
                  disabled={isPending}
                  className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#1F1F1F] shadow-sm border border-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {pts === "Otro" ? "Otro" : `${pts} ptos.`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Max spots */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
          Límite de Parejas
        </label>
        <input
          type="number"
          value={maxSpots}
          onChange={(e) => onMaxSpotsChange(e.target.value)}
          disabled={isPending}
          placeholder="ej. 32 (dejar vacío si no hay límite)"
          min={2}
          className={inputClass}
        />
      </div>

      {/* Registration details */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
          Detalles de inscripción
        </label>
        <textarea
          value={registrationDetails}
          onChange={(e) => onRegistrationDetailsChange(e.target.value)}
          disabled={isPending}
          placeholder="ej. Inscripción presencial en el local el día del torneo a partir de las 10:00."
          rows={3}
          className="w-full px-4 py-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white resize-none"
        />
      </div>
    </div>
  );
}
