'use client'

interface TabSelectorProps {
  isLogin: boolean;
  onTabChange: (isLogin: boolean) => void;
  disabled?: boolean;
}

export function TabSelector({ isLogin, onTabChange, disabled }: TabSelectorProps) {
  return (
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
        onClick={() => onTabChange(true)}
        disabled={disabled}
        className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 cursor-pointer ${
          isLogin ? "text-[#1F1F1F]" : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        Iniciar Sesión
      </button>
      <button
        type="button"
        onClick={() => onTabChange(false)}
        disabled={disabled}
        className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 cursor-pointer ${
          !isLogin ? "text-[#1F1F1F]" : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        Crear Cuenta
      </button>
    </div>
  );
}
