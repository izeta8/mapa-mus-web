import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "./components/SignOutButton";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guard safety just in case
  if (!user) {
    redirect("/admin/login");
  }

  // Get organization info to show in the sidebar
  const { data: org } = await supabase
    .from("organizers")
    .select("name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex bg-[#F9F9FB]">
      <aside className="w-64 border-r bg-white p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="mb-8 border-b pb-4">
            <h2 className="text-xl font-black text-[#1F1F1F] tracking-tight">
              Mapa<span className="text-[#33AD6A]">Mus</span> <span className="text-xs font-semibold px-2 py-0.5 bg-[#33AD6A]/10 text-[#288A56] rounded-full border border-[#33AD6A]/20">Organización</span>
            </h2>
            {org && (
              <p className="text-xs text-neutral-500 font-medium mt-1 truncate">
                {org.name}
              </p>
            )}
          </div>
          
          <nav className="space-y-1">
            <Link 
              href="/admin/panel" 
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-[#F3F4F6] transition-all duration-200"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Mis Torneos
            </Link>
            <Link 
              href="/admin/panel/edit" 
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-[#F3F4F6] transition-all duration-200"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Editar Organización
            </Link>
          </nav>
        </div>

        <div className="border-t pt-4">
          <SignOutButton />
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
