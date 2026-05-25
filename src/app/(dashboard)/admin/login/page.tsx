'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login, signUp } from "@/app/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, rellena todos los campos.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    startTransition(async () => {
      if (isLogin) {
        // Sign In Flow
        const res = await login({ email, password });
        if (res.success) {
          toast.success("Sesión iniciada con éxito.");
          router.push("/admin/panel");
          router.refresh();
        } else {
          toast.error(res.error || "Error al iniciar sesión.");
        }
      } else {
        // Sign Up Flow
        const res = await signUp({ email, password });
        if (res.success) {
          toast.success("Cuenta creada con éxito.");
          // Sign up redirects automatically via session checking or we can push to onboarding
          router.push("/admin/onboarding");
          router.refresh();
        } else {
          toast.error(res.error || "Error al registrar la cuenta.");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4 relative overflow-hidden select-none">
      {/* Background Grids & Blur effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#33AD6A]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-[#33AD6A]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm relative z-10 transition-all duration-300">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#1F1F1F]">
            Mapa<span className="text-[#33AD6A]">Mus</span>
          </h1>
          <p className="text-neutral-500 font-semibold text-xs mt-1 uppercase tracking-wider">
            Portal de Hostelería
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-100 mb-6 p-1 bg-neutral-50 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            disabled={isPending}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isLogin
                ? "bg-white text-[#1F1F1F] shadow-sm border border-neutral-100"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            disabled={isPending}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              !isLogin
                ? "bg-white text-[#1F1F1F] shadow-sm border border-neutral-100"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="ejemplo@bar.com"
              className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="••••••••"
              className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
                placeholder="••••••••"
                className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isLogin ? (
              "Acceder al Panel"
            ) : (
              "Registrar Cuenta"
            )}
          </button>
        </form>

        {isLogin ? (
          <p className="text-xs text-center text-neutral-400 mt-6 font-semibold">
            ¿Quieres publicar tus torneos? Regístrate gratis en segundos.
          </p>
        ) : (
          <p className="text-xs text-center text-neutral-400 mt-6 font-semibold">
            Al registrarte aceptas que solo publicarás torneos de mus reales.
          </p>
        )}

      </div>
    </div>
  );
}