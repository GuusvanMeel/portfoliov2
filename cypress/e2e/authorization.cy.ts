import { logFlowMetric } from "../support/logFlowMetric";

const signIn = (emailKey: string, passwordKey: string) => {
  cy.env([emailKey, passwordKey]).then((env) => {
    cy.get('[name="email"]').type(env[emailKey]);
    cy.get('[name="password"]').type(env[passwordKey], { log: false });
  });
  cy.get('button[type="submit"]').click();
};

describe("Authorization", () => {
  it("sends a signed-out visitor from /admin to the login page", () => {
    const start = performance.now();
    cy.visit("/admin");
    cy.location("pathname").should("eq", "/login");
    logFlowMetric("Authorization: redirect to login", start);
  });

  it("lets the admin sign in and see the admin panel", () => {
    const start = performance.now();
    cy.visit("/admin");
    signIn("TEST_ADMIN_EMAIL", "TEST_ADMIN_PASSWORD");
    cy.location("pathname").should("eq", "/admin");
    cy.get('[data-cy="create-project"]').should("be.visible");
    logFlowMetric("Authorization: admin signs in", start);
  });

  it("logs out and protects /admin again", () => {
    const start = performance.now();
    cy.visit("/admin");
    signIn("TEST_ADMIN_EMAIL", "TEST_ADMIN_PASSWORD");
    cy.get('[data-cy="create-project"]').should("be.visible");

    cy.contains("button", "Logout").click();
    cy.location("pathname").should("eq", "/");

    cy.visit("/admin");
    cy.location("pathname").should("eq", "/login");
    logFlowMetric("Authorization: log out", start);
  });

  it("shows an error for a wrong password", () => {
    const start = performance.now();
    cy.visit("/admin");
    cy.get("#email").type("nobody@test.invalid");
    cy.get("#password").type("wrong-password", { log: false });
    cy.get('button[type="submit"]').click();
    cy.contains("Invalid email or password.").should("be.visible");
    cy.location("pathname").should("eq", "/login");
    logFlowMetric("Authorization: failed sign-in", start);
  });

  it("sends a signed-in user who is not an admin from /admin to the desktop", () => {
    const start = performance.now();
    cy.visit("/admin");
    signIn("TEST_USER_EMAIL", "TEST_USER_PASSWORD");

    cy.location("pathname").should("eq", "/");
    cy.get('[data-cy="desktop"]').should("be.visible");
    cy.get('[data-cy="create-project"]').should("not.exist");

    cy.visit("/admin");
    cy.location("pathname").should("eq", "/");
    logFlowMetric("Authorization: non-admin refused", start);
  });
});
