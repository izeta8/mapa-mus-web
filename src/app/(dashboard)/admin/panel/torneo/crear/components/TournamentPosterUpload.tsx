import { useRef } from "react";
import Image from "next/image";

interface TournamentPosterUploadProps {
  posterPreview: string | null;
  onPosterChange: (file: File) => void;
  isPending: boolean;
}

export function TournamentPosterUpload({
  posterPreview,
  onPosterChange,
  isPending,
}: TournamentPosterUploadProps) {
  const posterInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPosterChange(file);
    }
  };

  return (
    <div className="space-y-2 flex flex-col items-center border-b pb-6">
      <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
        Cartel / Póster del Torneo <span className="text-red-500">*</span>
      </label>
      
      <div 
        onClick={() => !isPending && posterInputRef.current?.click()}
        className="w-64 h-80 rounded-2xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#33AD6A] hover:bg-neutral-50 transition-all overflow-hidden relative group mt-1 bg-neutral-50 shadow-sm"
      >
        {posterPreview ? (
          <>
            <Image 
              src={posterPreview} 
              alt="Cartel del torneo" 
              fill
              unoptimized
              className="object-cover" 
            />
            {!isPending && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <span className="text-xs text-white font-bold uppercase">Cambiar Imagen</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
            <svg className="w-10 h-10 mb-3 text-neutral-400 group-hover:text-[#33AD6A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Subir Cartel</span>
            <span className="text-[9px] text-neutral-400 mt-2 font-medium leading-normal">Obligatorio. Formato vertical recomendado (PNG, JPG)</span>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={posterInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isPending}
      />
    </div>
  );
}
