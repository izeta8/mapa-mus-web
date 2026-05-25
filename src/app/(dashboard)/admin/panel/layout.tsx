import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarLayout } from "./components/SidebarLayout";

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
    <SidebarLayout orgName={org?.name || null}>
      {children}
    </SidebarLayout>
  );
}


