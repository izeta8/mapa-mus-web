import { HeroSection } from "./components/HeroSection";
import { OrganizerSection } from "./components/OrganizerSection";

export default function HomePage() {
  return (
    <div className="w-full bg-[#F7F7F7] text-[#1F1F1F] font-sans selection:bg-[#33AD6A]/20 selection:text-[#288A56]">
      <HeroSection />
      <OrganizerSection />
    </div>
  );
}