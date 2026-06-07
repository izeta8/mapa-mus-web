export default function PublicTVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white text-zinc-950">
      {children}
    </div>
  );
}