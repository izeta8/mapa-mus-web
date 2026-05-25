'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createTournament, updateTournament, deleteTournament } from "@/app/actions/tournaments";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Contact, Prize, TournamentFull } from "@/types/database";
import { MapPicker } from "@/app/(dashboard)/admin/components/MapPicker";
import { TournamentGameSettings } from "./TournamentGameSettings";
import { TournamentBasicInfoSection } from "./TournamentBasicInfoSection";
import TournamentRulesSection from "./TournamentRulesSection";
import TournamentPrizesSection from "./TournamentPrizesSection";
import TournamentContactsSection from "./TournamentContactsSection";
import FormSection from "./FormSection";

const inputClass =
  "w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white";

interface TournamentFormProps {
  mode: "create" | "edit";
  initialTournament?: TournamentFull;
  organizerName?: string;
  organizerAddress?: string;
  organizerLatitude?: number | null;
  organizerLongitude?: number | null;
  organizerContacts?: Contact[];
}

export function TournamentForm({
  mode,
  initialTournament,
  organizerName = "",
  organizerAddress = "",
  organizerLatitude = null,
  organizerLongitude = null,
  organizerContacts = [],
}: TournamentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Helper to format ISO date to YYYY-MM-DDTHH:mm
  const formatDateTimeLocal = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Basic info
  const [name, setName] = useState(mode === "edit" ? initialTournament?.name || "" : "");
  const [date, setDate] = useState(mode === "edit" ? formatDateTimeLocal(initialTournament?.tournament_date) : "");
  const [pricePerCouple, setPricePerCouple] = useState(
    mode === "edit" ? initialTournament?.price_per_couple?.toString() ?? "0" : ""
  );
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(
    mode === "edit" ? initialTournament?.poster_url || null : null
  );

  // Location
  const [location, setLocation] = useState(
    mode === "edit" ? initialTournament?.location || "" : organizerAddress
  );
  const [latitude, setLatitude] = useState<number | null>(
    mode === "edit" ? initialTournament?.latitude ?? null : organizerLatitude
  );
  const [longitude, setLongitude] = useState<number | null>(
    mode === "edit" ? initialTournament?.longitude ?? null : organizerLongitude
  );

  // Game settings & inscription
  const [kingsModality, setKingsModality] = useState<"4" | "8">(
    mode === "edit" ? (initialTournament?.kings_modality as "4" | "8") || "4" : "4"
  );
  const [pointsModality, setPointsModality] = useState<"20" | "30" | "40" | null>(
    mode === "edit" ? (initialTournament?.points_modality as "20" | "30" | "40" | null) ?? "20" : "20"
  );
  const [maxSpots, setMaxSpots] = useState(
    mode === "edit" ? initialTournament?.max_spots?.toString() ?? "" : ""
  );
  const [registrationDetails, setRegistrationDetails] = useState(
    mode === "edit" ? (initialTournament?.registration_info as unknown as { in_person_details?: string })?.in_person_details || "" : ""
  );

  // Rich content
  const [contacts, setContacts] = useState<Contact[]>(
    mode === "edit" ? (initialTournament?.contacts as unknown as Contact[]) || [] : organizerContacts
  );
  const [prizes, setPrizes] = useState<Prize[]>(
    mode === "edit" ? (initialTournament?.prizes as unknown as Prize[]) || [] : []
  );
  const [rules, setRules] = useState<string[]>(
    mode === "edit" ? initialTournament?.rules || [] : []
  );

  const handlePosterChange = (file: File) => {
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !date || !location.trim()) {
      toast.error("Por favor, rellena todos los campos obligatorios.");
      return;
    }

    if (latitude === null || longitude === null) {
      toast.error("La dirección física con marcador en el mapa es obligatoria.");
      return;
    }

    if (pricePerCouple === "") {
      toast.error("El precio por pareja es obligatorio. Pon 0 si es gratuito.");
      return;
    }

    if (mode === "create" && !posterFile) {
      toast.error("El cartel/póster del torneo es obligatorio.");
      return;
    }

    startTransition(async () => {
      let uploadedPosterUrl = initialTournament?.poster_url || "";

      // 1. Upload poster if a new one is selected
      if (posterFile) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            toast.error("Usuario no autenticado.");
            return;
          }

          const ext = posterFile.name.split(".").pop();
          const filePath = `${user.id}/poster-${Date.now()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("posters")
            .upload(filePath, posterFile, { cacheControl: "3600", upsert: true });

          if (uploadError) {
            console.error("Storage upload error:", uploadError);
            toast.error("Error al subir el cartel. Inténtalo de nuevo.");
            return;
          }

          const { data: { publicUrl } } = supabase.storage.from("posters").getPublicUrl(filePath);
          uploadedPosterUrl = publicUrl;
        } catch (err) {
          console.error("Storage upload catch error:", err);
          toast.error("Error al subir el cartel.");
          return;
        }
      }

      // 2. Create or update tournament
      if (mode === "create") {
        const res = await createTournament({
          name,
          tournamentDate: new Date(date).toISOString(),
          location,
          pricePerCouple: parseInt(pricePerCouple, 10),
          maxSpots: maxSpots ? parseInt(maxSpots, 10) : null,
          kingsModality,
          pointsModality,
          posterUrl: uploadedPosterUrl,
          latitude,
          longitude,
          contacts,
          prizes,
          rules,
          registrationDetails,
        });

        if (res.success && res.shortId) {
          toast.success("Torneo creado con éxito.");
          router.push(`/admin/panel`);
          router.refresh();
        } else {
          toast.error(res.error || "Ocurrió un error al crear el torneo.");
        }
      } else {
        if (!initialTournament?.id) {
          toast.error("Error: ID del torneo no disponible para editar.");
          return;
        }

        const res = await updateTournament(initialTournament.id, {
          name,
          tournamentDate: new Date(date).toISOString(),
          location,
          pricePerCouple: parseInt(pricePerCouple, 10),
          maxSpots: maxSpots ? parseInt(maxSpots, 10) : null,
          kingsModality,
          pointsModality,
          posterUrl: uploadedPosterUrl,
          latitude,
          longitude,
          contacts,
          prizes,
          rules,
          registrationDetails,
        });

        if (res.success && res.shortId) {
          toast.success("Torneo actualizado con éxito.");
          router.push(`/admin/panel`);
          router.refresh();
        } else {
          toast.error(res.error || "Ocurrió un error al actualizar el torneo.");
        }
      }
    });
  };

  const handleDelete = () => {
    if (!initialTournament?.id) return;
    startTransition(async () => {
      const res = await deleteTournament(initialTournament.id);
      if (res.success) {
        toast.success("Torneo eliminado con éxito.");
        router.push("/admin/panel");
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al eliminar el torneo.");
      }
    });
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-black text-[#1F1F1F]">
          {mode === "create" ? "Crea un Nuevo Torneo" : "Editar Torneo"}
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          {mode === "create"
            ? "Rellena los datos para programar y publicar el torneo."
            : "Actualiza los datos para el torneo."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 1. Basic info: poster, name, date, price */}
        <FormSection title="Información básica">
          <TournamentBasicInfoSection
            name={name}
            date={date}
            pricePerCouple={pricePerCouple}
            organizerName={organizerName}
            isPending={isPending}
            onNameChange={setName}
            onDateChange={setDate}
            onPriceChange={setPricePerCouple}
            posterPreview={posterPreview}
            onPosterChange={handlePosterChange}
            inputClass={inputClass}
          />
        </FormSection>

        {/* 2. Location */}
        <FormSection title="Ubicación" badge="Obligatorio">
          <MapPicker
            address={location}
            latitude={latitude}
            longitude={longitude}
            onAddressChange={setLocation}
            onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
            isPending={isPending}
            required
          />
        </FormSection>

        {/* 3. Modality & inscription */}
        <FormSection title="Modalidad e Inscripción">
          <TournamentGameSettings
            kingsModality={kingsModality}
            pointsModality={pointsModality}
            maxSpots={maxSpots}
            registrationDetails={registrationDetails}
            isPending={isPending}
            onKingsModalityChange={setKingsModality}
            onPointsModalityChange={setPointsModality}
            onMaxSpotsChange={setMaxSpots}
            onRegistrationDetailsChange={setRegistrationDetails}
          />
        </FormSection>

        {/* 4. Contacts */}
        <FormSection
          title="Contactos"
          badge={contacts.length > 0 ? `${contacts.length} contacto${contacts.length !== 1 ? "s" : ""}` : undefined}
        >
          <TournamentContactsSection
            contacts={contacts}
            isPending={isPending}
            onChange={setContacts}
            inputClass={inputClass}
          />
        </FormSection>

        {/* 5. Prizes */}
        <FormSection
          title="Premios"
          badge={prizes.length > 0 ? `${prizes.length} premio${prizes.length !== 1 ? "s" : ""}` : undefined}
        >
          <TournamentPrizesSection
            prizes={prizes}
            isPending={isPending}
            onChange={setPrizes}
          />
        </FormSection>

        {/* 6. Rules */}
        <FormSection
          title="Reglas"
          badge={rules.length > 0 ? `${rules.length} regla${rules.length !== 1 ? "s" : ""}` : undefined}
        >
          <TournamentRulesSection
            rules={rules}
            isPending={isPending}
            onChange={setRules}
          />
        </FormSection>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-2">
          {/* Left: Delete Tournament (Only in Edit mode) */}
          <div>
            {mode === "edit" && initialTournament?.id && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <button
                      type="button"
                      disabled={isPending}
                      className="h-11 px-5 border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar Torneo
                    </button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar Torneo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción es permanente y no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="inline-flex items-center justify-center h-8 gap-1.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      {isPending ? "Eliminando..." : "Eliminar Torneo"}
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Right: Cancel & Update/Create */}
          <div className="flex items-center gap-3">
            <Link
              href={mode === "create" ? "/admin/panel" : `/admin/panel`}
              className="h-11 px-6 border border-[#EAEAEA] hover:bg-neutral-50 active:scale-[0.98] text-neutral-700 font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="h-11 px-8 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === "create" ? (
                "Crear Torneo"
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
