'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setupOrganizer } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/helpers";
import { LogoUpload } from "@/app/(dashboard)/admin/components/LogoUpload";
import { MapPicker } from "@/app/(dashboard)/admin/components/MapPicker";
import { ContactEditor } from "@/app/(dashboard)/admin/components/ContactEditor";
import { toast } from "sonner";

interface ContactForm {
  name: string;
  phone: string;
  is_whatsapp: boolean;
  instagram: string;
  facebook: string;
  email: string;
  description: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Avatar / Logo State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Contacts as dynamic array
  const [contacts, setContacts] = useState<ContactForm[]>([
    { name: "", phone: "", is_whatsapp: true, instagram: "", facebook: "", email: "", description: "" }
  ]);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre del organizador es obligatorio.");
      return;
    }
    if (!slug.trim()) {
      toast.error("El enlace personalizado es obligatorio.");
      return;
    }

    // Validate contacts: if any detail is filled, name must be filled
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      const hasOtherDetails = c.phone.trim() || c.email.trim() || c.instagram.trim() || c.facebook.trim() || c.description.trim();
      if (hasOtherDetails && !c.name.trim()) {
        toast.error(`El nombre del contacto #${i + 1} es obligatorio si rellenas sus otros datos.`);
        return;
      }
    }

    // Clean up contacts by filtering out completely empty entries
    const validContacts = contacts
      .map((c) => ({
        name: c.name.trim(),
        phone: c.phone.trim() || null,
        is_whatsapp: c.is_whatsapp,
        instagram: c.instagram.trim() || null,
        facebook: c.facebook.trim() || null,
        email: c.email.trim() || null,
        description: c.description.trim() || null,
      }))
      .filter((c) => c.name);

    startTransition(async () => {
      let uploadedLogoUrl: string | null = null;

      // Handle Logo Upload if file exists
      if (logoFile) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const ext = logoFile.name.split(".").pop();
            const filePath = `${user.id}/logo-${Date.now()}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(filePath, logoFile, { cacheControl: "3600", upsert: true });

            if (uploadError) {
              console.error("Storage upload error:", uploadError);
              toast.error("Error al subir el logo, se continuará sin él.");
            } else {
              const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);
              uploadedLogoUrl = publicUrl;
            }
          }
        } catch (err) {
          console.error("Storage upload catch error:", err);
        }
      }

      const res = await setupOrganizer({
        name,
        slug,
        address,
        contacts: validContacts,
        latitude,
        longitude,
        logoUrl: uploadedLogoUrl,
      });

      if (res.success) {
        toast.success("¡Perfil creado correctamente! Redirigiendo al panel...");
        router.push("/admin/panel");
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al configurar el perfil.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] py-12 px-4 relative overflow-hidden select-none">
      {/* Background Grids & Blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#33AD6A]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm relative z-10">

        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-2xl font-black text-[#1F1F1F] mt-3">
            Configura tu Perfil
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Rellena tus datos para empezar a publicar torneos como organizador.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section: General info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b pb-1">
              Datos del Organizador
            </h3>

            {/* Avatar / Logo Upload Picker */}
            <LogoUpload
              logoPreview={logoPreview}
              onLogoChange={handleLogoChange}
              isPending={isPending}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                Nombre del Organizador <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const val = e.target.value;
                  setName(val);
                  if (!isSlugEdited) {
                    setSlug(generateSlug(val));
                  }
                }}
                disabled={isPending}
                placeholder="Nombre de tu bar o entidad organizadora"
                className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Enlace Personalizado <span className="text-red-500">*</span>
                </label>
                {isSlugEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugEdited(false);
                      setSlug(generateSlug(name));
                    }}
                    className="text-[10px] text-[#33AD6A] hover:underline font-bold"
                  >
                    Restablecer automático
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xs font-semibold text-neutral-400 select-none">
                  mapamus.site/organizador/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugEdited(true);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  disabled={isPending}
                  placeholder=""
                  className="w-full h-11 pl-[176px] pr-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white font-mono"
                  required
                />
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">
                Este será el enlace de tu perfil para compartir tus torneos directamente.
              </p>
            </div>

            {/* Address with Google Map Search */}
            <MapPicker
              address={address}
              latitude={latitude}
              longitude={longitude}
              onAddressChange={setAddress}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
              isPending={isPending}
            />
          </div>

          {/* Section: Contacts */}
          <ContactEditor
            contacts={contacts}
            onContactsChange={setContacts}
            isPending={isPending}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Confirmar y entrar al panel"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
