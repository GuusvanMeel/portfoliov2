# Quickstart: Validating the Foundation Refactor

## Prerequisites

- Node.js 22, `npm ci`
- `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `cypress.env.json` (or env vars) with `TEST_EMAIL`, `TEST_PASSWORD` for the admin test account
- `npx playwright install chromium` for component tests
- GitHub CLI logged in (`gh auth status`) for the backlog sync (PR 3)

## Baseline (before PR 1 merges)

Record the baseline for later comparison:

```bash
npm run lint && npm run typecheck
npm run test:components:coverage      # note coverage summary
npm run build && npm start            # in a second terminal:
npx cypress run                       # all suites must pass
```

## Per PR validation

| PR | Run | Expected |
|---|---|---|
| 1 (US1) | `npx cypress run --spec cypress/e2e/desktop.cy.ts` 10× | 10/10 green (SC-001); no data written |
| 1 (US1) | `npx cypress run --spec cypress/e2e/admin.cy.ts`, abort mid-run, run again | leftover `CYPRESS TEST` project removed by next run (FR-003a) |
| 1 (US1) | `npm run test:components` | mapper + theme-name tests pass |
| 2 (US2) | full suite as in Baseline | identical results; coverage ≥ baseline (SC-009) |
| 2 (US2) | `npm run format:check` | no changes needed |
| 2 (US2) | manual: switch every theme, open/minimize/close each window, open a project, admin create/edit/delete | looks and behaves exactly as before (SC-002) |
| 2 (US2) | scratch branch: add dummy theme per [theme-definition](./contracts/theme-definition.md) | no component edits needed (SC-003) |
| 2 (US2) | search for Dutch words, theme-name comparisons, cross-component CSS imports | none found (SC-004, SC-005) |
| 3 (US3) | compare `docs/backlog.md` with `gh issue list --state open` | every open issue listed once with correct status (SC-008) |
| 3 (US3) | after approval: `gh issue list --label "priority: high"` etc. | GitHub matches the approved change table; nothing unapproved changed |
| 4 (US4) | `npm run build` (no `CYPRESS_COVERAGE`) and inspect output for `__coverage__` | not present (FR-020) |
| 4 (US4) | open a test PR with a failing assertion | pipeline fails at the E2E stage (SC-010) |
| 4 (US4) | read `.github/workflows/main.yml` | no commented-out steps, English summaries |

## Done

All pipeline stages green on each PR, Lighthouse accessibility ≥ 0.90, SonarCloud gate passed and
blocking, and the maintainer confirms no visible difference.
