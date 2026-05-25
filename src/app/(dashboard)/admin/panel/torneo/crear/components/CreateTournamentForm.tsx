'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createTournament } from "@/app/actions/tournaments";
import { createClient } from "@/lib/supabase/client";
import { Contact, Prize } from "@/types/database";
import { MapPicker } from "@/app/(dashboard)/admin/components/MapPicker";
import { TournamentGameSettings } from "./TournamentGameSettings";
import { TournamentBasicInfoSection } from "./TournamentBasicInfoSection";
import TournamentRulesSection from "./TournamentRulesSection";
import TournamentPrizesSection from "./TournamentPrizesSection";
import TournamentContactsSection from "./TournamentContactsSection";
import FormSection from "./FormSection";

const inputClass =
  "w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white";

interface CreateTournamentFormProps {
  organizerName?: string;
  organizerAddress?: string;
  organizerLatitude?: number | null;
  organizerLongitude?: number | null;
  organizerContacts?: Contact[];
}

export function CreateTournamentForm({
  organizerName = "",
  organizerAddress = "",
  organizerLatitude = null,
  organizerLongitude = null,
  organizerContacts = [],
}: CreateTournamentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Basic info
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [pricePerCouple, setPricePerCouple] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Location
  const [location, setLocation] = useState(organizerAddress);
  const [latitude, setLatitude] = useState<number | null>(organizerLatitude);
  const [longitude, setLongitude] = useState<number | null>(organizerLongitude);

  // Game settings & inscription
  const [kingsModality, setKingsModality] = useState<"4" | "8">("4");
  const [pointsModality, setPointsModality] = useState<"20" | "30" | "40" | null>("20");
  const [maxSpots, setMaxSpots] = useState("");
  const [registrationDetails, setRegistrationDetails] = useState("");

  // Rich content (pre-loaded from org)
  const [contacts, setContacts] = useState<Contact[]>(organizerContacts);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [rules, setRules] = useState<string[]>([]);

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

    if (!posterFile) {
      toast.error("El cartel/póster del torneo es obligatorio.");
      return;
    }

    startTransition(async () => {
      // 1. Upload poster
      let uploadedPosterUrl = "";
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

      // 2. Create tournament
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
        router.push(`/admin/panel/${res.shortId}`);
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al crear el torneo.");
      }
    });
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-black text-[#1F1F1F]">
          Crea un Nuevo Torneo
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Rellena los datos para programar y publicar el torneo.
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
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/panel"
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
            ) : (
              "Crear Torneo"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
