# Data Model: Foundation Refactor and Backlog

No database changes (FR-025). This document describes the in-app types after the refactor. Shapes
are given as field lists; the exact TypeScript lives in the code.

## ThemeName

- Source: `features/theme/themeNames.ts`: the only list of theme names.
- Values: `Win98`, `classicMac`, `WinXP`, `debug` (unchanged strings, so stored localStorage values
  stay valid).
- Validation: `isThemeName(value: string | null): value is ThemeName` is derived from the list.
- Default: `WinXP`.

## ThemeDefinition

One per theme in `features/theme/themes/<name>.ts`. Contract:
[theme-definition.md](./contracts/theme-definition.md).

| Group | Fields (class strings unless noted) | Replaces flat `WindowTheme` keys |
|---|---|---|
| `window` | `frame`, `titleBar`, `titleBarInactive`, `content`, `dragging` | `frame`, `titleBar`, `titleBarInactive`, `content`, `draggingWindow` |
| `controls` | `button`, `windowButton`, `closeButton` | `button`, `controlButton`, `closeButton` |
| `project` | `image`, `tag`, `link`, `description`, `duration` | `projectImage`, `projectTag`, `projectLink`, `projectDescription`, `projectDuration` |
| `taskbar` | `bar`, `startButton`, `windowButton`, `windowButtonActive`, `tray` | `taskbar`, `taskbarStartButton`, `taskbarWindowButton`, `taskbarWindowButtonActive`, `taskbarTray` |
| `desktop` | `background` | `desktopBackground` |
| `assets` | `taskbarLogo` (path), `loginIcon` (path) | hard-coded `/icons/${theme}/…` paths in `Taskbar` |

Rules: every theme defines every field (enforced by the type); values are copied verbatim from
today's `windowThemes.ts` (no visual change).

## Theme registry

- `Record<ThemeName, ThemeDefinition>` in `features/theme/themes/index.ts`.
- `useThemeDefinition()` returns `{ name, definition }` for the active theme; components use only
  `definition`. The name is only rendered where it is shown as text today (theme switcher label,
  taskbar tray).

## WindowState and transitions

`features/windows/types.ts`

| Field | Type | Notes |
|---|---|---|
| `id` | string | `<type>-<uuid>`; initial contact window keeps id `Contact-startup` |
| `type` | `AppType` | `theme-switcher` \| `projects` \| `about` \| `contact` |
| `minimized` | boolean | |
| `zIndex` | number | stacking order |
| `project` | `DisplayProject` (optional) | required when `type = projects` |

`WindowManagerState`: `{ windows: WindowState[], activeWindowId: string | null, highestZIndex: number }`
(initial: one contact window, active `Contact-startup`, highest 1; identical to today).

| Action | Effect (must match current behaviour) |
|---|---|
| `open(type, project?)` | append window with `zIndex = highestZIndex`, make active, `highestZIndex + 1`; `projects` without project throws |
| `focus(id)` | `zIndex = highestZIndex + 1`, `minimized = false`, make active, `highestZIndex + 1` |
| `minimize(id)` | `minimized = true`; clear active if it was active |
| `close(id)` | remove; clear active if it was active |

Derived: taskbar entries (`id`, `title`, `minimized`, `active`, `icon`, `iconSrc`), visible windows
(`!minimized`).

## AppDefinition

`features/windows/appDefinitions.tsx`. Contract: [app-definition.md](./contracts/app-definition.md).

| Field | Notes |
|---|---|
| `title` | from `content/en.ts` |
| `icon` | glyph string (unchanged values) |
| `width`, `height` | unchanged numbers |
| `startPosition` | `default` \| `right` |
| `desktopLabel` (optional) | icons only shown for apps that have one; from content |
| `render(window)` | returns the chrome-free app component |

## DesktopIconSelection

`features/desktop/useDesktopIconSelection.ts`: `{ selectedIconId: string | null, select(id), clear() }`;
clears on pointer down outside any `[data-desktop-icon]` (current behaviour).

## Project types (unchanged shapes)

`features/projects/types.ts`: `ProjectRow` (DB names: `imagesrc`, `Github_Link`, `desktop_icon_src`,
`is_visible`, … unchanged), `Project`, `DisplayProject`, `ProjectInputData`. DB naming appears only
in `ProjectRow` and `mappers.ts` (constitution V).

## Messages

`content/en.ts`: nested read-only object, grouped by feature; exported `Messages` type. Contract:
[content-and-config.md](./contracts/content-and-config.md).

## SiteConfig

`config/site.ts`: `siteUrl`, `siteName`, `contactFormEndpoint`, `githubUrl`. Values equal to today's
literals.

## BacklogItem (document entity)

In `docs/backlog.md`. Contract: [backlog-and-github.md](./contracts/backlog-and-github.md).

| Field | Values |
|---|---|
| `id` | GitHub issue number, or `F-n` for a new follow-up (gets an issue number once created) |
| `title` | English |
| `type` | feature / enhancement / bug / tech-debt |
| `status` | not started / partly done / done in code / needs decision |
| `done` / `remaining` | short lists checked against the code |
| `priority` | high / medium / low |
| `dependsOn` | other backlog ids |
| `suggestedSpec` | position in the recommended spec order |
