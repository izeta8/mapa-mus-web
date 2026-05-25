'use server'

import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/types";
import { OrganizerSchema } from "@/lib/validations/organizer";

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { success: false, error: "Credenciales incorrectas o problema de inicio de sesión." };
  }

  return { success: true };
}

export async function signUp(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        role: "organizer"
      }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function setupOrganizer(formData: unknown) {
  const result = OrganizerSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const data = result.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  // Check if slug is already taken
  const { data: existingOrg } = await supabase
    .from("organizers")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();

  if (existingOrg) {
    return { success: false, error: "Este enlace de organizador ya está registrado. Elige otro." };
  }

  // Clean contacts: only map the ones with a name (which were validated)
  const cleanedContacts: Contact[] = data.contacts
    .filter((c) => c.name?.trim())
    .map((c) => ({
      name: c.name!.trim(),
      phone: c.phone?.trim() || null,
      is_whatsapp: !!c.is_whatsapp,
      instagram: c.instagram?.trim() || null,
      facebook: c.facebook?.trim() || null,
      email: c.email?.trim() || null,
      description: c.description?.trim() || null,
    }));

  const { error } = await supabase.from("organizers").insert({
    id: user.id,
    name: data.name,
    slug: data.slug,
    address: data.address,
    contacts: cleanedContacts,
    latitude: data.latitude,
    longitude: data.longitude,
    logo_url: data.logoUrl,
    is_verified: false,
  });

  if (error) {
    console.error("Error creating organizer profile:", error);
    return { success: false, error: "No se pudo guardar el perfil de organizador. Inténtalo de nuevo." };
  }

  return { success: true };
}

export async function updateOrganizer(formData: unknown) {
  const result = OrganizerSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const data = result.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  // Check if slug is already taken by another organizer
  const { data: existingOrg } = await supabase
    .from("organizers")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", user.id)
    .maybeSingle();

  if (existingOrg) {
    return { success: false, error: "Este enlace ya está registrado por otro organizador. Elige otro." };
  }

  // Clean contacts: only map the ones with a name (which were validated)
  const cleanedContacts: Contact[] = data.contacts
    .filter((c) => c.name?.trim())
    .map((c) => ({
      name: c.name!.trim(),
      phone: c.phone?.trim() || null,
      is_whatsapp: !!c.is_whatsapp,
      instagram: c.instagram?.trim() || null,
      facebook: c.facebook?.trim() || null,
      email: c.email?.trim() || null,
      description: c.description?.trim() || null,
    }));

  const { error } = await supabase
    .from("organizers")
    .update({
      name: data.name,
      slug: data.slug,
      address: data.address,
      contacts: cleanedContacts,
      latitude: data.latitude,
      longitude: data.longitude,
      logo_url: data.logoUrl,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating organizer profile:", error);
    return { success: false, error: "No se pudo actualizar el perfil de organizador. Inténtalo de nuevo." };
  }

  return { success: true };
}
