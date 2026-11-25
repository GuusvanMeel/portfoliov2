/** Everything that differs between themes. Values are Tailwind classes or asset paths. */
export type ThemeDefinition = {
  window: {
    frame: string;
    titleBar: string;
    titleBarInactive: string;
    content: string;
    dragging: string;
  };
  controls: {
    button: string;
    windowButton: string;
    closeButton: string;
  };
  project: {
    image: string;
    tag: string;
    link: string;
    description: string;
    duration: string;
  };
  taskbar: {
    bar: string;
    startButton: string;
    windowButton: string;
    windowButtonActive: string;
    tray: string;
  };
  desktop: {
    background: string;
  };
  assets: {
    taskbarLogo: string;
    loginIcon: string;
  };
};
