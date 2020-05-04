// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.get('.login-wrapper').find('img').should('have.attr', 'src').should('include', 'logo')
  })
})
