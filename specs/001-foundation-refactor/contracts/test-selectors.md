# Contract: Test selectors and test data

`data-cy` attributes are part of the public test interface: renaming one is a breaking change for
the E2E suite. Existing admin selectors (`admin-project`, `create-project`, `edit-project-form`,
`save-project`, `edit-project`, `delete-project`, `visibility-toggle`, `visibility-pill`,
`form-visibility-*`) stay unchanged.

## New desktop selectors (PR 1, invisible to visitors)

| Selector | Element | Extra attributes |
|---|---|---|
| `desktop` | desktop root | `data-theme="<ThemeName>"` |
| `desktop-icon` | each desktop icon button | `data-icon-id="<id>"` |
| `window` | each open window frame | `data-window-type="<AppType>"`, `data-window-id` |
| `window-minimize` / `window-close` | window control buttons | |
| `taskbar` | taskbar root | |
| `taskbar-entry` | taskbar window entry | `data-window-id`, `data-active="true|false"` |
| `taskbar-entry-close` | close button on an entry | |
| `theme-option` | theme switcher button | `data-theme-option="<ThemeName>"` |

## Test data rules (FR-003a)

- Admin tests create data only with titles starting with `CYPRESS TEST`.
- `cleanupTestProjects` task runs in `before()` and `after()` of the admin suite and deletes every
  project with that prefix, signed in as the admin test account (normal row-level security).
- Desktop tests never write data and start with cleared local storage at a 1440×900 viewport.
