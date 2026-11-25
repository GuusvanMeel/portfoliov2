# Contract: App definition and app content

Applies to `features/windows/appDefinitions.tsx` and `components/apps/*`.

## App definition

```ts
type AppDefinition = {
  title: string;                       // from content/en.ts
  icon: string;                        // glyph shown when no image icon exists
  width: number;
  height: number;
  startPosition: "default" | "right";
  desktopLabel?: string;               // present => shown as desktop icon
  render: (window: WindowState) => React.ReactNode;
};
type AppType = "theme-switcher" | "projects" | "about" | "contact";
const appDefinitions: Record<AppType, AppDefinition>;
```

## App content components (`components/apps/*`)

1. Render only the inside of a window: no title bar, close/minimize buttons, drag handling or
   z-index (constitution I).
2. Receive data via props; read texts from `content/en.ts` and theme classes via
   `useThemeDefinition()`.
3. Must work unchanged inside a future mobile shell (no assumptions about window size beyond
   responsive layout).

## Adding an app later

Add an `AppType`, an `AppDefinition` and a component under `components/apps/`. `Desktop`,
`Taskbar` and the window manager need no changes.
