interface LoginHeaderProps {
  showOtpInput: boolean;
  email?: string;
}

export function LoginHeader({ showOtpInput, email }: LoginHeaderProps) {
  if (showOtpInput) {
    return (
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1F1F1F]">
          Verificar Cuenta
        </h1>
        <p className="text-neutral-500 font-semibold text-xs mt-2 max-w-xs mx-auto text-center leading-relaxed">
          Introduce el código de 8 dígitos que hemos enviado a <span className="text-[#1F1F1F] font-bold">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-black tracking-tight text-[#1F1F1F]">
        Mapa<span className="text-[#33AD6A]">Mus</span>
      </h1>
      <p className="text-neutral-500 font-semibold text-xs mt-1 uppercase tracking-wider">
        Portal de Organizadores
      </p>
    </div>
  );
}
