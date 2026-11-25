# GuusOS

The developer portfolio of Guus van Meel, built as a retro desktop operating system. Visitors switch
between Windows 98, Windows XP, classic Mac OS and a debug theme; projects appear as `.exe` icons on
the desktop and open in draggable windows. A protected admin area manages the projects.

Live: <https://portfoliov2-brown-theta.vercel.app>

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4 for theme appearance, CSS modules for layout
- [Supabase](https://supabase.com) for data and authentication (server-side only)
- `react-rnd` for draggable windows
- Vitest (browser mode with Playwright), Cypress, Lighthouse CI, SonarCloud
- Hosted on Vercel

## Folder structure

```text
app/                 routes: home page, login, admin (with route-private _components/)
components/          shared UI: Desktop, DesktopIcon, DraggableWindow, WindowFrame, Taskbar,
                     ThemeSwitcher; window content in components/apps/
features/            logic and data
  theme/             theme names, theme definitions (one file per theme), ThemeProvider
  windows/           window reducer, useWindowManager, app definitions
  desktop/           desktop icon selection
  projects/          server actions, types, database mappers
  images/            image URL helpers (Cloudinary, Supabase storage)
hooks/               generic hooks (useEscapeKey, useClickOutside)
content/en.ts        all user-facing text
config/site.ts       site URL, contact form endpoint, social links
lib/supabase/        Supabase clients for browser, server and proxy
cypress/             end-to-end tests
specs/               Spec Kit specifications
docs/backlog.md      backlog and planned specs
```

Adding a theme only needs a name in `features/theme/themeNames.ts`, a definition in
`features/theme/themes/` and its icons in `public/icons/<theme>/`. The rules behind this structure
are in `.specify/memory/constitution.md`.

## Getting started

Requirements: Node.js 22.

1. `npm ci`
2. Create `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. `npm run dev` and open <http://localhost:3000>

## Scripts

| Script                                       | What it does                                               |
| -------------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                                | development server                                         |
| `npm run build` / `npm start`                | production build and server                                |
| `npm run lint` / `npm run typecheck`         | ESLint and TypeScript checks                               |
| `npm run format` / `npm run format:check`    | format with Prettier / check formatting                    |
| `npm run test:components`                    | Vitest component tests in a headless browser               |
| `npm run test:components:coverage`           | the same with coverage (`coverage/vitest/`)                |
| `npm run cypress:open`                       | Cypress in interactive mode (needs a running app)          |
| `npm run dev:coverage`                       | development server with coverage instrumentation (Windows) |
| `npm run coverage:report`                    | coverage report from a Cypress run                         |
| `npm run lighthouse:local` / `lighthouse:ci` | Lighthouse against the local app / Lighthouse CI           |

## Tests

- **Component tests** (Vitest browser mode): hooks, the window reducer, theme names, mappers and
  components. Test files sit next to the code as `*.test.ts(x)`. Run `npx playwright install
chromium` once before the first run.
- **End-to-end tests** (Cypress) in `cypress/e2e/`: the desktop (open, focus, minimize, restore and
  close windows, switch themes, open a project) and the admin flows (log in and out, create, edit,
  toggle visibility and delete a project). Run them against a production build:

  ```bash
  npm run build
  npm start
  npx cypress run
  ```

- **Admin test account**: the admin and login tests sign in with `TEST_EMAIL` and `TEST_PASSWORD`
  from `cypress.env.json` (not committed; in CI they come from the `ADMIN_EMAIL` and
  `ADMIN_PASSWORD` secrets).
- **Guaranteed cleanup**: admin tests only create projects whose title starts with `CYPRESS TEST`.
  The `cleanupTestProjects` task in `cypress.config.ts` deletes all of them before and after the
  admin suite, so an aborted run leaves no test data behind.
- **Coverage**: set `CYPRESS_COVERAGE=true` when building to instrument the app with
  `swc-plugin-coverage-instrument`; normal and production builds are never instrumented.

## CI pipeline

`.github/workflows/main.yml` runs on pull requests into `Development` and `master` and on pushes to
those two branches. A newer push cancels a run that is still going for the same pull request or
branch.

1. **Lint, typecheck and build**: ESLint, TypeScript, Vitest with coverage, `next build`
2. **End-to-End**: coverage build, the full Cypress suite, coverage report, videos and screenshots
3. **Lighthouse**: Lighthouse CI; accessibility must be at least 0.90
4. **SonarQube**: SonarCloud analysis with the Vitest and Cypress coverage (currently non-blocking,
   see `docs/backlog.md`)

Changes that only touch documentation (`docs/`, `specs/`, `.specify/`, `.claude/`, `*.md`) skip
everything except the change detection. Lighthouse measures the production build of the first job.

## Credits

Windows 98 icons: <https://win98icons.alexmeub.com>
