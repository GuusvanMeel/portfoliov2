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
   ADMIN_EMAILS=you@example.com   # who may change projects in /admin
   ```

3. `npm run dev` and open <http://localhost:3000>

## Scripts

| Script                                       | What it does                                      |
| -------------------------------------------- | ------------------------------------------------- |
| `npm run dev`                                | development server                                |
| `npm run build` / `npm start`                | production build and server                       |
| `npm run lint` / `npm run typecheck`         | ESLint and TypeScript checks                      |
| `npm run format` / `npm run format:check`    | format with Prettier / check formatting           |
| `npm run test:components`                    | Vitest component tests in a headless browser      |
| `npm run test:components:coverage`           | the same with coverage (`coverage/vitest/`)       |
| `npm run dev:test`                           | development server against the test database      |
| `npm run test:db:reset`                      | reset the test database to the seed               |
| `npm run test:e2e`                           | Cypress end-to-end tests (needs a running app)    |
| `npm run cypress:open`                       | Cypress in interactive mode (needs a running app) |
| `npm run coverage:report`                    | coverage report from a Cypress run                |
| `npm run lighthouse:local` / `lighthouse:ci` | Lighthouse against the local app / Lighthouse CI  |

## Testing

Tests never touch the live database. Everything that reads or writes data uses a separate
Supabase **test project**, reset to the committed seed (`supabase/seed/projects.ts`) before every
end-to-end run. The schema lives in `supabase/migrations/`.

| Layer                 | What it covers                                                                                                                             | Where                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Vitest, browser group | components, hooks, window manager, theme names, mappers                                                                                    | `*.test.ts(x)` next to the code                   |
| Vitest, node group    | server-only logic: admin check, project actions, test-environment guard                                                                    | `*.server.test.ts`, `lib/testEnvironment.test.ts` |
| Cypress               | desktop (windows, taskbar, start menu, themes, project windows), contact form, admin flows and their error paths, sign-in and admin access | `cypress/e2e/`                                    |
| Lighthouse CI         | accessibility (hard gate), performance, best practices, SEO                                                                                | `lighthouserc.js`                                 |
| SonarCloud            | quality gate fed by Vitest and Cypress coverage                                                                                            | `sonar-project.properties`                        |

### Run the tests locally

One-time setup: create the test project and `.env.test.local` as described in
`specs/002-reliable-e2e-test-db/quickstart.md`. Run `npx playwright install chromium` once for
Vitest.

```bash
npm run test:components     # Vitest (browser + node groups)
npm run test:db:reset       # optional: reset the test database by hand
npm run build:test          # production build against the test database, with coverage
npm run start:test          # terminal 1: serve that build
npm run test:e2e            # terminal 2: Cypress (resets the test database first)
npm run coverage:report     # Cypress coverage summary
```

Run Cypress against `build:test` + `start:test`, like CI does; the development server compiles
pages on first visit, which makes clicks land before the page is ready. The tests refuse to start
when `.env.test.local` is missing or points at the live database.
Cypress runs without retries, so a flaky test fails visibly.

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
