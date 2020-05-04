given('I am on the {string} page', () => {
  cy.visit('/')
})

then('I see the logo', () => {
  cy.get('.logo')
})
