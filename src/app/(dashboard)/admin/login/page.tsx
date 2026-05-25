'use client'

import { useState } from "react";
import { PortalBackground } from "./components/PortalBackground";
import { ReturnHomeLink } from "./components/ReturnHomeLink";
import { LoginHeader } from "./components/LoginHeader";
import { TabSelector } from "./components/TabSelector";
import { OtpVerificationForm } from "./components/OtpVerificationForm";
import { AuthForm } from "./components/AuthForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");

  const handleSuccessSignUp = (registeredEmail: string) => {
    setEmail(registeredEmail);
    setShowOtpInput(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4 relative overflow-hidden select-none">
      {/* Return to Home Link */}
      <ReturnHomeLink />

      {/* Background Grids & Blur effects */}
      <PortalBackground />

      <div className="w-full max-w-md bg-white border border-[#EAEAEA] rounded-2xl p-8 shadow-sm relative z-10 transition-all duration-300">
        
        {/* Header (Title / Logo) */}
        <LoginHeader showOtpInput={showOtpInput} email={email} />

        {showOtpInput ? (
          <OtpVerificationForm
            email={email}
            onBackToRegister={() => setShowOtpInput(false)}
          />
        ) : (
          <>
            {/* Tab Selector */}
            <TabSelector 
              isLogin={isLogin} 
              onTabChange={setIsLogin} 
              disabled={isPending} 
            />

            {/* Authentication Form */}
            <AuthForm
              isLogin={isLogin}
              onSuccessSignUp={handleSuccessSignUp}
              onPendingChange={setIsPending}
            />

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