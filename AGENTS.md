# Mapa Mus Web - Landing Page & Admin Panel (Next.js)

Este documento define las directrices arquitectónicas, reglas de codificación, integraciones con Supabase/TypeScript y guías pedagógicas para el desarrollo en el subproyecto de la web principal y panel de administrador de **Mapa Mus**.

> [!IMPORTANT]
> **SOPORTE EXCLUSIVO PARA MODO CLARO:** La aplicación web (`mapa-mus-web`) funciona **ÚNICAMENTE en Modo Claro**. Está prohibido implementar fondos oscuros o clases como `dark` por defecto. Toda interfaz debe usar un fondo claro (`#F7F7F7` o `#FFFFFF`) y texto oscuro (`#1F1F1F` o `#737373`), respetando estrictamente la paleta de colores de `COLOR_PALETTE.md`.

---

## 🌐 Contexto General y Modelo de Negocio
Mapa Mus es un ecosistema diseñado para profesionalizar y digitalizar el juego del Mus.
- **Landing Page/SEO B2C:** Páginas estáticas y dinámicas organizadas para indexación de Google (`/torneos/[localidad]`).
- **SaaS B2B (Mapa Mus Bar):** Panel de control optimizado para que los hosteleros y organizadores gestionen torneos, emparejamientos, brackets y clasificaciones desde tablets o PCs de forma automatizada.
- **Modo Smart TV:** Interfaz de visualización pública y pasiva para televisores de bares que muestra el estado de las mesas en tiempo real con un código QR gigante. **Prohibido scroll vertical en el modo TV**.
- **Branding:** Nombre comercial "Mapa Mus" y "Mapa Mus Bar". Paleta de colores definida en `COLOR_PALLETE.md`. **Soporte exclusivo para Modo Claro** en esta interfaz.

---

## 🎓 Enfoque Pedagógico (Profesor Mode)
Este proyecto es un entorno de aprendizaje continuo de tecnologías web modernas (Next.js 16+, React 19). La interacción con el desarrollador se gradúa según la dificultad:
1. **Tareas Estructurales o Simples:** Escribe el código directo para componentes visuales puros, utilidades básicas o layouts comunes.
2. **Conceptos Avanzados/Arquitectónicos:** Si la tarea implica conceptos complejos de Next.js (ej: Middleware global, Rutas Paralelas/Interceptadas, optimización de caché y revalidación, PPR, o streaming complejo con Suspense):
   - **TIENES PROHIBIDO escribir la solución final directamente.**
   - Actúa como un mentor. Explica la base conceptual y teórica primero. Proporciona pseudocódigo o un ejemplo mínimo funcional y guía al desarrollador mediante pasos interactivos o preguntas para que sea él quien lo implemente en el codebase.

---

## 🧱 Arquitectura de Componentes y Directorios

