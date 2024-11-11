describe('TAT - Customer Service Center', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('check the application title', () => {
    cy.title().should('be.equal', 'TAT Customer Service Center')
  })

  it('fills in the required fields and submits ther form', () => {
    const longText = 'Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando'

    cy.get('#firstName').type('Claudenor')
    cy.get('[name=lastName]').type('Dantas')
    cy.get('.field [name=email]').type('cd@outlook.com')
    cy.get('#phone').type('1198761234')
    cy.get('.field #open-text-area').type(longText, { delay: 0 }) // seta o delay igual a 0, para melhorar a performance do teste, nn perde tempo digitando
    cy.get('button[type="submit"]').click() // 'button[type-submit]'

    cy.get('.success')
      .should('be.visible')
      .and('contain', 'Message successfully sent.')
  })

  it('displays an error message when submitting the form with an email with invalid formatting', () => {
    cy.get('#firstName').type('Claudenor')
    cy.get('[name=lastName]').type('Dantas')
    cy.get('.field [name=email]').type('cdoutlook.com')
    cy.get('#phone').type('1198761234')
    cy.get('.field #open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

    cy.get('.error')
      .should('be.visible')
      .and('contain', 'Validate the required fields!')
  });

  it('validates that the phone input field only accepts numbers', () => {
    cy.get('#phone')
      .type('abcdef')
      .should('have.value', '')
  });

  it('displays an error message when the phone becomes required but is not filled in before the form submission', () => {
    cy.get('#firstName').type('Claudenor')
    cy.get('[name=lastName]').type('Dantas')
    cy.get('.field [name=email]').type('cd@outlook.com')
    cy.get('#phone-checkbox').check()
    cy.get('.field #open-text-area').type('Teste')
    cy.contains('button', 'Send').click()

    cy.get('.error')
      .should('be.visible')
      .and('contain', 'Validate the required fields!')
  });

  it('fills and clears the first name, last name, email, and phone fields', () => {
    cy.get('#firstName')
      .type('Claudenor')
      .should('have.value', 'Claudenor')
      .clear()
      .should('have.value', '')

    cy.get('[name=lastName]')
      .type('Dantas')
      .should('have.value', 'Dantas')
      .clear()
      .should('have.value', '')
    cy.get('.field [name=email]')
      .type('cd@outlook,com')
      .should('have.value', 'cd@outlook,com')
      .clear()
      .should('have.value', '')

    cy.get('#phone')
      .type('1198761234')
      .should('have.value', '1198761234')
      .clear()
      .should('have.value', '')
  });

  it('displays an error message when submitting the form without filling the required fields', () => {
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  });

  it('successfully submits the form using a custom command', () => {
    cy.fillMandatoryFieldsAndSubmit() // Comando customizado, configurado no arquivo commands, e importado no arquivo index.js
    cy.get('.success').should('be.visible')
  });


  it('selects a product(youtube) by its contente', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube') // validando o valor , por isso em letra minúscula
  });

  it('selects a product(Mentorship) by its value', () => {
    cy.get('#product')
      .select('mentorship')
      .should('have.value', 'mentorship') // validando o valor , por isso em letra minúscula
  });
  it('selects a product(blog) by its index', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  });
  it('checks the type of service "Feedback" (input radio button)', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')
  });
  it('checks each type of service', () => {
    cy.get('input[type=radio]')
      .should('have.length', 3)
      .each(typeOfService => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
  });
  it('check both checkboxes, then unchecks the last one', () => {
    cy.get('input[type=checkbox]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  });

  it('selects a file from the fixture folder and validates the name of the file', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });
  
  it('selects a file simulating a drag-and-drop', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  it('selects a file using a fixture to which an alias was given', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
      .selectFile('@sampleFile')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  //cypress não trabalha com multi abas
  it('Verificar que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  });
  it('Acessar a página de política de privacidade removendo o target e clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'TAT CSC - Privacy Policy').should('be.visible')
    cy.contains('Talking About Testing').should('be.visible')
  });

})