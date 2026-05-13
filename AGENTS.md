<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mapa Mus Web - Contexto del Proyecto

## Nombres y Branding

- **Nombre público (marketing)**: Mapa Mus
- **Nombre sección gestión B2B**: Mapa Mus Bar

## Modelo de Negocio

Ecosistema híbrido (físico/digital) para torneos de Mus:
- **App Móvil** (ya en producción): jugadores localizan torneos
- **Plataforma Web** (este proyecto): 3 frentes
  1. Marketing/SEO: páginas públicas para aparecer en Google
  2. SaaS B2B para hostelería: gestor de emparejamientos (uso en tablet/PC)
  3. Modo TV: pantalla completa para proyección en bar con QR gigante

## Tech Stack Obligatorio

- Framework: Next.js (App Router)
- Lenguaje: TypeScript (tipado estricto)
- Estilos: Tailwind CSS
- UI Components: shadcn/ui y Lucide React
- Backend/Auth: Supabase (PostgreSQL + Realtime)

## Arquitectura de Rutas (Route Groups)

### `(marketing)` - Layout público con Navbar y Footer
- `/` - Landing de conversión (descarga app + propuesta B2B)
- `/torneos/[localidad]` - Rutas dinámicas SEO por localidad
- `/legal/[slug]` - Páginas estáticas legales

### `(dashboard)` - Layout admin con sidebar
- `/admin/login` - Acceso con Supabase Auth
- `/admin/panel` - Vista general de torneos del organizador
- `/admin/panel/[id-torneo]` - Dashboard de gestión del torneo

### `(public-tv)` - Layout vacío, 100% viewport
- `/tv/[id-torneo]` - Interfaz oscura de alto contraste para TV del bar

## Consideraciones de UX

- **Entorno ruidoso**: Los organizadores usan la tablet en bares con ruido, presión y poco tiempo
- **UI mínima**: Botones grandes, flujos reducidos, información escaneable rápido
- **Modo TV**: Alto contraste, texto gigante, legible desde lejos, sin interacciones manuales

## Estado Actual del Proyecto

- Esqueleto inicial completado
- Route Groups creados con layouts base
- Build y lint pasan correctamente
- Falta implementar lógica de negocio, Supabase Auth y gestión de torneos
