# AI Coding Agent Instructions

Purpose: Make agents productive quickly in this React + Vite + TypeScript + React Query + Tailwind project.

## Big Picture
- SPA bootstrapped by Vite (`main.tsx` -> `App.tsx` -> `Routes.tsx`).
- Data layer: Axios wrapper `src/Api/index.tsx` + React Query for caching and auth token propagation.
- Auth token & user object are stored in React Query cache under key `["user"]` (see `useAuth.tsx`, `useUser.tsx`). All API calls derive Bearer token via Axios request interceptor.
- Routing uses `react-router-dom@7` with `createBrowserRouter` and dynamic `import.meta.env.VITE_BASE_URL` path prefix. Feature views are lazy‑loaded.
- UI built with Tailwind (custom colors in `tailwind.config.js`) and custom components under `src/Components/**` plus feature‑scoped components inside `src/Views/<Feature>`.
- State co-location: Feature folders bundle `forms/`, `hooks/`, `Components/` (example: `Views/Transport`).

## Conventions & Patterns
- Path alias `@/` resolves to `src/` (implied by usage like `import ApiClient from "@/Api"`). Preserve it in new imports.
- React Query keys: Use tuple style, e.g. `["inventory", params]` (`useGetInventory`). When mutating, invalidate or update those same keys.
- API wrapper: Prefer `useApiClient()` hook to construct an `ApiClient` with current token. Do not import axios directly in feature code; extend `ApiClient` if new HTTP verbs/interceptors needed.
- Error handling: Parse Axios errors using `fnParseGetMessage` to surface a single user‑friendly message via `react-hot-toast`.
- Auth flow: On successful login, store full response (which includes `access_token`) with `queryClient.setQueryData(["user"], data)`. New hooks needing the token call `useUser()`.
- Pagination: Hooks like `useGetInventory` accept `page`, `limit`, filters; if backend returns a bare array, hook simulates pagination metadata in `select`. Follow same pattern for new list hooks.
- Tables: `DynamicTable` expects column definitions `{ key, name }` and uses special keys: `action`, `actionButton`, `active` to render extra cells. Provide `columns` without those keys for standard fields; set `loading` and `emptyMessage` for UX.
- Forms: Use `react-hook-form` with a `FormProvider` wrapping inputs. Custom inputs reside in `Components/Input/*` and accept `name`, `label`, `rules` props.
- Styling: Use Tailwind utility classes; shared brand color appears as `text-optimed-tiber` etc. (extend palette if needed in `tailwind.config.js`). Avoid inline styles unless dynamic logic requires.
- Env vars: Backend base URL `import.meta.env.VITE_API_URLBASE`; optional fallback token `VITE_TOKEN`; route base `VITE_BASE_URL`. When adding new env usage, always gate behind `import.meta.env`.
- Lazy routes: Add new routes by creating a `lazy(() => import("./Views/NewFeature"))` const in `Routes.tsx` and extend the route array. Keep Suspense fallback consistent (`Cargando...`).

## Typical Workflows
- Start dev server: `npm run dev`.
- Build production: `npm run build`; preview with `npm run preview`.
- Lint: `npm run lint` (ESLint config in `eslint.config.ts`). Fix issues before committing.
- Add data fetch hook: Create under `src/Views/<Feature>/hooks/useGetX.ts` using `useQuery`; key format `["x", params]`; use `apiClient.get/post/...`; expose strongly typed data & params interface.
- Add mutation hook: Use `useMutation`; on success, either `queryClient.invalidateQueries({ queryKey: ["x"] })` or optimistically update cache.

## File/Folder Signals
- `src/Views/*`: Feature pages (routable). Each may contain localized `forms/`, `hooks/`, `Components/`.
- `src/Components/*`: Reusable UI primitives (tables, buttons, inputs, modal, etc.). Favor reuse over duplicating similar markup in features.
- `src/hooks/*`: Cross‑feature hooks (auth, api client, user state, responsive helpers).
- `src/types/*`: Domain model types (e.g. `user.ts`, `product.ts`). Reference these in hooks & components instead of redefining shapes.
- `src/Api/utils/*`: Shared API helper utilities (error parsing, etc.).

## Adding Inventory-like Feature Example
1. Create folder `src/Views/Orders` with `hooks/useGetOrders.ts` mirroring `useGetInventory` (params interface, queryKey `["orders", params]`).
2. Add types in `src/types/order.ts` if new shape.
3. Expose table using `DynamicTable`, build `columns` array and pass fetched `data?.data`.
4. Register route in `Routes.tsx` with lazy import.

## Quality Expectations
- Keep hooks pure, no direct DOM access. Derive token only via `useUser` / `useApiClient`.
- Ensure query keys are stable (objects fully serializable; avoid inline functions in key).
- For new components, export default and keep props typed; reuse existing patterns for pagination & loading states.

## When Unsure
- Look at `useGetInventory`, `useAuth`, `DynamicTable` for canonical patterns.
- Reuse existing types from `src/types` before inventing new ones.

Provide changes as minimal diffs; avoid large-scale refactors without explicit request.