### Principios de Ingeniería
- **SRP (Single Responsibility Principle):** Extrae lógica e interfaces complejas (formularios, suscripciones a eventos) a subcomponentes autónomos.
- **DRY (Don't Repeat Yourself):** Abstrae lógica repetitiva de cálculo o UI en hooks (`/hooks`) o componentes de UI genéricos.
- **Colocation Estricta:** Componentes específicos de una sola sección o ruta deben colocarse en una subcarpeta `/components` dentro de la propia carpeta de la ruta (ej: `panel/[short-id]/components`).
- **Idiomas en URL (Spanish URLs):** Toda ruta o segmento de URL público o de administración expuesto al usuario final debe utilizar términos en español (ej. `/admin/panel/[short-id]/editar` en lugar de `/admin/panel/[short-id]/edit`, y `/admin/panel/editar` en lugar de `/admin/panel/edit`).

### Estructura de Directorios
- **`src/app/`**: Contiene únicamente la estructura de rutas (`page.tsx`, `layout.tsx`, `route.ts`). Agrupado en `(marketing)`, `(dashboard)`, y `(public-tv)`.
- **`src/app/actions/`**: Centraliza todas las Server Actions. Deben llevar obligatoriamente la directiva `'use server'`.
- **`src/components/ui/`**: Componentes atómicos (shadcn/ui).
- **`src/services/`**: Queries y lecturas de Supabase orientadas a servidor.
- **`src/lib/`**: Utilidades genéricas (`tournament-math.ts`) y clientes (`lib/supabase/server.ts`).
- **`src/types/`**: Tipado del proyecto. `database.ts` mapea la lógica de negocio y `ui.ts` los estados visuales. Usa un barrel file (`index.ts`) para exportar todo.

---

## ⚠️ Fuente de Verdad Técnica
- **Next.js & React 19:** No dependas de tu memoria sobre APIs que cambien entre versiones. Inspecciona las definiciones de tipo (`d.ts`) en `node_modules/next` y consulta `nextjs.org/docs` filtrando por la versión exacta del `package.json` (Next 16.2.6).

---

## ⚙️ Integración con Supabase y TypeScript

### ⚠️ Uso Obligatorio del Servidor MCP para el Esquema
- **PROHIBIDO** basar el desarrollo en esquemas de base de datos obsoletos u obsoletas tablas documentadas en texto.
- **Servidor MCP de Supabase:** Para consultar la estructura real de cualquier tabla (columnas, tipos, claves primarias/foráneas y restricciones), utiliza siempre las herramientas del servidor **MCP de Supabase** configurado para este repositorio (`.gemini/settings.json`).

### 1. Inicialización del Cliente de Servidor (`src/lib/supabase/server.ts`)
El cliente de Supabase se instancia dinámicamente en servidor mediante `@supabase/ssr` y la función `createClient()`. Esto permite leer y escribir cookies en Server Actions y Route Handlers:
```typescript
import { createClient } from '@/lib/supabase/server';

// Uso en Server Components o Server Actions
const supabase = await createClient();
```

### 2. Tipado de la Base de Datos (`src/types/supabase.ts`)
- **PROHIBIDO** editar manualmente `src/types/supabase.ts`.
- **Actualización de tipos:** Se realiza sincrónicamente desde la CLI de Supabase con el access token del archivo `.env`:
  ```bash
  supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
  ```
- **Lógica de negocio (`src/types/database.ts`):** Mapea los tipos de fila generados para consumo local en la aplicación. Usa constructores seguros basados en las tablas públicas:
  ```typescript
  import { Database } from '@/types/supabase'
  
  export type Match = Database['public']['Tables']['matches']['Row']
  export type Tournament = Database['public']['Tables']['tournaments']['Row']
  export type TournamentStatus = Database['public']['Enums']['tournament_status']
  ```

### 3. Seguridad y Políticas RLS
- Todas las tablas en Supabase tienen activado el RLS (Row Level Security).
- El cliente retornado por `createClient()` asocia automáticamente la sesión del usuario a través de las cookies. Ten en cuenta estas políticas al realizar lecturas y mutaciones.

---

## 📏 Reglas y Convenciones de Código

### UI & UX Rules (shadcn/ui & Base UI Nova Style)
- **Base UI (Nova Style):** El proyecto utiliza la versión Nova de shadcn/ui sustentada sobre `@base-ui/react`.
- **PROHIBIDO el uso de `asChild`:** Esta propiedad es propia de Radix UI y causa problemas de hidratación en Base UI.
- **Uso de propiedad `render`:** Para el patrón Slot (delegar el renderizado al hijo), usa la prop `render`:
  - *Incorrecto:* `<Trigger asChild><Button>...</Button></Trigger>`
  - *Correcto:* `<Trigger render={<Button>...</Button>} />`
- **Composición de Enlaces:** Nunca envuelvas un `<button>` dentro de otro. Para botones enlace, usa el componente `<Link>` directamente estilizado con las clases visuales del botón.
- **Formateo de Fechas (Hydration Mismatch):** Para evitar fallos de renderizado entre el servidor y el cliente debido a la zona horaria del navegador, utiliza **SIEMPRE** el componente `<SafeDate />` ubicado en `@/components/ui/safe-date`.

### Convenciones Generales
- **Server Components:** Utilízalos por defecto. Reserva `'use client'` para hojas de la jerarquía que requieran interactividad.
- **Data Fetching:** **Prohibido** usar `useEffect` o `useState` para data fetching inicial. Hazlo asíncronamente en Server Components con `await` y envuelve la vista en límites de `<Suspense>` con loaders.
- **TypeScript Strict:** Prohibido usar `any`.
- **Server Actions:** Deben retornar obligatoriamente el formato `{ success: boolean, message?: string, error?: string }` y realizar `revalidatePath` o `revalidateTag` tras una mutación exitosa.
- **Nomenclatura (Naming):** `camelCase` (variables, funciones), `PascalCase` (Componentes, interfaces y tipos), `kebab-case` (archivos, carpetas).
- **Idioma:** Todo el código y comentarios deben estar escritos en **inglés**.

---

## 🔍 Verificación de Calidad (Pre-entrega)
Antes de proponer o subir cualquier cambio de código, el agente debe verificar localmente:
1. Ejecutar `npm run lint` o `next lint` para detectar errores de sintaxis y reglas Next.js.
2. Garantizar que todos los tipos de TypeScript compilen limpiamente.
3. Asegurar que las features cumplan el objetivo funcional de forma limpia sin afectar a las ya existentes.
4. **Proponer siempre el nombre del commit** que describa el cambio realizado de acuerdo al estándar de **Conventional Commits** al finalizar y resolver satisfactoriamente la tarea.