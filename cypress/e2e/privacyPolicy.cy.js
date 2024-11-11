it('Testando a página de política de privacidade de forma independente(NOME DA ABA)', () => {
    cy.visit('./src/privacy.html')

    cy.contains('h1', 'TAT CSC - Privacy Policy').should('be.visible')
    cy.contains('Talking About Testing').should('be.visible')
});