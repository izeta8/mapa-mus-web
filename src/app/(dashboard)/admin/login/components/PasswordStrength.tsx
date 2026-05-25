import { Check, X } from "lucide-react";

export function checkPasswordRequirements(password: string) {
  const reqMinLength = password.length >= 6;
  const reqNumberOrSymbol = /[0-9!@#$%^&*(),.?\":{}|<>]/.test(password);
  const satisfiedCount = [reqMinLength, reqNumberOrSymbol].filter(Boolean).length;
  const isStrong = satisfiedCount === 2;

  return {
    reqMinLength,
    reqNumberOrSymbol,
    satisfiedCount,
    isStrong,
  };
}

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (password.length === 0) return null;

  const { reqMinLength, reqNumberOrSymbol, satisfiedCount } = checkPasswordRequirements(password);

  const strengthText = (() => {
    if (satisfiedCount <= 1) return "Débil";
    return "Segura";
  })();

  const strengthColor = (() => {
    if (satisfiedCount <= 1) return "bg-[#E55C52]";
    return "bg-[#33AD6A]";
  })();

  const strengthWidth = (() => {
    if (satisfiedCount === 1) return "w-1/2";
    return "w-full";
  })();

  return (
    <div className="mt-3 space-y-2.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
      {/* Progress bar and strength text */}
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

      {/* Requirements list */}
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
  );
}
