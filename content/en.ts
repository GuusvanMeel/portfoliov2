/**
 * All user-facing English text. Components read their texts from here so that another language
 * can be added later by providing an object of the same `Messages` shape.
 */
export const messages = {
  site: {
    title: "Guus van Meel | Software Developer Portfolio",
    titleTemplate: "%s | Guus van Meel",
    description:
      "Portfolio of Guus van Meel, software developer specialising in web development, C#, JavaScript, Next.js and backend development.",
    author: "Guus van Meel",
    keywords: [
      "Guus van Meel",
      "Portfolio",
      "Software developer",
      "Web development",
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "C#",
      "Netherlands",
    ],
    openGraph: {
      title: "Guus van Meel | Portfolio",
      description: "View my projects, experience and contact information.",
      imageAlt: "Guus van Meel Portfolio",
    },
    intro: {
      heading: "Guus van Meel - Software Developer Portfolio",
      summary:
        "Portfolio of Guus van Meel, software developer specialising in web development, Next.js, React, TypeScript, JavaScript, C# and backend development.",
      navigation:
        "View my projects, experience and contact information through the interactive desktop interface.",
    },
  },
  desktop: {
    projectIconSuffix: ".exe",
    minimizeWindow: "Minimize",
    closeWindow: "Close",
  },
  taskbar: {
    startButton: "GuusOS",
    startMenu: {
      about: "About me",
      projects: "Projects",
      themeSwitcher: "Theme switcher",
      adminLogin: "Admin login",
    },
    closeWindow: "Close",
  },
  apps: {
    themeSwitcher: {
      title: "Switch the theme!",
      desktopLabel: "Themeswitcher.exe",
      currentTheme: "Current theme:",
    },
    about: {
      title: "About Me",
      desktopLabel: "about.exe",
      body: "About me content",
    },
    contact: {
      title: "Contact",
      desktopLabel: "contact.exe",
      nameLabel: "Your name:",
      emailLabel: "Your email:",
      messageLabel: "Your message:",
      send: "Send",
      sending: "Sending...",
      sent: "Message sent.",
      sendFailed: "Message could not be sent.",
      error: "Something went wrong. Please try again.",
    },
    project: {
      title: "Projects",
      layoutLandscape: "Landscape",
      layoutBlock: "Block",
      layoutMobile: "Mobile",
      techUsed: "Tech used",
      timeSpent: "Time spent",
      viewSource: "◈ View source on GitHub",
      description: "Description",
    },
  },
  admin: {
    header: {
      eyebrow: "Dashboard",
      title: "Admin – Projects",
      logout: "Logout",
      github: "My GitHub",
      back: "Back",
    },
    list: {
      listView: "List",
      gridView: "Grid",
      empty: "No projects yet. Create your first one.",
      create: "Create New Project",
    },
    item: {
      visible: "Visible",
      hidden: "Hidden",
      openGithub: "Open GitHub repo",
      hide: "Hide",
      show: "Show",
      edit: "Edit",
      delete: "Delete",
      imageAlt: "Project preview",
      confirmDelete: "Are you sure you want to delete this project?",
      visibilityFailed: "Could not update project visibility.",
      deleteFailed: "Could not delete project. Please try again.",
    },
    form: {
      close: "Close",
      editTitle: "Edit Project",
      createTitle: "Create Project",
      title: "Title",
      description: "Description",
      tags: "Tags (comma-separated)",
      duration: "Duration",
      imageUrl: "Image URL",
      imageFailed: "Image could not be loaded",
      imageAlt: "Project preview",
      githubLink: "GitHub Link",
      visibility: "Visibility",
      visibleOnPortfolio: "Visible on portfolio",
      hiddenOnPortfolio: "Hidden on portfolio",
      save: "Save Changes",
      saving: "Saving...",
    },
  },
  login: {
    title: "Admin login",
    email: "Email",
    password: "Password",
    invalidCredentials: "Invalid email or password.",
    submitting: "Logging in...",
    submit: "Login",
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly Widen<Item>[]
    : { readonly [Key in keyof T]: Widen<T[Key]> };

/** Shape every language file must satisfy (same keys, any string values). */
export type Messages = Widen<typeof messages>;
