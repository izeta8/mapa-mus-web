'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, FileText, UploadCloud, ArrowLeft, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { TournamentForm } from "./TournamentForm";
import { processTournamentPoster } from "@/app/actions/tournaments";
import { Contact } from "@/types/database";

interface CreateTournamentWizardProps {
  organizerName?: string;
  organizerAddress?: string;
  organizerLatitude?: number | null;
  organizerLongitude?: number | null;
  organizerContacts?: Contact[];
}

type Mode = "select" | "ai" | "manual";

const STEPS = [
  { id: 1, label: "Subiendo imagen", desc: "Enviando el cartel a nuestros servidores..." },
  { id: 2, label: "Analizando la imagen", desc: "Leyendo el texto y estructura del cartel con IA..." },
  { id: 3, label: "Extrayendo datos", desc: "Identificando fecha, ubicación, premios y reglas..." },
  { id: 4, label: "Finalizando", desc: "Creando el torneo en Mapa Mus..." }
];

export function CreateTournamentWizard({
  organizerName = "",
  organizerAddress = "",
  organizerLatitude = null,
  organizerLongitude = null,
  organizerContacts = [],
}: CreateTournamentWizardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);

  // Clean up object URL preview to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Simulate progress steps while backend processing occurs
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Por favor, selecciona un archivo de imagen válido (JPEG, PNG, WEBP, etc.)");
      return;
    }

    // Limit to 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. El límite es 10MB.");
      return;
    }

    setFile(selectedFile);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAIFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor, sube un cartel para continuar.");
      return;
    }

    setCurrentStep(0);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (caption.trim()) {
        formData.append("caption", caption.trim());
      }

      const response = await processTournamentPoster(formData);

      if (response.success && response.shortId) {
        toast.success("¡Torneo creado y procesado con éxito!");
        // Keep steps filled for UX satisfaction before redirecting
        setCurrentStep(STEPS.length - 1);
        setTimeout(() => {
          router.push(`/admin/panel/torneo/${response.shortId}/editar`);
          router.refresh();
        }, 1000);
      } else {
        toast.error(response.error || "No se pudo procesar el cartel. Prueba con otra imagen o rellénalo de forma manual.");
        setIsProcessing(false);
        setCurrentStep(0);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Error inesperado al conectar con el servidor.";
      toast.error(errorMessage);
      setIsProcessing(false);
      setCurrentStep(0);
    }
  };

  if (mode === "manual") {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={() => setMode("select")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Cambiar método de creación
          </button>
        </div>
        <TournamentForm
          mode="create"
          organizerName={organizerName}
          organizerAddress={organizerAddress}
          organizerLatitude={organizerLatitude}
          organizerLongitude={organizerLongitude}
          organizerContacts={organizerContacts}
        />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-8 shadow-sm text-center max-w-xl mx-auto my-12 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#33AD6A]/10 rounded-full flex items-center justify-center text-[#33AD6A] mb-4 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#1F1F1F]">Procesando Cartel con IA</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Analizando y extrayendo los detalles para crear tu torneo automáticamente.
          </p>
        </div>

        {/* Progress steps animation list */}
        <div className="space-y-6 text-left max-w-md mx-auto mb-8 bg-neutral-50 p-6 rounded-2xl border border-[#EAEAEA]">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isPending = idx > currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 transition-opacity duration-300 ${isPending ? "opacity-40" : "opacity-100"
                  }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-[#33AD6A] text-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 bg-[#33AD6A]/10 text-[#33AD6A] rounded-full flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-neutral-300 rounded-full flex items-center justify-center text-xs font-semibold text-neutral-400">
                      {step.id}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isActive ? "text-[#33AD6A]" : "text-[#1F1F1F]"}`}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-neutral-400">
          Esto puede tomar hasta un minuto. Por favor, no cierres esta ventana.
        </div>
      </div>
    );
  }

  if (mode === "ai") {
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setMode("select")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a selección de método
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#EAEAEA] p-8 shadow-sm">
          <div className="mb-6 border-b border-[#EAEAEA] pb-5">
            <div className="flex items-center gap-2 text-[#33AD6A] mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Asistente IA</span>
            </div>
            <h1 className="text-2xl font-black text-[#1F1F1F]">Crear con Cartel del Torneo</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Sube la imagen del cartel de tu torneo y la IA se encargará de extraer los campos por tí.
            </p>
          </div>

          <form onSubmit={handleAIFormSubmit} className="space-y-6">
            <input
              type="file"
              id="poster-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              disabled={isProcessing}
            />
            {preview ? (
              <div className="w-full flex flex-col items-center gap-3">
                <div
                  onClick={() => !isProcessing && document.getElementById("poster-upload")?.click()}
                  className="w-fit h-fit rounded-2xl border-2 border-dashed border-neutral-300 cursor-pointer hover:border-[#33AD6A] transition-all overflow-hidden relative group bg-neutral-50 shadow-sm mx-auto"
                >
                  <Image
                    src={preview}
                    alt="Poster preview"
                    width={280}
                    height={360}
                    unoptimized
                    className="max-w-[280px] max-h-[360px] w-auto h-auto block"
                    priority
                  />
                  {!isProcessing && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <span className="text-xs text-white font-bold uppercase">Cambiar Imagen</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#1F1F1F] max-w-[280px] truncate">
                    {file?.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {(file ? file.size / (1024 * 1024) : 0).toFixed(2)} MB
                  </p>
                </div>
                <label
                  htmlFor="poster-upload"
                  className="mt-1 text-xs font-bold text-[#33AD6A] hover:text-[#288A56] cursor-pointer underline transition-colors"
                >
                  Cambiar imagen
                </label>
              </div>
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-200 min-h-[260px] ${dragActive
                  ? "border-[#33AD6A] bg-[#33AD6A]/5"
                  : "border-[#EAEAEA] hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-50/50"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="poster-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#EAEAEA] text-neutral-400 mb-3">
                    <UploadCloud className="w-6 h-6 text-[#33AD6A]" />
                  </div>
                  <p className="text-sm font-bold text-[#1F1F1F]">Arrastra tu cartel aquí</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    o <span className="text-[#33AD6A] underline font-semibold">selecciona un archivo</span>
                  </p>
                  <div className="mt-3 flex flex-col items-center gap-1">
                    <span className="text-[10px] bg-[#33AD6A]/10 text-[#33AD6A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Formato vertical recomendado
                    </span>
                    <p className="text-[9px] text-neutral-400">
                      Formatos soportados: JPG, PNG, WEBP. Máx 10MB.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Additional comments/instructions */}
            <div>
              <label htmlFor="caption" className="block text-sm font-bold text-[#1F1F1F] mb-1.5">
                Instrucciones o aclaraciones (opcional)
              </label>
              <textarea
                id="caption"
                rows={3}
                className="w-full p-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all bg-neutral-50 focus:bg-white resize-none"
                placeholder="Ej: Se juega a 4 reyes y 40 tantos. Si hay algún detalle que no aparezca en el cartel, indícalo aquí..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="flex-1 h-12 border border-[#EAEAEA] hover:bg-neutral-50 text-neutral-700 font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!file}
                className="flex-1 h-12 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                Procesar con IA
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // "select" mode screen
  return (
    <div className="max-w-2xl mx-auto my-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#1F1F1F] tracking-tight">Crea un Nuevo Torneo</h1>
        <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto">
          Selecciona cómo prefieres configurar la información y el cartel de tu torneo de mus.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Assistant Option Card */}
        <div
          onClick={() => setMode("ai")}
          className="bg-white rounded-3xl border border-[#EAEAEA] hover:border-[#33AD6A] p-8 cursor-pointer transition-all duration-300 hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-[#33AD6A]/10 text-[#33AD6A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#1F1F1F] mb-2 flex items-center gap-2">
              Asistente IA
              <span className="text-[10px] bg-[#33AD6A]/10 text-[#33AD6A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Recomendado
              </span>
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              Sube el cartel o folleto en imagen. Nuestro motor de IA leerá la información (ubicación, fecha, premios, reglas, etc.) y rellenará el torneo en segundos.
            </p>
          </div>
          <div className="text-[#33AD6A] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Empezar con IA &rarr;
          </div>
        </div>

        {/* Manual Creation Option Card */}
        <div
          onClick={() => setMode("manual")}
          className="bg-white rounded-3xl border border-[#EAEAEA] hover:border-[#33AD6A] p-8 cursor-pointer transition-all duration-300 hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-neutral-100 text-neutral-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#1F1F1F] mb-2">Formulario Manual</h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              Configura paso a paso cada detalle del torneo de mus rellenando nuestro formulario guiado: reglas, premios, fecha, localización geográfica y contactos.
            </p>
          </div>
          <div className="text-neutral-600 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Rellenar formulario &rarr;
          </div>
        </div>
      </div>
    </div>
  );
}
