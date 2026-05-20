# Data Configuration Hub

React + TypeScript + Vite

---

## Agent Contract

- Make small, focused diffs that preserve existing architecture and naming.
- Read related feature, service, and locale files before editing.
- Do not perform broad refactors unless explicitly requested.
- Prefer existing patterns and shared components over new abstractions.

## Required Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run lint       # run ESLint
npm run build      # type-check and production build
npm run preview    # preview production build
```

---

## Project Invariants

### Routing and Navigation

- Keep route changes synchronized across `src/router.tsx`, `src/features/layout/menu.json`, and `src/locales/*/pages.json`.
- New routed screens belong in `src/features/{featureName}/`.

### API Access

- Do not call `fetch` directly in UI code.
- Route API traffic through `src/services/internalRouter.ts` using service wrappers in `src/services/*`.
- Keep endpoint strings in service files, not in components.

### Components and UI

- Reusable UI belongs in `src/components/ComponentName/` with `ComponentName.tsx` and `ComponentName.scss`.
- No es necesario crear un archivo `index.ts` para exponer componentes.
- Use `@` path aliases for internal imports (`components`, `features`, `services`, `utils`, `locales`, etc.) instead of relative paths when possible.
- Prefer `React.forwardRef` when wrapping native controls.
- Use explicit TypeScript types; avoid `any`.

### Styling and Theme

- Use Tailwind v4 via `@import "tailwindcss"` in `src/styles/index.css`.
- Do not hard-code colors; use `--color-*` theme tokens.
- Use spacing/size/radius tokens (`--space-*`, `--size-control-*`, `--radius-*`).
- Keep BEM naming for CSS classes and colocate SCSS with the owning feature/component.

### Icons

- Use `lucide-react` for all UI icons.
- Do not add other icon packs unless explicitly requested.
- Import icons by name from `lucide-react`.
- For icon-only buttons/links, always include `aria-label`.

### Localization

- Use `react-i18next` with `common` and `pages` namespaces.
- Avoid hard-coded user-facing strings outside tests/stories.

---

## Completion Checklist

- Run `npm run lint` and `npm run build` before marking work complete.
- If checks fail, report root cause and impacted files.
