import { logFlowMetric } from "../support/logFlowMetric";
import { editedProject, seedProjects, testProject } from "../support/testData";

// Admin flows against the TEST database, reset to the seed before every test.

const logIn = () => {
  cy.visit("/admin");
  cy.env(["TEST_ADMIN_EMAIL", "TEST_ADMIN_PASSWORD"]).then(
    ({ TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD }) => {
      cy.get('[name="email"]').type(TEST_ADMIN_EMAIL);
      cy.get('[name="password"]').type(TEST_ADMIN_PASSWORD, { log: false });
    },
  );
  cy.get('button[type="submit"]').click();
  cy.location("pathname").should("eq", "/admin");
  cy.get('[data-cy="create-project"]').should("be.visible");
};

const adminProject = (title: string) => cy.contains('[data-cy="admin-project"]', title);

/** Makes the next server action on /admin fail, as if the database refused it. */
const failNextServerAction = () => {
  cy.intercept(
    { method: "POST", pathname: "/admin", headers: { "next-action": /.+/ }, times: 1 },
    { statusCode: 500, body: "forced failure" },
  ).as("failedAction");
};

const desktopIcon = (title: string) =>
  cy.contains('[data-cy="desktop-icon"][data-icon-id^="project-"]', title);

describe("Admin project management", () => {
  beforeEach(() => {
    // Every admin test starts from the seed, so a failing test never affects the next one.
    cy.task("resetTestDatabase");
    logIn();
  });

  it("creates a project that is listed, kept after reload and shown on the desktop", () => {
    const start = performance.now();
    cy.get('[data-cy="create-project"]').click();

    cy.get('[data-cy="edit-project-form"]').within(() => {
      cy.get('[name="title"]').type(testProject.title);
      cy.get("#project-description").type(testProject.description);
      cy.get('[name="tags"]').type(testProject.tags);
      cy.get('[name="duration"]').type(testProject.duration);
      cy.get('[name="image"]').clear().type(testProject.imageUrl);
      cy.get('[name="git"]').type(testProject.githubUrl);
      // New projects are visible by default.
      cy.get('[data-cy="form-visibility-checkbox"]').should("be.checked");
      cy.get('[data-cy="save-project"]').click();
    });

    cy.get('[data-cy="edit-project-form"]').should("not.exist");
    adminProject(testProject.title).within(() => {
      cy.contains(testProject.description).should("be.visible");
      cy.contains("tag 3").should("be.visible");
      cy.get('[data-cy="visibility-pill"]').should("contain.text", "Visible");
    });

    cy.reload();
    adminProject(testProject.title).should("be.visible");

    cy.visit("/");
    desktopIcon(testProject.title).should("be.visible");
    logFlowMetric("Admin: create project", start);
  });

  it("edits a project and keeps the changes after reload", () => {
    const start = performance.now();
    adminProject(seedProjects.visibleB.title).find('[data-cy="edit-project"]').click();

    cy.get('[data-cy="edit-project-form"]').within(() => {
      cy.get('[name="title"]').clear().type(editedProject.title);
      cy.get("#project-description").clear().type(editedProject.description);
      cy.get('[name="tags"]').clear().type(editedProject.tags);
      cy.get('[name="duration"]').clear().type(editedProject.duration);
      cy.get('[data-cy="save-project"]').click();
    });

    cy.get('[data-cy="edit-project-form"]').should("not.exist");
    adminProject(editedProject.title).within(() => {
      cy.contains(editedProject.description).should("be.visible");
      cy.contains("edited-tag").should("be.visible");
    });

    cy.reload();
    adminProject(editedProject.title).should("be.visible");
    cy.contains('[data-cy="admin-project"]', seedProjects.visibleB.title).should("not.exist");
    logFlowMetric("Admin: edit project", start);
  });

  it("hides a project from the desktop and shows it again", () => {
    const start = performance.now();
    const title = seedProjects.visibleA.title;

    adminProject(title).find('[data-cy="visibility-toggle"]').click();
    adminProject(title).find('[data-cy="visibility-pill"]').should("contain.text", "Hidden");
    cy.visit("/");
    cy.get('[data-cy="desktop"]').should("be.visible");
    desktopIcon(title).should("not.exist");

    cy.visit("/admin");
    adminProject(title).find('[data-cy="visibility-toggle"]').click();
    adminProject(title).find('[data-cy="visibility-pill"]').should("contain.text", "Visible");
    cy.visit("/");
    desktopIcon(title).should("be.visible");
    logFlowMetric("Admin: toggle visibility", start);
  });

  it("deletes a project after confirmation", () => {
    const start = performance.now();
    const title = seedProjects.hidden.title;

    cy.on("window:confirm", () => true);
    adminProject(title).find('[data-cy="delete-project"]').click();
    adminProject(title).should("not.exist");

    cy.reload();
    cy.get('[data-cy="create-project"]').should("be.visible");
    cy.contains('[data-cy="admin-project"]', title).should("not.exist");
    logFlowMetric("Admin: delete project", start);
  });

  describe("when the server refuses a change", () => {
    const title = seedProjects.visibleA.title;

    it("shows an error when saving fails and keeps the project unchanged", () => {
      adminProject(title).find('[data-cy="edit-project"]').click();
      cy.get('[data-cy="edit-project-form"]').within(() => {
        cy.get('[name="title"]').clear().type("Title that must not be saved");
        failNextServerAction();
        cy.get('[data-cy="save-project"]').click();
      });

      cy.wait("@failedAction");
      cy.get('[data-cy="save-error"]').should("contain.text", "Could not save the project");
      cy.get('[data-cy="edit-project-form"]').should("be.visible");

      cy.reload();
      adminProject(title).should("be.visible");
      cy.contains('[data-cy="admin-project"]', "Title that must not be saved").should("not.exist");
    });

    it("shows an error when deleting fails and keeps the project", () => {
      const alert = cy.stub().as("alert");
      cy.on("window:alert", alert);
      cy.on("window:confirm", () => true);

      failNextServerAction();
      adminProject(title).find('[data-cy="delete-project"]').click();

      cy.wait("@failedAction");
      cy.get("@alert").should(
        "have.been.calledWith",
        "Could not delete project. Please try again.",
      );
      adminProject(title).should("be.visible");
      cy.reload();
      adminProject(title).should("be.visible");
    });

    it("shows an error when changing visibility fails and keeps the old state", () => {
      const alert = cy.stub().as("alert");
      cy.on("window:alert", alert);

      failNextServerAction();
      adminProject(title).find('[data-cy="visibility-toggle"]').click();

      cy.wait("@failedAction");
      cy.get("@alert").should("have.been.calledWith", "Could not update project visibility.");
      adminProject(title).find('[data-cy="visibility-pill"]').should("contain.text", "Visible");
      cy.reload();
      adminProject(title).find('[data-cy="visibility-pill"]').should("contain.text", "Visible");
    });
  });
});
