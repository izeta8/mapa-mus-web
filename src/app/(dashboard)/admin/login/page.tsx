'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login, signUp, verifyOtpCode } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const passwordsDontMatch = !isLogin && confirmPassword.length > 0 && password !== confirmPassword;

  const reqMinLength = password.length >= 6;
  const reqNumberOrSymbol = /[0-9!@#$%^&*(),.?\":{}|<>]/.test(password);

  const satisfiedCount = [reqMinLength, reqNumberOrSymbol].filter(Boolean).length;
  
  const strengthText = (() => {
    if (password.length === 0) return "";
    if (satisfiedCount <= 1) return "Débil";
    return "Segura";
  })();

  const strengthColor = (() => {
    if (satisfiedCount <= 1) return "bg-[#E55C52]";
    return "bg-[#33AD6A]";
  })();

  const strengthWidth = (() => {
    if (password.length === 0) return "w-0";
    if (satisfiedCount === 1) return "w-1/2";
    return "w-full";
  })();

  const isPasswordStrong = satisfiedCount === 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, rellena todos los campos.");
      return;
    }

    if (!isLogin && !isPasswordStrong) {
      toast.error("La contraseña es demasiado insegura. Combina letras con números o símbolos.");
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
          toast.success("Cuenta registrada. Introduce el código OTP enviado a tu correo.");
          setShowOtpInput(true);
        } else {
          toast.error(res.error || "Error al registrar la cuenta.");
        }
      }
    });
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 8) {
      toast.error("Por favor, introduce el código de 8 dígitos.");
      return;
    }

    startTransition(async () => {
      const res = await verifyOtpCode({ email, token: otpCode });
      if (res.success) {
        toast.success("¡Email verificado con éxito!");
        router.push("/admin/onboarding");
        router.refresh();
      } else {
        toast.error(res.error || "El código introducido no es correcto.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4 relative overflow-hidden select-none">
      {/* Return to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#737373] hover:text-[#1F1F1F] px-4 py-2 bg-white border border-[#EAEAEA] rounded-full hover:shadow-sm active:scale-[0.98] transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Salir del portal
        </Link>
      </div>

      {/* Background Grids & Blur effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#33AD6A]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-[#33AD6A]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm relative z-10 transition-all duration-300">

        {showOtpInput ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Logo / Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black tracking-tight text-[#1F1F1F]">
                Verificar Cuenta
              </h1>
              <p className="text-neutral-500 font-semibold text-xs mt-2 max-w-xs mx-auto text-center leading-relaxed">
                Introduce el código de 8 dígitos que hemos enviado a <span className="text-[#1F1F1F] font-bold">{email}</span>
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleOtpVerify} className="space-y-6 flex flex-col items-center">
              <div className="space-y-1.5 flex flex-col items-center">
                <InputOTP
                  maxLength={8}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                  disabled={isPending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={1} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={2} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={3} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={4} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={5} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={6} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                    <InputOTPSlot index={7} className="w-9 h-11 text-base font-bold bg-neutral-50 border-[#EAEAEA] data-[active=true]:border-[#33AD6A] data-[active=true]:ring-[#33AD6A]/20" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                type="submit"
                disabled={isPending || otpCode.length < 8}
                className="w-full h-11 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Confirmar Código"
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpInput(false)}
                disabled={isPending}
                className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors py-1 cursor-pointer"
              >
                Volver al Registro
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Logo / Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black tracking-tight text-[#1F1F1F]">
                Mapa<span className="text-[#33AD6A]">Mus</span>
              </h1>
              <p className="text-neutral-500 font-semibold text-xs mt-1 uppercase tracking-wider">
                Portal de Organizadores
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-neutral-100 mb-6 p-1 bg-neutral-50 rounded-xl relative">
              <div
                className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-sm border border-neutral-100 transition-all duration-300 ease-out"
                style={{
                  width: "calc(50% - 4px)",
                  transform: isLogin ? "translateX(0)" : "translateX(100%)",
                }}
              />
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                disabled={isPending}
                className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 ${
                  isLogin ? "text-[#1F1F1F]" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                disabled={isPending}
                className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 ${
                  !isLogin ? "text-[#1F1F1F]" : "text-neutral-500 hover:text-neutral-900"
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
                  autoComplete="email"
                  placeholder="ejemplo@organizador.com"
                  className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    className={`w-full h-11 pl-4 pr-10 border outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white focus:ring-1 ${
                      !isLogin && password.length > 0
                        ? isPasswordStrong
                          ? "border-[#33AD6A] focus:border-[#33AD6A] focus:ring-[#33AD6A]"
                          : "border-[#E55C52] focus:border-[#E55C52] focus:ring-[#E55C52]"
                        : "border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-[#33AD6A]"
                    }`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Indicador dinámico de fortaleza de contraseña */}
                {!isLogin && password.length > 0 && (
                  <div className="mt-3 space-y-2.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                    {/* Barra de progreso y texto de fortaleza */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="h-1.5 w-full bg-[#EAEAEA] rounded-full mr-4 overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strengthColor} ${strengthWidth}`}
                        />
                      </div>
                      <span
                        className={`font-bold shrink-0 transition-colors duration-300 ${
                          satisfiedCount <= 1 ? "text-[#E55C52]" : "text-[#288A56]"
                        }`}
                      >
                        Fortaleza: {strengthText}
                      </span>
                    </div>

                    {/* Lista de requisitos */}
                    <div className="space-y-1.5 bg-neutral-50 border border-[#EAEAEA] p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-xs">
                        {reqMinLength ? (
                          <Check className="w-3.5 h-3.5 text-[#33AD6A] shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[#E55C52] shrink-0" />
                        )}
                        <span className={reqMinLength ? "text-[#288A56] font-medium" : "text-[#E55C52] font-medium"}>
                          Al menos 6 caracteres
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {reqNumberOrSymbol ? (
                          <Check className="w-3.5 h-3.5 text-[#33AD6A] shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[#E55C52] shrink-0" />
                        )}
                        <span className={reqNumberOrSymbol ? "text-[#288A56] font-medium" : "text-[#E55C52] font-medium"}>
                          Al menos un número o símbolo
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar contraseña con animación de altura, opacidad y transición */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  !isLogin
                    ? "grid-rows-[1fr] opacity-100 mb-4"
                    : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1.5 pt-1 pb-1">
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isPending}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full h-11 pl-4 pr-10 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
                        required={!isLogin}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isPending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordsDontMatch && (
                      <p className="text-xs text-[#DC3545] font-semibold mt-1.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                        Las contraseñas no coinciden.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || (!isLogin && (!isPasswordStrong || passwordsDontMatch))}
                className="w-full h-11 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 overflow-hidden relative"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="relative flex items-center justify-center h-5 w-full">
                    <span
                      className={`absolute transition-all duration-300 ease-out ${
                        isLogin ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                      }`}
                    >
                      Acceder al Panel
                    </span>
                    <span
                      className={`absolute transition-all duration-300 ease-out ${
                        !isLogin ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      Registrar Cuenta
                    </span>
                  </span>
                )}
              </button>
            </form>

            {/* Footer info con animación */}
            <div className="relative h-4 mt-6 overflow-hidden">
              <p
                className={`absolute inset-x-0 text-xs text-center text-neutral-400 font-semibold transition-all duration-300 ${
                  isLogin ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                ¿Quieres publicar tus torneos? Regístrate gratis en segundos.
              </p>
              <p
                className={`absolute inset-x-0 text-xs text-center text-neutral-400 font-semibold transition-all duration-300 ${
                  !isLogin ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                Al registrarte aceptas que solo publicarás torneos de mus reales.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}