'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyOtpCode } from "@/app/actions/auth";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OtpVerificationFormProps {
  email: string;
  onBackToRegister: () => void;
}

export function OtpVerificationForm({ email, onBackToRegister }: OtpVerificationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [otpCode, setOtpCode] = useState("");

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
          className="w-full h-11 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 animate-in fade-in"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Confirmar Código"
          )}
        </button>

        <button
          type="button"
          onClick={onBackToRegister}
          disabled={isPending}
          className="text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors py-1 cursor-pointer"
        >
          Volver al Registro
        </button>
      </form>
    </div>
  );
}
