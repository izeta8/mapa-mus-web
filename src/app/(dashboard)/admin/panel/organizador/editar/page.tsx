import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditOrganizerForm } from "./components/EditOrganizerForm";

export default async function EditOrganizerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: org } = await supabase
    .from("organizers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!org) {
    redirect("/admin/onboarding");
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-black text-[#1F1F1F]">
          Editar Organizador
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Actualiza los datos comerciales y de contacto de tu perfil de organizador.
        </p>
      </div>

      <EditOrganizerForm initialData={org} />
    </div>
  );
}
