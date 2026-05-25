import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ReturnHomeLink() {
  return (
    <div className="absolute top-6 left-6 z-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#737373] hover:text-[#1F1F1F] px-4 py-2 bg-white border border-[#EAEAEA] rounded-full hover:shadow-sm active:scale-[0.98] transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Salir del portal
      </Link>
    </div>
  );
}
