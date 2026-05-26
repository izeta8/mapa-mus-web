'use server'

import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/types";
import { OrganizerSchema } from "@/lib/validations/organizer";
import { revalidatePath } from "next/cache";
import { sendTelegramNotification } from "@/lib/telegram";

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

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        role: "organizer"
      }
    }
  });

  if (error) {
    if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
      return {
        success: false,
        error: "Se han realizado demasiadas solicitudes. Por límites de la infraestructura no se pueden crear más cuentas hoy. Por favor, inténtalo de nuevo dentro de unas horas."
      };
    }
    return { success: false, error: error.message };
  }

  // Supabase returns a user with an empty identities array if the email is already registered
  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    return { success: false, error: "Este correo electrónico ya está registrado. Inicia sesión en su lugar." };
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

  // Send Telegram notification
  const telegramText = `🆕 *Nuevo Organizador Registrado*\n\n` +
    `*Nombre:* ${data.name}\n` +
    `*Slug:* ${data.slug}\n` +
    `*Email:* ${user.email}\n` +
    `*Dirección:* ${data.address || "No proporcionada"}`;

  const telegramResult = await sendTelegramNotification(telegramText);
  if (!telegramResult.success) {
    console.error("Warning: Failed to send Telegram notification for new organizer profile setup:", telegramResult.error);
  }

  revalidatePath("/admin/panel", "layout");
  revalidatePath("/admin/onboarding");

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

  revalidatePath("/admin/panel", "layout");
  revalidatePath("/admin/panel/organizador/editar");

  return { success: true };
}

export async function verifyOtpCode(formData: { email: string; token: string }) {
  const { email, token } = formData;

  if (!email || !token) {
    return { success: false, error: "El correo y el código son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    console.error("Error verifying OTP code:", error);
    return { success: false, error: "Código inválido o caducado. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/panel", "layout");
  revalidatePath("/admin/onboarding");

  return { success: true };
}

export async function requestAccountVerification() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  const { data: org, error } = await supabase
    .from("organizers")
    .select("name, is_verified, slug")
    .eq("id", user.id)
    .single();

  if (error || !org) {
    return { success: false, error: "No se encontró el perfil de organizador." };
  }

  if (org.is_verified) {
    return { success: false, error: "Tu cuenta ya está verificada." };
  }

  const text = `🔔 *Nueva Solicitud de Verificación*\n\n` +
    `*Organizador:* ${org.name}\n` +
    `*Email:* ${user.email}\n` +
    `*ID:* \`${user.id}\`\n\n` +
    `[Panel de Control](https://mapa-mus-mitm.vercel.app/organizers)`;

  const result = await sendTelegramNotification(text);
  if (!result.success) {
    console.error("Internal Telegram notification failure:", result.error);
    return {
      success: false,
      error: "Ha ocurrido un error interno. Por favor, ponte en contacto con el administrador por correo (mapamusapp@gmail.com)."
    };
  }

  return {
    success: true,
    message: "Solicitud de verificación recibida. Revisaremos tu cuenta lo antes posible."
  };
}
