
interface SectionProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export default function FormSection({ title, badge, children }: SectionProps) {
  return (
    <div className="border border-[#EAEAEA] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-[#EAEAEA]">
        <h2 className="text-sm font-black text-[#1F1F1F] uppercase tracking-wide">{title}</h2>
        {badge && (
          <span className="text-[10px] font-bold text-neutral-400 bg-white border border-neutral-200 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}