# Contract: Theme definition

Applies to every file in `features/theme/themes/`.

## Shape

```ts
type ThemeDefinition = {
  window:   { frame: string; titleBar: string; titleBarInactive: string; content: string; dragging: string };
  controls: { button: string; windowButton: string; closeButton: string };
  project:  { image: string; tag: string; link: string; description: string; duration: string };
  taskbar:  { bar: string; startButton: string; windowButton: string; windowButtonActive: string; tray: string };
  desktop:  { background: string };
  assets:   { taskbarLogo: string; loginIcon: string };
};
```

## Rules

1. Only appearance (Tailwind classes) and asset paths: no layout values (sizes, spacing, flex/grid).
2. Every field is required; the registry type `Record<ThemeName, ThemeDefinition>` fails compilation
   when a theme or field is missing.
3. Components read `definition.<group>.<field>`; they never import a theme file directly and never
   compare theme names.
4. Adding a theme: add its name to `themeNames`, add `themes/<name>.ts`, register it in
   `themes/index.ts`, add assets under `public/icons/<name>/`. No component edits (SC-003).

## Verification

- Type check passes with all four themes registered.
- Scratch test: add a fifth dummy theme in a throwaway branch; it appears in the theme switcher and
  styles windows, taskbar and desktop without component edits.
