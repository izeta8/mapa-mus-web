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

- **Seguridad RLS:** Cuando se implemente la autenticacion B2B, activar RLS en `couples` y validar que el `auth.uid()` coincida con el `organizer_id` del torneo asociado.
