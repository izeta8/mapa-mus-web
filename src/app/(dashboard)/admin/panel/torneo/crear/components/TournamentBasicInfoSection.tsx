import Field from "@/components/ui/custom/Field";
import { TournamentPosterUpload } from "./TournamentPosterUpload";

interface TournamentBasicInfoSectionProps {
  name: string;
  date: string;
  pricePerCouple: string;
  organizerName?: string;
  isPending: boolean;
  onNameChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  posterPreview: string | null;
  onPosterChange: (file: File) => void;
  inputClass: string,
}

export function TournamentBasicInfoSection({
  name,
  date,
  pricePerCouple,
  organizerName,
  isPending,
  onNameChange,
  onDateChange,
  onPriceChange,
  posterPreview,
  onPosterChange,
  inputClass,
}: TournamentBasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <TournamentPosterUpload
        posterPreview={posterPreview}
        onPosterChange={onPosterChange}
        isPending={isPending}
      />

      <Field label="Nombre del Torneo" required>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={isPending}
          placeholder={organizerName ? `Torneo de Mus de ${organizerName}` : "Nombre del torneo"}
          className={inputClass}
          required
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Fecha y Hora" required>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            disabled={isPending}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Precio por pareja (€)" required>
          <input
            type="number"
            value={pricePerCouple}
            onChange={(e) => onPriceChange(e.target.value)}
            disabled={isPending}
            placeholder="ej. 20"
            min={0}
            className={inputClass}
            required
          />
        </Field>
      </div>
    </div>
  );
}
