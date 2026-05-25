'use client'

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login, signUp } from "@/app/actions/auth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { PasswordStrength, checkPasswordRequirements } from "./PasswordStrength";

interface AuthFormProps {
  isLogin: boolean;
  onSuccessSignUp: (email: string) => void;
  onPendingChange?: (isPending: boolean) => void;
}

export function AuthForm({ isLogin, onSuccessSignUp, onPendingChange }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notify parent of pending status
  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const passwordsDontMatch = !isLogin && confirmPassword.length > 0 && password !== confirmPassword;
  const { isStrong: isPasswordStrong } = checkPasswordRequirements(password);

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
          toast.success("Cuenta registrada. Introduce el código enviado a tu correo.");
          onSuccessSignUp(email);
        } else {
          toast.error(res.error || "Error al registrar la cuenta.");
        }
      }
    });
  };

  return (
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
        
        {/* Dynamic password strength checker */}
        {!isLogin && password.length > 0 && (
          <PasswordStrength password={password} />
        )}
      </div>

      {/* Confirm password field with height, opacity transition */}
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
  );
}
