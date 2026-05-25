'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrganizer } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
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

interface EditOrganizerFormProps {
  initialData: {
    name: string;
    slug: string;
    address: string | null;
    contacts: unknown;
    latitude: number | null;
    longitude: number | null;
    logo_url: string | null;
  };
}

export function EditOrganizerForm({ initialData }: EditOrganizerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug);
  const [address, setAddress] = useState(initialData.address || "");
  const [latitude, setLatitude] = useState<number | null>(initialData.latitude);
  const [longitude, setLongitude] = useState<number | null>(initialData.longitude);

  // Avatar / Logo State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData.logo_url);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Contacts mapping
  const mappedContacts = (initialData.contacts as ContactForm[])?.map((c) => ({
    name: c.name || "",
    phone: c.phone || "",
    is_whatsapp: c.is_whatsapp ?? true,
    instagram: c.instagram || "",
    facebook: c.facebook || "",
    email: c.email || "",
    description: c.description || "",
  })) || [];

  const [contacts, setContacts] = useState<ContactForm[]>(mappedContacts);

  // Submit Form
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
      let uploadedLogoUrl: string | null = logoPreview;

      // Handle Logo Upload if new file exists
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
              toast.error("Error al subir el logo, se continuará con el anterior o sin él.");
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

      const res = await updateOrganizer({
        name,
        slug,
        address,
        contacts: validContacts,
        latitude,
        longitude,
        logoUrl: uploadedLogoUrl,
      });

      if (res.success) {
        toast.success("¡Perfil actualizado correctamente!");
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al actualizar el perfil.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm">
      
      {/* Section: General info */}
      <div className="space-y-6">
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
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            placeholder="Nombre de tu bar o entidad organizadora"
            className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
            Enlace Personalizado <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-xs font-semibold text-neutral-400 select-none font-sans">
              mapamus.site/organizador/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              disabled={isPending}
              placeholder=""
              className="w-full h-11 pl-[150px] pr-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white font-mono"
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
      <div className="space-y-4">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
          Contactos
        </label>
        <ContactEditor 
          contacts={contacts} 
          onContactsChange={setContacts} 
          isPending={isPending} 
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Guardar cambios"
        )}
      </button>
    </form>
  );
}
