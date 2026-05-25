import Link from "next/link";
import { CreateTournamentForm } from "./components/CreateTournamentForm";
import { createClient } from "@/lib/supabase/server";
import { Contact } from "@/types/database";

export default async function NewTournamentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let organizerName = "";
  let organizerAddress = "";
  let organizerLatitude: number | null = null;
  let organizerLongitude: number | null = null;
  let organizerContacts: Contact[] = [];

  if (user) {
    const { data: organizer } = await supabase
      .from("organizers")
      .select("name, address, latitude, longitude, contacts")
      .eq("id", user.id)
      .maybeSingle();

    if (organizer) {
      organizerName = organizer.name || "";
      organizerAddress = organizer.address || "";
      organizerLatitude = organizer.latitude || null;
      organizerLongitude = organizer.longitude || null;
      organizerContacts = Array.isArray(organizer.contacts) ? (organizer.contacts as Contact[]) : [];
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/admin/panel"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Mis Torneos
        </Link>
      </div>

      <CreateTournamentForm 
        organizerName={organizerName} 
        organizerAddress={organizerAddress} 
        organizerLatitude={organizerLatitude}
        organizerLongitude={organizerLongitude}
        organizerContacts={organizerContacts}
      />
    </div>
  );
}
