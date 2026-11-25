import { logFlowMetric } from "../support/logFlowMetric";
import { editedTestProject, testProject } from "../support/testData";

const logIn = () => {
  cy.visit("http://localhost:3000/admin");
  cy.env(["TEST_EMAIL", "TEST_PASSWORD"]).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
    cy.get('[name="email"]').type(TEST_EMAIL);
    cy.get('[name="password"]').type(TEST_PASSWORD, { log: false });
  });
  cy.get('button[type="submit"]').click();
  // The create button is always present on the admin page, even with zero projects.
  cy.get('[data-cy="create-project"]', { timeout: 15000 }).should("exist");
};

describe("Admin project management", () => {
  // Remove leftover test projects before the run (covers aborted runs) and after it
  // (the after hook also runs when a test fails).
  before(() => {
    cy.task("cleanupTestProjects");
  });

  after(() => {
    cy.task("cleanupTestProjects");
  });

  it("Create project", function () {
    const start = performance.now();
    logIn();

    // open create form
    cy.get('[data-cy="create-project"]').click();

    cy.get('[data-cy="edit-project-form"]').within(() => {
      cy.get('[name="title"]').type(testProject.title);
      cy.get("#project-description").type(testProject.description);
      cy.get('[name="tags"]').type(testProject.tags);
      cy.get('[name="duration"]').type(testProject.duration);

      cy.get('[name="image"]').clear().invoke("val", testProject.imageUrl).trigger("input");

      cy.get('[name="git"]').type(testProject.githubUrl);

      // New projects are visible by default; the after hook removes the project again.
      cy.get('[data-cy="form-visibility-checkbox"]').should("be.checked");
      cy.get('[data-cy="form-visibility-status"]').should("contain.text", "Visible on portfolio");

      cy.get('[data-cy="save-project"]').click();
    });

    // Check that the project was really created
    cy.contains('[data-cy="admin-project"]', testProject.title).within(() => {
      cy.contains(testProject.title).should("be.visible");
      cy.contains(testProject.description).should("be.visible");
      cy.contains("tag1").should("be.visible");
      cy.contains("tag2").should("be.visible");
      cy.contains("tag 3").should("be.visible");
      cy.get('[data-cy="visibility-pill"]').should("contain.text", "Visible");
      logFlowMetric("Create project flow", start);
    });
  });

  it("Edit existing project", function () {
    const start = performance.now();
    logIn();

    const project = () => cy.contains('[data-cy="admin-project"]', testProject.title);

    project().within(() => {
      cy.get('[data-cy="visibility-toggle"]').click();
      cy.get('[data-cy="visibility-pill"]').should("contain.text", "Hidden");
    });

    project().within(() => {
      cy.get('[data-cy="visibility-toggle"]').click();
      cy.get('[data-cy="visibility-pill"]').should("contain.text", "Visible");
    });

    project().within(() => {
      cy.get('[data-cy="edit-project"]').click();
    });

    cy.get('[name="title"]').clear().type(editedTestProject.title);
    cy.get("#project-description").clear().type(editedTestProject.description);
    cy.get('[name="tags"]').clear().type(editedTestProject.tags);
    cy.get('[name="duration"]').clear().type(editedTestProject.duration);

    cy.get('[data-cy="form-visibility-toggle"]').click();
    cy.get('[data-cy="form-visibility-checkbox"]').should("not.be.checked");
    cy.get('[data-cy="form-visibility-status"]').should("contain.text", "Hidden on portfolio");
    cy.get('[data-cy="form-visibility-toggle"]').click();
    cy.get('[data-cy="form-visibility-checkbox"]').should("be.checked");
    cy.get('[data-cy="form-visibility-status"]').should("contain.text", "Visible on portfolio");

    cy.get('[data-cy="save-project"]').click();

    cy.contains('[data-cy="admin-project"]', editedTestProject.title).within(() => {
      cy.contains(editedTestProject.title).should("be.visible");
      cy.contains(editedTestProject.description).should("be.visible");
      cy.contains("edited-tag").should("be.visible");
      cy.contains("tag2").should("be.visible");
      cy.contains("tag 3").should("be.visible");
      cy.get('[data-cy="visibility-pill"]').should("contain.text", "Visible");
    });
    logFlowMetric("Edit project flow", start);
  });

  it("Delete project", function () {
    const start = performance.now();
    logIn();

    cy.contains('[data-cy="admin-project"]', editedTestProject.title).as("editedProject");

    cy.get("@editedProject").within(() => {
      cy.contains(editedTestProject.title).should("be.visible");
    });

    // accept the confirm popup
    cy.on("window:confirm", () => true);

    cy.get("@editedProject").within(() => {
      cy.get('[data-cy="delete-project"]').click();
    });

    cy.contains('[data-cy="admin-project"]', editedTestProject.title).should("not.exist");
    logFlowMetric("delete project", start);
  });
});
