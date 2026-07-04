import { logFlowMetric } from "../support/logflowmetric"

describe('Authorization', () => {
  
  it('Gets redirected to login', () => {
    const start = performance.now()
    cy.visit('http://localhost:3000/admin')
    cy.url().should('include', '/login')
    logFlowMetric('Authorization', start)
  })

  it('logs in', () => {
    const start = performance.now()
    cy.visit('http://localhost:3000/admin')
   cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
  cy.get('[name="email"]').type(TEST_EMAIL)
  cy.get('[name="password"]').type(TEST_PASSWORD, { log: false })
})
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/admin')
  logFlowMetric('Logs in', start)
})
it('fails to log in', () => {
  const start = performance.now() 
  cy.visit('http://localhost:3000/admin')
    cy.get("#email").type("vanmeelguu@gmail.com")
    cy.get("#password").type("blablabla")
    cy.get('button[type="submit"]').click()
    cy.contains("Invalid email or password.")
    logFlowMetric('fails to Logs in', start)
})
})

