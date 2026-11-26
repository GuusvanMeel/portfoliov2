# Feature Specification: Reliable End-to-End Tests and a Separate Test Database

**Feature Branch**: `002-reliable-e2e-test-db`

**Created**: 2026-11-26

**Status**: Implemented

**Input**: User description: "Reliable end-to-end tests and a separate test database. Goal: every end-to-end test is useful and trustworthy, and no test ever reads from or writes to the live database." (full description: E2E audit, coverage gaps, separate test database F-3 #43, admin check in every data-changing action F-4 #44, small fixes F-6 #46 and F-15 #53, README testing section, sabotage of every new or changed E2E test. The original "ten consecutive green runs" requirement was dropped in clarification.)

**Resolves**: #43 (F-3), #44 (F-4), #46 (F-6), #53 (F-15)

## Clarifications

### Session 2026-11-26

- Q: Who counts as an "admin" for the server check on project changes? → A: A signed-in user whose email is in a configured admin allowlist (environment setting).
- Q: Separate Supabase project or branch for the test database? → A: A separate free-tier Supabase project used only by tests.
- Q: Reset strategy for the test database? → A: Reset to the seed once before every run; CI runs that use the test database are serialised.
- Q: What does a signed-in non-admin see on `/admin`? → A: They are redirected to the main page (`/`). In practice the maintainer is the only real user and the only admin; the non-admin account exists only in the test database.
- Q: Turn off new sign-ups in the live project? → A: Yes; added to the maintainer's manual steps (also off in the test project; test accounts are created by the reset script).
- Q: How to prove "ten green runs in a row"? → A: Dropped. No repeated-run requirement; the suite must simply pass locally and in CI without retries.

## User Scenarios & Testing *(mandatory)*

The "users" of this feature are the maintainer (who runs and trusts the tests), the CI pipeline,
and — for the admin check — anyone who sends a data-changing request to the site. Visitors see no
change.

### User Story 1 - Tests never touch the live database (Priority: P1)

As the maintainer, I run the full test suite locally or in CI and it reads from and writes to a
dedicated test database only, which starts from a known seed (visible projects, hidden projects
and an admin test account). The live site keeps using the live database.

**Why this priority**: Today the admin tests write `CYPRESS TEST` projects to the live database
and the project-window test is skipped because live data has no visible projects. Every other
story depends on a predictable, disposable data set.

**Independent Test**: Point the suite at the test database, run it, and confirm that the live
database's projects are unchanged and that the test database is back at its seed after a reset.

**Acceptance Scenarios**:

1. **Given** the test database configuration is present, **When** the suite runs locally or in CI, **Then** every data read and write goes to the test database and none to the live database.
2. **Given** the test configuration is missing or points at the live database, **When** the suite starts, **Then** it refuses to run with a clear message instead of falling back to the live database.
3. **Given** the test database contains leftover or changed data, **When** the maintainer runs the documented reset, **Then** the test database returns exactly to the seed.
4. **Given** a fresh empty database project, **When** the maintainer applies the committed schema files following the documented steps, **Then** the schema matches what the application expects and the seed can be loaded.
5. **Given** the production deployment, **When** a visitor opens the site, **Then** it shows live data exactly as before.

---

### User Story 2 - Data-changing actions refuse anyone who is not a signed-in admin (Priority: P1)

As the site owner, I want creating, editing, changing visibility of and deleting projects to be
refused on the server whenever the request does not come from a signed-in admin, regardless of how
the request reached the server.

**Why this priority**: Security fix (constitution V). Protection currently relies on the route
proxy and row-level security only.

**Independent Test**: Send each of the four data-changing requests without a signed-in admin and
confirm each is refused and the data is unchanged; repeat as admin and confirm each succeeds.

**Acceptance Scenarios**:

1. **Given** no one is signed in, **When** a create, update, visibility change or delete request is made, **Then** it is refused, nothing changes in the database, and the caller receives a "not authorised" result.
2. **Given** a signed-in user who is not an admin, **When** any of these requests is made, **Then** it is refused in the same way.
3. **Given** a signed-in admin, **When** any of these requests is made with valid input, **Then** it succeeds as today.
4. **Given** a signed-in user who is not an admin, **When** they open `/admin`, **Then** they are redirected to the main page and see no admin interface.

---

### User Story 3 - Every end-to-end test is trustworthy (Priority: P2)

As the maintainer, I want each existing end-to-end test reviewed and kept, improved or removed, so
that every remaining test checks real user-visible behaviour, has no duplicate, uses no fixed
waits or conditional skips, and has been seen to fail when the behaviour breaks.

**Why this priority**: A suite that passes without checking anything gives false confidence.

**Independent Test**: Read the audit table in the verification notes: every test in the current
suite has a decision and reason, and every kept or changed test has a recorded sabotage result.

**Acceptance Scenarios**:

1. **Given** the current suite, **When** the audit is complete, **Then** each test has a recorded decision (keep / improve / remove) with a reason.
2. **Given** a test that only checks that an element exists, uses a fixed wait, depends on live data, or silently skips, **When** it is improved, **Then** it asserts an outcome a visitor or admin can see and waits only on observable conditions.
3. **Given** any new or changed end-to-end test, **When** the code or assertion it guards is temporarily broken, **Then** the test fails for the intended reason, and this is recorded in the verification notes.

---

### User Story 4 - Coverage gaps are closed (Priority: P2)

As the maintainer, I want end-to-end tests for the flows that currently lack them.

**Why this priority**: These are user-visible flows that could break unnoticed.

**Independent Test**: Run each new test against the seeded test database; each passes and each has
a recorded sabotage.

**Acceptance Scenarios**:

1. **Given** the seed has visible projects, **When** a visitor double-clicks a project `.exe` icon, **Then** a window opens showing that project's title and details, and hidden projects have no icon.
2. **Given** the contact form with the outgoing send request intercepted, **When** the visitor submits valid input and the send succeeds, **Then** the success feedback is shown and no real message is sent.
3. **Given** the contact form with the send request intercepted to fail, **When** the visitor submits, **Then** the failure feedback is shown and the entered input is not lost (or behaves as currently designed).
4. **Given** a signed-in admin and a forced server failure, **When** saving, deleting or toggling visibility fails, **Then** the admin sees an error message and the list still shows the unchanged data.
5. **Given** the desktop, **When** the visitor opens the start menu, **Then** it opens, shows its items and closes again on the expected interactions.
6. **Given** open windows, **When** the visitor looks at the taskbar, **Then** there is one entry per open window and the active window's entry is marked.
7. **Given** a visitor selected a theme, **When** the page is reloaded, **Then** the same theme is shown from the first render.
8. **Given** further gaps found by the audit, **When** the audit is done, **Then** each gap either gets a test in this spec or is recorded in the backlog with a reason.

---

### User Story 5 - Small related fixes and documentation (Priority: P3)

As the maintainer, I want the `supebase_url` typo fixed, the end-to-end coverage report to count
the desktop flows the suite exercises, and a short testing section in the README.

**Why this priority**: Low-risk clean-up that makes the testing story complete.

**Independent Test**: Inspect the fixed name; open the end-to-end coverage report and confirm the
desktop window-management code shows as covered; follow the README on a clean checkout to run the
tests against the test database.

**Acceptance Scenarios**:

1. **Given** the server data client setup, **When** it is read, **Then** the misspelled name no longer exists and behaviour is unchanged.
2. **Given** an end-to-end run with coverage, **When** the report is produced, **Then** the desktop window, taskbar and theme code exercised by the desktop tests shows non-trivial line coverage.
3. **Given** the README, **When** a developer reads the testing section, **Then** it states which test layer covers what and how to run all tests locally against the test database, including the reset.

---

### Edge Cases

- A test run is aborted halfway: the next run must still start from the seed, because every run starts with a reset.
- Two CI runs are triggered at the same time: the second waits until the first has finished with the test database.
- The admin's session expires between loading the admin page and saving: the request is refused like an unauthenticated one and the admin sees an error.
- The test database is unreachable: the suite fails fast with a clear message, it does not silently skip tests.
- A test that intercepts a request is not allowed to let the real request through on a mismatch.

## Requirements *(mandatory)*

### Functional Requirements

**Test database (F-3, #43)**

- **FR-001**: The test suite (local and CI) MUST use a dedicated test database that is separate from the live database; the production deployment MUST keep using the live database.
- **FR-002**: The test setup MUST refuse to run when its database configuration is missing or identical to the live database's.
- **FR-003**: The database schema MUST be committed as SQL migration files that, applied in order to an empty database, produce the schema the application uses today (including row-level security rules and storage needed by the admin flows).
- **FR-004**: Seed data MUST be committed and contain at least two visible projects, at least one hidden project, an admin test account (on the allowlist) and a non-admin test account (not on the allowlist); the test account's credentials MUST NOT be committed in plain text and MUST come from local/CI secrets.
- **FR-005**: There MUST be one documented command that resets the test database to the seed, and every end-to-end run MUST start with that reset. CI runs that use the test database MUST be serialised (never two at the same time).
- **FR-006**: The spec's deliverables MUST include an exact, ordered list of manual steps for the maintainer: creating the test database project, applying the migrations, loading the seed, creating the admin test account, turning off new sign-ups in both the live and the test project, setting the production admin allowlist, and adding each named CI secret and local environment variable.

**Admin check (F-4, #44)**

- **FR-007**: Creating, updating, changing visibility of and deleting a project MUST each verify on the server that the request comes from a signed-in admin before touching any data. An admin is a signed-in user whose email is in the admin allowlist configured as an environment setting; an empty or missing allowlist means no one is admin.
- **FR-008**: A refused request MUST change no data and return a "not authorised" result that the admin interface shows as an error message.
- **FR-008a**: A signed-in non-admin who opens `/admin` MUST be redirected to the main page (`/`).
- **FR-009**: Each of the four checks MUST be covered by an automated test that fails when the check is removed.

**E2E audit and quality**

- **FR-010**: Every existing end-to-end test MUST be listed in the verification notes with a decision (keep / improve / remove) and reason, judged on: tests user-visible behaviour, duplicate or not, flaky patterns (fixed waits, conditional skips, dependence on live data, ordering between tests).
- **FR-011**: After the audit, no end-to-end test MAY use fixed time waits, conditional skipping, or depend on another test's leftover state.
- **FR-012**: Every new or changed end-to-end test MUST be sabotaged locally (break the code or assertion, confirm the failure is for the intended reason, revert) and the result recorded in the verification notes; sabotage MUST NOT produce pushes or commits to the shared branch.

**Coverage gaps**

- **FR-013**: End-to-end tests MUST cover: opening a project window from a project `.exe` icon; contact form success and failure with the outgoing request intercepted so nothing is sent; admin failed save, failed delete and failed visibility toggle; start menu open/close; taskbar entries for open windows and the active one; the selected theme after a page reload.
- **FR-014**: Gaps found by the audit beyond FR-013 MUST be either covered by a test in this spec or recorded in `docs/backlog.md` with a reason.

**Small fixes and documentation**

- **FR-015**: The `supebase_url` typo in the server data client setup MUST be corrected without behaviour change (F-6, #46).
- **FR-016**: The end-to-end coverage report MUST include the desktop flows the suite exercises (F-15, #53).
- **FR-017**: The README MUST contain a short testing section: what each test layer covers and how to run each layer locally against the test database, including the reset.

**Stability and constraints**

- **FR-018**: The full end-to-end suite MUST pass locally and in CI with no automatic retries hiding failures.
- **FR-019**: Visitors MUST see no visible change; Lighthouse scores MUST NOT regress.
- **FR-020**: All code, tests and documentation MUST be in English.
- **FR-021**: When the spec is done, issues #43, #44, #46 and #53 and `docs/backlog.md` MUST be updated (closed or annotated with what was done; any newly found follow-ups added).

### Key Entities

- **Test database**: A separate database environment holding only seed and test-created data; reset to the seed on demand.
- **Seed data set**: Visible projects, hidden projects and an admin test account with known, documented properties.
- **Schema migration**: An ordered, committed description of the database structure that can rebuild the schema from empty.
- **Admin**: A signed-in user whose email is on the admin allowlist; everyone else, including other signed-in users, is refused.
- **Verification notes**: A spec document recording the audit table, and the sabotage results per test.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a full local and CI test run, the live database contains 0 rows created or changed by tests.
- **SC-002**: 100% of existing end-to-end tests have an audit decision, and 100% of new or changed end-to-end tests have a recorded sabotage that failed for the intended reason.
- **SC-003**: 0 end-to-end tests are skipped, conditionally skipped or use fixed time waits.
- **SC-004**: The end-to-end suite passes locally and in CI with retries disabled.
- **SC-005**: 4 out of 4 data-changing project actions refuse requests without a signed-in admin, each proven by a test.
- **SC-006**: Every flow listed in FR-013 has at least one passing end-to-end test.
- **SC-007**: A developer following only the README and the documented manual steps can run all test layers locally against the test database on the first attempt.
- **SC-008**: Visitors see no difference, and Lighthouse scores stay at or above the configured thresholds; the first run on the test database is recorded as the new baseline.

## Assumptions

- The test database is a separate free-tier Supabase project (decided; not a branch, not a local Docker instance).
- The maintainer performs all account-level steps (creating the project, the admin test account and the CI secrets); the implementation only documents them and provides the files and commands.
- "Admin" means a signed-in user whose email is on the configured admin allowlist; no role system or schema change is introduced. The production allowlist is set by the maintainer as part of the manual steps (FR-006).
- Contact form and admin failure paths are tested by intercepting or forcing failures; no real messages are sent and no real outages are needed.
- The live database's current schema is the source for the first migration. One intentional exception, found during implementation: the live `projects` table had a single policy "Allow all for now" (all commands for `public`, including anonymous visitors), so anyone with the public anon key could change or delete projects directly. The maintainer replaced it on 2026-11-26 with the policies in `0001_initial_schema.sql` (visitors read visible projects; signed-in users read all and write). No columns changed.
- The maintainer is the only real user and the only admin of the live site; the non-admin account exists only in the test database to prove the refusal.
- The production build (`next build` in the build job and on Vercel) may read live data to pre-render the page; tests never do.
- Server-side sign-in (F-5, #45) stays out of scope.
