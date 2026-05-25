import { useRef } from "react";
import Image from "next/image";

interface LogoUploadProps {
  logoPreview: string | null;
  onLogoChange: (file: File) => void;
  isPending?: boolean;
}

export function LogoUpload({ logoPreview, onLogoChange, isPending }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoChange(file);
    }
  };

  return (
    <div className="space-y-2 flex flex-col items-center">
      <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
        Logo / Avatar
      </label>
      
      <div 
        onClick={() => !isPending && fileInputRef.current?.click()}
        className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#33AD6A] hover:bg-neutral-50 transition-all overflow-hidden relative group mt-1 bg-white"
      >
        {logoPreview ? (
          <>
            <Image 
              src={logoPreview} 
              alt="Preview Logo" 
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover" 
            />
            {!isPending && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <span className="text-[10px] text-white font-bold uppercase">Cambiar</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
            <svg className="w-5 h-5 mb-1 text-neutral-400 group-hover:text-[#33AD6A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[8px] font-bold uppercase tracking-wider">Subir Foto</span>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isPending}
      />
    </div>
  );
}
