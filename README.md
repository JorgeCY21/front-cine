<div align="center">

# 🎬 CineMax Premium — Frontend

**Aplicación web de venta de entradas de cine**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack_Query-5.81-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

</div>

---

## Tabla de contenidos

1. [Descripción general](#descripción-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Estructura del repositorio](#estructura-del-repositorio)
5. [Modelo de datos](#modelo-de-datos)
6. [API consumida](#api-consumida)
7. [Flujo funcional](#flujo-funcional)
8. [Puesta en marcha](#puesta-en-marcha)
9. [Scripts disponibles](#scripts-disponibles)
10. [Variables de entorno](#variables-de-entorno)
11. [Servicios y dependencias externas](#servicios-y-dependencias-externas)
12. [Calidad de código, testing y CI/CD](#calidad-de-código-testing-y-cicd)
13. [Limitaciones conocidas y deuda técnica](#limitaciones-conocidas-y-deuda-técnica)
14. [Roadmap sugerido](#roadmap-sugerido)
15. [Licencia](#licencia)

---

## Descripción general

**front-cine** es el frontend de **CineMax Premium**, una aplicación web (SPA) para la venta de entradas de cine. Cubre el ciclo completo de compra de una entrada:

- Registro e inicio de sesión de usuarios.
- Recuperación de contraseña por código de verificación enviado por correo.
- Catálogo de películas en cartelera con carrusel destacado y previsualización de tráiler.
- Selección de horario/función por película.
- Selección interactiva de asientos en sala (estándar / premium / VIP).
- Confirmación de compra con generación de ticket en **PDF** (código de barras y QR).
- Historial de entradas compradas ("Mis Entradas").

Es un **frontend puro**: no incluye backend, base de datos ni ORM. Todo el catálogo de películas, funciones, salas y usuarios proviene de una **API REST externa** (no incluida en este repositorio), consumida vía `axios` a través de una URL configurable por variable de entorno.

> El `README.md` original de este repositorio era el boilerplate por defecto de Vite ("React + TypeScript + Vite") sin adaptar al proyecto real; este documento lo reemplaza con documentación derivada de una lectura directa del código fuente.

## Stack tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Lenguaje | TypeScript | `~5.8.3` |
| Librería UI | React / React DOM | `^19.1.0` |
| Bundler / dev server | Vite | `^6.3.5` |
| Estilos | Tailwind CSS (vía `@tailwindcss/vite`, modelo v4 sin `tailwind.config.js`) | `^4.1.10` |
| Enrutamiento | React Router DOM | `^7.6.2` |
| Cliente HTTP | Axios | `^1.10.0` |
| Data fetching / mutaciones | TanStack Query (React Query) | `^5.81.5` |
| Animaciones | Framer Motion | `^12.18.1` |
| Iconos | Lucide React + React Icons | `^0.525.0` / `^5.5.0` |
| Generación de PDF | jsPDF + html2canvas | `^3.0.1` / `^1.4.1` |
| Código QR | react-qr-code | `^2.0.16` |
| Linting | ESLint 9 (flat config) + typescript-eslint | `^9.25.0` / `^8.30.1` |
| Análisis estático | SonarQube/SonarCloud (`sonar-project.properties`) | — |
| Gestor de paquetes | npm (`package-lock.json`, lockfileVersion 3) | — |

No hay `engines` en `package.json` ni `.nvmrc`; no se fija una versión mínima de Node de forma explícita (Vite 6 requiere Node ≥18).

**Ausencias notables**: no hay librería de formularios (React Hook Form, Formik) — los formularios son controlados manualmente con `useState` y validación por regex inline; no hay gestor de estado global (Redux, Zustand, Context propio) — la sesión de usuario se persiste directamente en `localStorage`.

## Arquitectura

SPA de frontend puro, organizada por **capas horizontales** (layering por tipo de archivo, no por feature):

```
┌───────────────────────────────────────────────────────────┐
│                        Navegador (SPA)                     │
│                                                             │
│  react-router-dom  ──▶  pages/ (una página por ruta)        │
│                              │                              │
│           ┌──────────────────┼───────────────────┐          │
│           ▼                  ▼                    ▼          │
│      components/         services/              dto/         │
│   (presentación pura)  (capa HTTP, axios)   (formas de datos) │
│                              │                              │
│                              ▼                              │
│                     src/services/api.ts                     │
│              (instancia axios + función request())          │
└───────────────────────────────────────────────────────────┘
                               │
                               ▼
                 Backend REST externo (VITE_API_BACK_URL)
```

- **`pages/`**: un componente por ruta, con su propia lógica de fetching (`useEffect` + servicios) y composición de UI. No hay lazy-loading (`React.lazy`) de rutas.
- **`components/`**: piezas de presentación reutilizables (`Header`, `Footer`, `MovieCard`, `MovieCarousel`), sin llamadas de red propias.
- **`services/`**: un archivo por recurso del backend (`movies`, `showtimes`, `tickets`, `user`), todos delegando en la función genérica `request()` de [`src/services/api.ts`](src/services/api.ts).
- **`dto/`**: las entidades del dominio se definen como **clases TypeScript** (`export class MovieDto {...}`) aunque nunca se instancian con `new` — se usan solo como formas de datos, lo que es una inconsistencia de diseño (deberían ser `interface`/`type`).
- **`routes/Router.tsx`**: punto único de definición de rutas con `react-router-dom`, sin *route guards*: cualquier ruta (incluida `/seats` o `/my-tickets`) es navegable sin sesión válida a nivel de router.
- **Estado y sesión**: no hay estado global central. La sesión del usuario autenticado se guarda completa en `localStorage` bajo la clave `"user"` (fijada en `LoginPage.tsx`, leída en `Header.tsx`, `SeatsPage.tsx`, `ConfirmationPage.tsx`, `MyTicketsPage.tsx`). TanStack Query se usa únicamente para las mutaciones del flujo de recuperación de contraseña, no como caché general de datos del catálogo.

## Estructura del repositorio

```
front-cine/
├── public/                       # activos estáticos (logo.png, vite.svg)
├── .github/workflows/
│   └── build.yml                  # CI: npm ci → tsc --noEmit → SonarQube Scan
├── sonar-project.properties       # config de SonarCloud/SonarQube
├── vite.config.ts                 # plugin Tailwind v4 + proxy /api en dev
├── eslint.config.js               # ESLint 9 flat config
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── index.html                     # título "CineMax Premium"
├── package.json
│
└── src/
    ├── main.tsx                    # bootstrap ReactDOM, envuelve App en QueryClientProvider
    ├── App.tsx                     # monta el Router
    ├── index.css / App.css
    │
    ├── routes/
    │   └── Router.tsx              # definición centralizada de rutas (BrowserRouter)
    │
    ├── pages/                      # una página por ruta
    │   ├── LoginPage.tsx            # login + QR informativo
    │   ├── RegisterPage.tsx         # registro de usuario
    │   ├── RecoverPassword/         # flujo de 3 pasos
    │   │   ├── ForgotPassword.tsx    # solicitud de código por email
    │   │   ├── VerifyCode.tsx        # verificación de código
    │   │   └── ResetPassword.tsx     # nueva contraseña
    │   ├── MoviesPage.tsx           # cartelera + carrusel destacado
    │   ├── ShowtimesPage.tsx        # funciones/horarios de una película
    │   ├── SeatsPage.tsx            # selección de asientos por sala
    │   ├── ConfirmationPage.tsx     # confirmación de compra + ticket PDF
    │   └── MyTicketsPage.tsx        # historial de entradas del usuario
    │
    ├── components/
    │   ├── Header.tsx               # navbar: búsqueda, menú de usuario, logout
    │   ├── Footer.tsx
    │   ├── MovieCard.tsx            # tarjeta de película, preview de tráiler en hover
    │   └── MovieCarousel.tsx        # carrusel destacado con autoplay
    │
    ├── services/                    # capa de acceso HTTP (axios)
    │   ├── api.ts                    # instancia axios + función genérica request()
    │   ├── movies.service.ts
    │   ├── showtimes.service.ts
    │   ├── tickets.service.ts
    │   └── user.service.ts
    │
    ├── dto/                          # entidades del dominio (como clases TS)
    │   ├── movie.dto.ts, room.dto.ts, seat.dto.ts,
    │   ├── showtime.dto.ts, ticket.dto.ts, ticketBuy.dto.ts, user.dto.ts
    │
    ├── types/
    │   └── cinemaTypes.ts            # interfaces alternativas, sin uso real (ver limitaciones)
    │
    └── assets/                       # recurso de plantilla de Vite sin uso (react.svg)
```

## Modelo de datos

No hay base de datos ni ORM en este repositorio: las entidades son DTOs de TypeScript en [`src/dto/`](src/dto/) que reflejan la forma de las respuestas del backend externo:

| DTO | Archivo | Campos principales |
|---|---|---|
| `MovieDto` | `movie.dto.ts` | `id, title, duration, description?, genre?, rating?, url_poster?, url_background?, url_trailer?` |
| `RoomDto` | `room.dto.ts` | `id, name, capacity` |
| `SeatDto` | `seat.dto.ts` | `id, seat_number, row, available, type ("standard"\|"premium"\|"vip"), price` |
| `ShowtimeDto` | `showtime.dto.ts` | `id, movie: MovieDto, room: RoomDto, start_time: Date, format, price` |
| `TicketDto` | `ticket.dto.ts` | `id, user: UserDto, showtime: ShowtimeDto, seat: SeatDto, purchase_date?` |
| `TicKetBuy` | `ticketBuy.dto.ts` | `user_id, showtime_id, seat_number, row` (payload de compra) |
| `UserDto` | `user.dto.ts` | `id, first_name, last_name, email, password` |

> **Nota de consistencia:** [`src/types/cinemaTypes.ts`](src/types/cinemaTypes.ts) define interfaces paralelas (`Movie`, `Room`, `Showtime`, `Seat`, `User`) con nombres de campo distintos a los DTO (p. ej. `is_taken` vs `available`), sin ninguna importación real detectada en el resto del código — parece código muerto de un diseño anterior.

**Generación de asientos client-side**: la API no expone un catálogo de asientos por sala; en su lugar, `generateSeats()` (duplicada casi idénticamente en [`SeatsPage.tsx`](src/pages/SeatsPage.tsx) y [`ConfirmationPage.tsx`](src/pages/ConfirmationPage.tsx)) construye los asientos en el cliente a partir de `room.capacity` (asumiendo 10 asientos por fila) y cruza esa lista con los tickets ya vendidos (`GET /tickets/showtime/:id`) para marcar disponibilidad. Los precios por tipo de asiento (`standard: 9.99, premium: 12.99, vip: 16.99`) están **hardcodeados en el frontend**, no provienen de `showtime.price` ni de `SeatDto.price`.

## API consumida

Backend REST externo, configurado por `VITE_API_BACK_URL`, con base `${VITE_API_BACK_URL}/api` ([`src/services/api.ts`](src/services/api.ts)). No se consume ninguna API pública de terceros de cine (no hay integración con TMDB ni similares); todo el catálogo proviene del backend propio.

| Servicio | Método | Endpoint | Descripción |
|---|---|---|---|
| `movies.service.ts` | `GET` | `/movies` | Listar cartelera |
| | `GET` | `/movies/:id` | Detalle de película |
| `showtimes.service.ts` | `GET` | `/showtimes/:id` | Detalle de una función |
| | `GET` | `/showtimes/movies/:id/showtimes` | Funciones disponibles por película |
| `tickets.service.ts` | `GET` | `/tickets/showtime/:id` | Tickets vendidos de una función (para calcular asientos ocupados) |
| | `POST` | `/tickets` | Comprar un ticket |
| | `POST` | `/tickets/bulk` | Comprar varios tickets en una sola operación |
| | `GET` | `/tickets/user/:id` | Historial de entradas del usuario |
| `user.service.ts` | `POST` | `/users/login` | Inicio de sesión |
| | `POST` | `/users` | Registro de usuario |
| | `POST` | `/users/create-reset-password` | Solicitar código de recuperación por email |
| | `POST` | `/users/verify-reset-code` | Verificar código de recuperación |
| | `POST` | `/users/reset-password` | Establecer nueva contraseña |

No hay manejo de token/`Authorization` header en `api.ts`: la autenticación es *stateless* solo del lado del cliente (ver [Limitaciones](#limitaciones-conocidas-y-deuda-técnica)).

## Flujo funcional

```
Login / Registro ──▶ Cartelera (MoviesPage) ──▶ Funciones (ShowtimesPage)
                                                          │
                                                          ▼
                                              Selección de asientos (SeatsPage)
                                                          │
                                                          ▼
                                       Confirmación + ticket en PDF (ConfirmationPage)
                                                          │
                                                          ▼
                                          Historial de entradas (MyTicketsPage)
```

La recuperación de contraseña es un flujo paralelo de 3 pasos bajo `src/pages/RecoverPassword/`: solicitud de código → verificación → nueva contraseña.

## Puesta en marcha

**Requisitos**: Node.js ≥18 y npm.

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd front-cine

# Instalar dependencias
npm install

# Configurar variables de entorno (ver sección siguiente)
# crear un archivo .env en la raíz con VITE_API_BACK_URL y VITE_API_FRONT_URL

# Levantar el servidor de desarrollo (Vite, accesible en red local por --host)
npm run dev
```

## Scripts disponibles

Definidos en [`package.json`](package.json):

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `vite --host` | Servidor de desarrollo con HMR, expuesto en la red local |
| `npm run build` | `tsc -b && vite build` | Verificación de tipos + build de producción en `dist/` |
| `npm run lint` | `eslint .` | Ejecuta ESLint sobre todo el proyecto |
| `npm run preview` | `vite preview` | Sirve localmente el build de producción |

No existe script `test`.

## Variables de entorno

**No hay `.env.example` en el repositorio** (solo `.env` está listado en `.gitignore`). Las variables requeridas, deducidas del uso de `import.meta.env` en el código, son:

| Variable | Uso | Archivo | Valor por defecto |
|---|---|---|---|
| `VITE_API_BACK_URL` | URL base del backend REST (se le concatena `/api`) | [`src/services/api.ts`](src/services/api.ts) | — (obligatoria, sin fallback) |
| `VITE_API_FRONT_URL` | URL propia del frontend, usada para construir el contenido del QR mostrado en el login | [`src/pages/LoginPage.tsx`](src/pages/LoginPage.tsx) | `http://localhost:3000` (fallback en código) |

> Se recomienda añadir un archivo `.env.example` versionado con ambas variables para facilitar el onboarding de nuevos desarrolladores.

Además, [`vite.config.ts`](vite.config.ts) define un **proxy de desarrollo** que reescribe `/api` hacia `http://10.7.125.77:3000` — una IP privada hardcodeada específica del entorno del autor original, no portable a otras máquinas del equipo.

## Servicios y dependencias externas

- **Backend REST propio** (no incluido en este repositorio), URL configurable por `VITE_API_BACK_URL`.
- **Google Fonts**: la fuente `Libre Barcode 128` (usada para el código de barras del ticket) se inyecta dinámicamente en runtime vía un `<link>` añadido al DOM en [`ConfirmationPage.tsx`](src/pages/ConfirmationPage.tsx) — dependencia de red externa en tiempo de ejecución, sin fallback si no hay conexión.
- **SonarQube / SonarCloud**: análisis estático configurado en [`sonar-project.properties`](sonar-project.properties) (`sonar.projectKey=CinemaxPremiumFrontend`) y en el workflow de CI (`sonar.projectKey=CinemaxPremium`) — **las dos claves de proyecto no coinciden**, revisar cuál está realmente activa en el dashboard de Sonar.
- No hay integración de autenticación de terceros (OAuth, Firebase Auth, Auth0): el login es contra el backend propio, sin JWT ni cabecera `Authorization` visible en el cliente HTTP.

## Calidad de código, testing y CI/CD

- **Linting**: ESLint 9 con *flat config* ([`eslint.config.js`](eslint.config.js)), reglas de `typescript-eslint`, `eslint-plugin-react-hooks` y `eslint-plugin-react-refresh`.
- **Testing**: **no hay ningún framework de testing instalado** (sin Vitest, Jest, React Testing Library, Cypress ni Playwright), ni carpetas `__tests__` o archivos `*.test.tsx`/`*.spec.tsx`. No hay script `npm test`.
- **CI**: [`.github/workflows/build.yml`](.github/workflows/build.yml) — pipeline en `windows-latest` que en cada push a `main` ejecuta `npm ci` → `tsc --noEmit` → SonarQube Scan (acción `SonarSource/sonarqube-scan-action@v6`, requiere los secrets `SONAR_TOKEN` y `SONAR_HOST_URL`). El paso de *Quality Gate* está comentado/deshabilitado, por lo que hallazgos críticos de Sonar no bloquean el pipeline.
- **Despliegue**: no hay `Dockerfile`, `docker-compose.yml`, `vercel.json` ni `netlify.toml` — no hay una plataforma de hosting definida en el repositorio; solo build local (`npm run build` → `dist/`).

## Limitaciones conocidas y deuda técnica

Revisión honesta del estado actual del código:

- 🔓 **Autenticación débil**: no hay JWT ni token de sesión — se persiste el objeto `UserDto` completo (que incluye el campo `password`) en `localStorage` sin cifrar. No hay *route guards* en [`Router.tsx`](src/routes/Router.tsx); la única verificación de sesión es una comprobación manual de `localStorage.getItem("user")` dentro del flujo de compra en `SeatsPage.tsx`, evitable navegando directo a otra ruta.
- 💰 **Precios de asientos hardcodeados y duplicados**: `generateSeats()` está copiada casi literalmente en `SeatsPage.tsx` y `ConfirmationPage.tsx`, junto con los precios fijos `{ standard: 9.99, premium: 12.99, vip: 16.99 }` repetidos en tres puntos distintos, ignorando el campo `showtime.price` real del backend — riesgo alto de inconsistencia si los precios cambian del lado del servidor.
- 🧟 **Código muerto**: [`src/types/cinemaTypes.ts`](src/types/cinemaTypes.ts) (interfaces paralelas sin uso), `src/assets/react.svg` (asset de plantilla de Vite), un bloque de tipo comentado en `ShowtimesPage.tsx`, y un modal de confirmación completo en `ConfirmationPage.tsx` cuyo `setIsModalOpen(true)` nunca se invoca.
- 🔗 **Enlaces y controles sin implementar**: `Header.tsx` enlaza a `/profile`, ruta inexistente en `Router.tsx`; el botón "Ver QR" en `MyTicketsPage.tsx` no tiene `onClick`; los filtros "Estrenos"/"Próximamente"/"Todas" en `MoviesPage.tsx` son decorativos, sin lógica de filtrado.
- 🎭 **Manejo de errores inconsistente**: `LoginPage.tsx` usa `alert()` nativo del navegador; `RegisterPage.tsx` solo hace `console.error` sin feedback visual si falla el registro.
- ✉️ **Validación de dominio cuestionable**: `RegisterPage.tsx` obliga a que el correo termine en `@gmail.com`, excluyendo arbitrariamente cualquier otro proveedor.
- ⏱️ **Espera arbitraria en generación de PDF**: `ConfirmationPage.tsx` usa un `setTimeout` fijo de 1000ms antes de capturar el ticket con `html2canvas`, en vez de esperar un evento real — riesgo de condición de carrera en dispositivos lentos.
- 🏷️ **Naming inconsistente**: la clase `TicKetBuy` (mayúscula interna incorrecta) y la variable `mockTickets` en `MyTicketsPage.tsx` (nombre residual de una etapa con datos simulados, aunque ya consume la API real).
- 🌐 **Config de red no portable**: el proxy de desarrollo en `vite.config.ts` apunta a una IP privada hardcodeada (`10.7.125.77`), específica de la máquina del autor original.
- 🔍 **SonarQube con clave de proyecto duplicada/divergente** entre `sonar-project.properties` y el workflow de CI.
- 📄 **Sin `.env.example`** ni archivo `LICENSE` versionado en el repositorio.
- 🧪 **Cobertura de pruebas nula**: sin tests unitarios ni end-to-end, pese a lógica de negocio no trivial (cálculo de disponibilidad/precio de asientos, validaciones de formularios).

## Roadmap sugerido

- [ ] Implementar autenticación basada en tokens (JWT) con expiración y refresh, en vez de persistir el usuario completo en `localStorage`.
- [ ] Añadir *route guards*/rutas protegidas en `Router.tsx` para páginas que requieren sesión (`/seats`, `/confirmation`, `/my-tickets`).
- [ ] Unificar el cálculo de precio de asientos usando los datos reales del backend (`showtime.price` / `SeatDto.price`) y eliminar la duplicación de `generateSeats()`.
- [ ] Completar funcionalidades a medias: página de perfil (`/profile`), botón "Ver QR", filtros de cartelera.
- [ ] Eliminar código muerto: `src/types/cinemaTypes.ts`, asset `react.svg`, modal sin usar en `ConfirmationPage.tsx`.
- [ ] Añadir `.env.example` con `VITE_API_BACK_URL` y `VITE_API_FRONT_URL`, y parametrizar el proxy de desarrollo.
- [ ] Incorporar una suite de tests (Vitest + React Testing Library como mínimo) y activar el Quality Gate de SonarQube en CI.
- [ ] Añadir un archivo `LICENSE`.

## Licencia

No se incluye archivo `LICENSE` en el repositorio. Definir y agregar la licencia correspondiente antes de una distribución formal del proyecto.
