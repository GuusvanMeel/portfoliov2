// Loaded before every spec file.
import "./commands";
import "@cypress/code-coverage/support";

// Every spec file starts from the committed seed in the test database.
before(() => {
  cy.task("resetTestDatabase");
});
