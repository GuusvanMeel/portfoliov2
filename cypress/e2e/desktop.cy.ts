import { logFlowMetric } from "../support/logflowmetric";

// Desktop behaviour as visitors experience it. These tests never write data.
const themes = ["Win98", "WinXP", "classicMac", "debug"] as const;

const windowOfType = (type: string) => cy.get(`[data-cy="window"][data-window-type="${type}"]`);

const taskbarEntryFor = (windowId: string) =>
  cy.get(`[data-cy="taskbar-entry"][data-window-id="${windowId}"]`);

/** The z-index lives on the drag wrapper around the window frame. */
const zIndexOf = ($window: JQuery<HTMLElement>) =>
  Number($window.closest('[style*="z-index"]').css("z-index"));

const openApp = (iconId: string) =>
  cy.get(`[data-cy="desktop-icon"][data-icon-id="${iconId}"]`).dblclick();

describe("Desktop", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.clearLocalStorage();
    cy.visit("/");
    cy.get('[data-cy="desktop"]').should("exist");
  });

  it("opens with the contact window active in the taskbar", () => {
    const start = performance.now();
    windowOfType("contact").should("be.visible");
    taskbarEntryFor("Contact-startup").should("have.attr", "data-active", "true");
    logFlowMetric("Desktop: startup", start);
  });

  it("opens a window from a desktop icon in front and makes it active", () => {
    const start = performance.now();
    openApp("about");

    windowOfType("about")
      .should("be.visible")
      .invoke("attr", "data-window-id")
      .then((aboutId) => {
        taskbarEntryFor(String(aboutId)).should("have.attr", "data-active", "true");
        taskbarEntryFor("Contact-startup").should("have.attr", "data-active", "false");
      });

    windowOfType("about").then(($about) => {
      windowOfType("contact").then(($contact) => {
        expect(zIndexOf($about)).to.be.greaterThan(zIndexOf($contact));
      });
    });
    logFlowMetric("Desktop: open window", start);
  });

  it("brings a window behind to the front when it is clicked", () => {
    const start = performance.now();
    openApp("about");
    windowOfType("about").should("be.visible");

    windowOfType("contact").find(".window-title-bar").click();

    windowOfType("contact").then(($contact) => {
      windowOfType("about").then(($about) => {
        expect(zIndexOf($contact)).to.be.greaterThan(zIndexOf($about));
      });
    });
    taskbarEntryFor("Contact-startup").should("have.attr", "data-active", "true");
    logFlowMetric("Desktop: bring to front", start);
  });

  it("minimizes a window and restores it from the taskbar in front", () => {
    const start = performance.now();
    openApp("about");
    windowOfType("about").should("be.visible");

    windowOfType("contact").find('[data-cy="window-minimize"]').click();
    windowOfType("contact").should("not.exist");
    taskbarEntryFor("Contact-startup").should("have.attr", "data-active", "false");

    taskbarEntryFor("Contact-startup").find("button").first().click();
    windowOfType("contact").should("be.visible");
    taskbarEntryFor("Contact-startup").should("have.attr", "data-active", "true");
    windowOfType("contact").then(($contact) => {
      windowOfType("about").then(($about) => {
        expect(zIndexOf($contact)).to.be.greaterThan(zIndexOf($about));
      });
    });
    logFlowMetric("Desktop: minimize and restore", start);
  });

  it("closes a window with its own close button", () => {
    const start = performance.now();
    windowOfType("contact").find('[data-cy="window-close"]').click();
    windowOfType("contact").should("not.exist");
    taskbarEntryFor("Contact-startup").should("not.exist");
    logFlowMetric("Desktop: close via window", start);
  });

  it("closes a window from the taskbar", () => {
    const start = performance.now();
    taskbarEntryFor("Contact-startup").find('[data-cy="taskbar-entry-close"]').click();
    windowOfType("contact").should("not.exist");
    taskbarEntryFor("Contact-startup").should("not.exist");
    logFlowMetric("Desktop: close via taskbar", start);
  });

  it("applies every theme to the desktop and the taskbar", () => {
    const start = performance.now();
    themes.forEach((theme) => {
      cy.get(`[data-cy="theme-option"][data-theme-option="${theme}"]`).first().click();
      cy.get('[data-cy="desktop"]').should("have.attr", "data-theme", theme);
      cy.get('[data-cy="taskbar"]').should("contain.text", theme);
    });
    logFlowMetric("Desktop: switch themes", start);
  });

  it("opens a project window from a visible project .exe icon", () => {
    const start = performance.now();
    cy.get("body").then(($body) => {
      const projectIcons = $body.find('[data-cy="desktop-icon"][data-icon-id^="project-"]');

      if (projectIcons.length === 0) {
        cy.log("No visible projects in the database: skipping the project window check");
        return;
      }

      const label = projectIcons
        .first()
        .text()
        .trim()
        .replace(/\.exe$/, "");
      cy.wrap(projectIcons.first()).dblclick();
      windowOfType("projects").should("be.visible").and("contain.text", label);
    });
    logFlowMetric("Desktop: open project", start);
  });
});
