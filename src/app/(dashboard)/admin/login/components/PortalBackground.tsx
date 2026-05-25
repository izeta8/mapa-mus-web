export function PortalBackground() {
  return (
    <>
      {/* Background Grids & Blur effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#33AD6A]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-[#33AD6A]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </>
  );
}
