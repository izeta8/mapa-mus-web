export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 border rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Mapa Mus Bar</h1>
        <p className="text-center text-muted-foreground mb-6">
          Inicia sesión para gestionar tus torneos
        </p>
        <div className="text-sm text-muted-foreground text-center">
          (Integración con Supabase Auth - Próximamente)
        </div>
      </div>
    </div>
  );
}