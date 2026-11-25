# Contract: Content and site configuration

## `content/en.ts`

- Exports `messages` (nested, `as const`) and `type Messages = typeof messages`.
- Top-level groups: `site` (metadata, sr-only intro), `desktop`, `taskbar` (start menu labels,
  start button "GuusOS"), `apps.themeSwitcher`, `apps.about`, `apps.contact`, `apps.project`,
  `admin`, `login`.
- Every user-facing string in components comes from here (FR-013). Exceptions: data from the
  database (project titles etc.) and theme names shown as labels.
- Visible English strings are copied verbatim (no visible change). Dutch metadata/sr-only strings are
  translated (R5).
- A future `content/nl.ts` must satisfy `Messages`.

## `config/site.ts`

| Key | Value (unchanged) | Used by |
|---|---|---|
| `siteUrl` | `https://portfoliov2-brown-theta.vercel.app` | `layout.tsx` metadataBase, `robots.ts`, `sitemap.ts` |
| `siteName` | `GuusOS Portfolio` | Open Graph |
| `contactFormEndpoint` | current Formspree URL | `ContactApp` |
| `githubUrl` | `https://github.com/GuusvanMeel` | admin header link |

Each value is defined only here (SC-006).
