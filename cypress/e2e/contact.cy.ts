import { logFlowMetric } from "../support/logFlowMetric";

// The contact form posts to Formspree. Every request to that host is intercepted, so no real
// message is ever sent.
const formspree = "https://formspree.io/**";

const contactWindow = () => cy.get('[data-cy="window"][data-window-type="contact"]');

const fillForm = () => {
  contactWindow().within(() => {
    cy.get('[name="name"]').type("Cypress Visitor");
    cy.get('[name="email"]').type("visitor@test.invalid");
    cy.get('[name="message"]').type("Hello from the end-to-end tests.");
  });
};

describe("Contact form", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visit("/");
    contactWindow().should("be.visible");
  });

  it("confirms a sent message and clears the form", () => {
    const start = performance.now();
    cy.intercept("POST", formspree, { statusCode: 200, body: { ok: true } }).as("send");
    fillForm();
    contactWindow().find('button[type="submit"]').click();

    cy.wait("@send").its("request.body").should("include", "Cypress Visitor");
    contactWindow().should("contain.text", "Message sent.");
    contactWindow().find('[name="name"]').should("have.value", "");
    cy.get("@send.all").should("have.length", 1);
    logFlowMetric("Contact: send succeeds", start);
  });

  it("shows an error when sending fails and keeps the message", () => {
    const start = performance.now();
    cy.intercept("POST", formspree, { statusCode: 500, body: {} }).as("send");
    fillForm();
    contactWindow().find('button[type="submit"]').click();

    cy.wait("@send");
    contactWindow().should("contain.text", "Something went wrong. Please try again.");
    contactWindow().should("not.contain.text", "Message sent.");
    contactWindow()
      .find('[name="message"]')
      .should("have.value", "Hello from the end-to-end tests.");
    logFlowMetric("Contact: send fails", start);
  });
});
