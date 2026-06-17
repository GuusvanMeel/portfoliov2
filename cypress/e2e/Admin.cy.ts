describe('template spec', () => {


  it('Create project', function () {
    const start = performance.now()
  const title = 'CYPRESS TEST PROJECT'
  const description = 'DIT IS EEN CYPRESS TEST PROJECT ALS JE DIT ZIET MOET JE HEEL ERG BANG ZIJN'
  const tags = 'tag1, tag2, tag 3'
  const duration = '2 weken'
  const imageUrl = 'https://res.cloudinary.com/dnfdgzek3/image/upload/v1776412550/Screenshot_2026-04-17_095441_nalrgu.png'
  const githubUrl = 'https://github.com/GuusvanMeel/Next-Episode-WPF'

  cy.visit('http://localhost:3000/admin')

    cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
  cy.get('[name="email"]').type(TEST_EMAIL)
  cy.get('[name="password"]').type(TEST_PASSWORD, { log: false })
})
  cy.get('button[type="submit"]').click()

  cy.get('[data-cy="admin-project"]', { timeout: 15000 }).should('exist')

  // open create form
  cy.get('[data-cy="create-project"]').click()

  cy.get('[data-cy="edit-project-form"]').within(() => {
    cy.get('[name="title"]').type(title)
    cy.get('#project-description').type(description)
    cy.get('[name="tags"]').type(tags)
    cy.get('[name="duration"]').type(duration)

    cy.get('[name="image"]')
      .clear()
      .invoke('val', imageUrl)
      .trigger('input')

    cy.get('[name="git"]').type(githubUrl)

    // Zorg dat hij verborgen is/blijft, zodat hij niet publiek op je portfolio staat
    cy.get('[data-cy="form-visibility-checkbox"]').should('be.checked')
    cy.get('[data-cy="form-visibility-status"]').should('contain.text', 'Visible on portfolio')

    cy.get('[data-cy="save-project"]').click()
  })

  // Check of het project echt aangemaakt is
  cy.contains('[data-cy="admin-project"]', title).within(() => {
    cy.contains(title).should('be.visible')
    cy.contains(description).should('be.visible')
    cy.contains('tag1').should('be.visible')
    cy.contains('tag2').should('be.visible')
    cy.contains('tag 3').should('be.visible')
    cy.get('[data-cy="visibility-pill"]').should('contain.text', 'Visible')
     cy.then(() => {
        const duration = Math.round(performance.now() - start)
        cy.task('logMetric', {
          name: 'Create project flow',
          ms: duration,
        })
      })
    })
  })

it('Edit existing project', function () {
  const originalTitle = 'CYPRESS TEST PROJECT'
  const editedTitle = 'CYPRESS TEST PROJECT - titel-aanpassing'
  const editedDescription = 'description-aanpassing DIT IS EEN CYPRESS TEST PROJECT'
  const editedTags = 'tag-aanpassing, tag2, tag 3'
  const editedDuration = 'duration-aanpassing'

  cy.visit('http://localhost:3000/admin')

  cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
  cy.get('[name="email"]').type(TEST_EMAIL)
  cy.get('[name="password"]').type(TEST_PASSWORD, { log: false })
})
  cy.get('button[type="submit"]').click()

  cy.get('[data-cy="admin-project"]', { timeout: 15000 }).should('exist')

  const project = () => cy.contains('[data-cy="admin-project"]', originalTitle)

  project().within(() => {
    cy.get('[data-cy="visibility-toggle"]').click()
    cy.get('[data-cy="visibility-pill"]').should('contain.text', 'Hidden')
  })

  project().within(() => {
    cy.get('[data-cy="visibility-toggle"]').click()
    cy.get('[data-cy="visibility-pill"]').should('contain.text', 'Visible')
  })

  project().within(() => {
    cy.get('[data-cy="edit-project"]').click()
  })

  cy.get('[name="title"]').clear().type(editedTitle)
  cy.get('#project-description').clear().type(editedDescription)
  cy.get('[name="tags"]').clear().type(editedTags)
  cy.get('[name="duration"]').clear().type(editedDuration)

  cy.get('[data-cy="form-visibility-toggle"]').click()
  cy.get('[data-cy="form-visibility-checkbox"]').should('not.be.checked')
  cy.get('[data-cy="form-visibility-status"]').should('contain.text', 'Hidden on portfolio')
  cy.get('[data-cy="form-visibility-toggle"]').click()
  cy.get('[data-cy="form-visibility-checkbox"]').should('be.checked')
  cy.get('[data-cy="form-visibility-status"]').should('contain.text', 'Visible on portfolio')
  

  cy.get('button.bg-blue-600').click()

  cy.contains('[data-cy="admin-project"]', editedTitle).within(() => {
    cy.contains(editedTitle).should('be.visible')
    cy.contains(editedDescription).should('be.visible')
    cy.contains('tag-aanpassing').should('be.visible')
    cy.contains('tag2').should('be.visible')
    cy.contains('tag 3').should('be.visible')
    cy.get('[data-cy="visibility-pill"]').should('contain.text', 'Visible')
  })
})

it('Delete project', function() {
  
  const editedTitle = 'CYPRESS TEST PROJECT - titel-aanpassing'
  

  cy.visit('http://localhost:3000/admin')

  cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
  cy.get('[name="email"]').type(TEST_EMAIL)
  cy.get('[name="password"]').type(TEST_PASSWORD, { log: false })
})
  cy.get('button[type="submit"]').click()
  
  cy.get('[data-cy="admin-project"]', { timeout: 15000 }).should('exist')
  
  cy.contains('[data-cy="admin-project"]', editedTitle).as('editedProject')

cy.get('@editedProject').within(() => {
  cy.contains(editedTitle).should('be.visible')
})

// confirm-popup accepteren
cy.on('window:confirm', () => true)

cy.get('@editedProject').within(() => {
  cy.get('[data-cy="delete-project"]').click()
})

cy.contains('[data-cy="admin-project"]', editedTitle).should('not.exist')
});

  })

