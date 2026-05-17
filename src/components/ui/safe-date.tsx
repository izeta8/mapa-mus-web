interface Props {
  date: string | Date;
  className?: string;
}

/**
 * Componente para renderizar fechas de forma segura en Next.js.
 * Utiliza suppressHydrationWarning para permitir que el formato local del cliente 
 * difiera del servidor sin causar errores ni renders adicionales.
 */
export function SafeDate({ date, className }: Props) {
  const d = typeof date === "string" ? new Date(date) : date;

  return (
    <span className={className} suppressHydrationWarning>
      {d.toLocaleDateString()}
    </span>
  );
}
