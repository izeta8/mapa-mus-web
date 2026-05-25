# Contexto de la Sesión Actual (Sábado 16 de Mayo, 2026)

## 🎯 Objetivo de la Sesión
Estamos desarrollando el **Panel de Administración B2B** (`/admin/panel/[short-id]`) para que los hosteleros gestionen torneos de Mus en tiempo real. Se ha priorizado una UX de alta legibilidad y escala (fuentes grandes, botones robustos) para entornos de bar.

## ✅ Completado en esta Sesión
1.  **Cimientos del Panel:** Página estructurada y modularizada siguiendo `AGENTS.md` (Colocation). Componentes: `TournamentHeader`, `TournamentStats`, `TournamentManagement`.
2.  **Sincronización DB:** Conectado con la tabla `tournaments_develop` de Supabase usando los tipos reales.
3.  **Gestión de Participantes (Paso 2):** 
    *   Implementadas Server Actions para `addCouple` y `deleteCouple`.
    *   Interfaz de **DataGrid (Tabla)** compacta para visualizar participantes.
    *   Formulario de inscripción con paridad total entre ambos jugadores.
    *   Configuración de `sonner` (Toasts) en `top-center`, `richColors` y `theme="light"`.
4.  **Seguridad Temporal:** El usuario ha desactivado RLS en la tabla `couples` para facilitar el desarrollo antes de implementar Auth.

## 🚀 Próximos Pasos (Pendiente)
1.  **Paso 3: Lanzar Torneo (El Big Bang):**
    *   Implementar el botón "Comenzar Torneo" en `TournamentHeader`.
    *   Lógica de Server Action para realizar el **Shuffle inicial** de las parejas inscritas.
    *   Generar los primeros enfrentamientos (Ronda 1) en la tabla `matches`.
    *   Cambiar el estado del torneo de `planned` a `ongoing` (requiere revisar Enums de la DB o usar los existentes).
2.  **Paso 4: Control de Rondas:**
    *   Interfaz para asignar mesas y marcar ganadores en `TournamentManagement`.
    *   Actualización Realtime para que los cambios se reflejen instantáneamente en el **Modo TV**.

---

# TODO General del Proyecto

- **Seguridad y Hardening de Base de Datos (Cuando se implemente Autenticación B2B):**
  - [x] **Activar RLS (Row Level Security):** Ejecutar `ALTER TABLE ENABLE ROW LEVEL SECURITY` para las tablas `couples` y `matches`.
  - [x] **Políticas RLS en Cascadas:** Crear políticas que no solo verifiquen `auth.role() = 'authenticated'`, sino que comprueben la propiedad contrastando el `tournament_id` con el `organizer_id` del creador en la tabla `tournaments`.
  - [x] **Asegurar Server Actions:**
    - [x] Validar propiedad en `generateBracket` y `storeGeneratedBracket` (evitar que usuarios re-generen cuadros ajenos).
    - [x] Validar propiedad en `addCouple` y `deleteCouple`.
    - [x] Validar propiedad en `updateMatchTable` y `rollbackMatchWinner`.
  - [ ] **Seguridad en Funciones (RPC):**
    - [ ] Limitar la ejecución de la función `advance_winner` (revisar que sea invoker o que valide internamente el `auth.uid()` contra el organizador).
    - [ ] Añadir `SET search_path = public` a todas las funciones custom (`advance_winner`, `rollback_winner`, `handle_new_user`, `generate_tournament_short_id`, `update_updated_at_column`) para evitar problemas de búsqueda dinámica.
  - [ ] **Políticas de Storage Buckets:** Quitar la política amplia de `SELECT` que permite listar públicamente todos los archivos de los buckets `avatars` y `posters` (debería permitir descargar por URL pero no listar el bucket entero).
  - [ ] **Autenticación:** Habilitar la protección contra contraseñas filtradas (Leaked Password Protection) en la configuración del panel de Supabase Auth.
