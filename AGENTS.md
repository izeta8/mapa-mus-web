# Mapa Mus Web - Contexto del Proyecto

Mapa Mus es un ecosistema integral diseñado para profesionalizar y digitalizar el juego del Mus. Conecta la localización de campeonatos en tiempo real para jugadores con una infraestructura SaaS (Mapa Mus Bar) que permite a los hosteleros gestionar torneos complejos, emparejamientos y retransmisiones de forma automatizada, eliminando el caos logístico tradicional.

## Nombres y Branding
- **Nombre público**: Mapa Mus.
- **Gestión B2B**: Mapa Mus Bar.
- **Paleta de Colores**: Definida en `COLOR_PALLETE.md`. **Modo Claro exclusivamente**.

## Modelo de Negocio
1. **App Móvil**: Localización y seguimiento de mesas por jugadores.
2. **Marketing/SEO**: `/torneos/[localidad]` para posicionamiento Google.
3. **SaaS B2B**: Gestión en tablet/PC para el organizador.
4. **Modo TV**: Interfaz de alta legibilidad para Smart TV con QR gigante.

---

## ⚠️ Fuente de Verdad Técnica
- **Prioridad de Documentación:** Si tienes dudas sobre una API de Next.js (ej. `revalidateTag` o `middleware`), NO confíes solo en tu memoria de entrenamiento.
- **Acción:** Inspecciona las definiciones de tipo (`d.ts`) en `node_modules/next`. Son la referencia más precisa de esta versión.
- **Búsqueda Web:** Consulta `nextjs.org/docs` filtrando por la versión exacta en el `package.json`.

---

## 🎓 Enfoque Pedagógico (Modo Profesor)
Este proyecto tiene un fuerte componente de aprendizaje de Next.js. El rol del asistente debe adaptarse según la complejidad técnica:
- **Tareas Simples/Estructurales:** Puedes generar código directo para componentes atómicos, layouts básicos o utilidades puras.
- **Conceptos Medio-Avanzados:** Si la tarea requiere implementar características avanzadas o arquitectónicas de Next.js (ej. Middleware global, Rutas Paralelas/Interceptadas, optimización de Server Actions, estrategias de caché complejas/PPR, o streaming avanzado con Suspense), **TIENES PROHIBIDO escribir la solución final directamente**.
- **Metodología:** Actúa como un mentor o profesor técnico. Explica primero el "por qué" y la teoría del concepto. Proporciona un ejemplo conceptual mínimo o pseudocódigo y guía al desarrollador paso a paso mediante preguntas o pautas para que sea él quien escriba e implemente la solución en su código.

---

## 🧱 Arquitectura de Componentes: Abstracción y Responsabilidad
Se debe evitar la creación de componentes monolíticos mediante la aplicación de principios de ingeniería de software:

- Single Responsibility Principle (SRP): Un componente debe tener una única responsabilidad clara. Si una sección de la página gestiona una lógica independiente (ej. el estado de una suscripción Realtime o la validación de un formulario complejo), debe extraerse a su propio componente.

- Patrón DRY (Don't Repeat Yourself): Cualquier patrón visual o lógica de filtrado que se repita en más de un lugar debe ser abstraído en un componente de UI o un hook especializado.

- Métrica de Abstracción: La decisión de fragmentar no depende del número de líneas, sino de la capacidad de abstracción. Si una pieza de la interfaz puede describirse como una entidad lógica propia (ej. TournamentHeader, MatchGrid, RankingSidebar), debe vivir en su propio archivo.

- Colocation Estricta: Los componentes resultantes de esta abstracción que sean específicos de una ruta deben ubicarse en la subcarpeta /components de dicha ruta.

---

## Arquitectura y Estructura de Directorios
La organización es estricta para evitar la dispersión de lógica:
- `/src/app`: **SOLO** enrutamiento (`page.tsx`, `layout.tsx`, `route.ts`). Grupos: `(marketing)`, `(dashboard)`, `(public-tv)`.
- `/src/app/actions`: **SOLO** Server Actions. Deben incluir `'use server'`.
- `/src/components/ui`: Componentes atómicos de shadcn/ui.
- `/src/services`: Consultas de **solo lectura** a Supabase (Data Fetching).
- `/src/lib`: Utilidades matemáticas (`tournament-math.ts`) y configuración de clientes (`supabase/server.ts`).
- `/src/types`: `database.ts` (lógica de negocio) y `ui.ts`. Usa patrón "Barrel" en `index.ts`.
- **Colocation**: Componentes específicos de una sección van en su propia subcarpeta `/components` dentro de la ruta (ej. `panel/[short-id]/components`).

---

## Convenciones de Código
1. **Server Components**: Por defecto. Usa `'use client'` solo en la capa más profunda de interactividad.
2. **Data Fetching**: **Prohibido** `useEffect/useState` para carga inicial. Usa `await` en Server Components y envuelve en `<Suspense>` con un spinner.
3. **TypeScript**: Prohibido `any`. Usa `Database['public']['Tables']['nombre']['Row']` de `@/types/supabase` para construir los tipos en `@/types/database.ts`.
4. **Server Actions**: Deben devolver `{ success: boolean, message?: string, error?: string }` y usar `revalidatePath` tras mutaciones.
5. **Naming**: `camelCase` (funciones/variables), `PascalCase` (Componentes/Tipos), `kebab-case` (archivos/carpetas).
6. **UX B2B/TV**: Botones grandes, alto contraste. Modo TV: tipografías dinámicas calculadas en `helpers.ts`. **Prohibido scroll vertical en TV**.

---

## Base de Datos (Supabase)
- **Acceso al Esquema:** Verifica siempre la estructura real con el servidor MCP o herramientas de inspección antes de escribir consultas.
- **Políticas RLS:** Ten en cuenta que todas las tablas tienen RLS activo.
- **Tipado:** Usa exclusivamente los tipos de `@/types/supabase` para mantener sincronía con la base de datos.

---

## Estado Actual y Próximos Pasos
### ✅ Completado
- Lógica de Brackets, Emparejamientos y Shuffles.
- UI del Panel y Modo TV escalable.
- Sistema de tipos complejo para relaciones de Supabase.

### ⏳ Pendiente
1. **Realtime**: Suscripciones para actualización instantánea en TV.
2. **Auth**: Proteger `(dashboard)` con middleware y Supabase Auth.
3. **Flujo de Ganadores**: Interfaz para avanzar parejas en el bracket.