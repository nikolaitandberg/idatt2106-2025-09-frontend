describe("register", () =>{
  it("Should create user when registered", () => {
    cy.intercept('POST', '/api/auth/register').as('register');
    
    cy.visit("/login");
    cy.get('a[href="/register"]')
    .should('have.class', 'text-blue-500') 
    .click()
    cy.contains('h1', 'Registrer deg').should('be.visible');
    
    cy.get("#username")
    .should("be.visible")
    .clear()
    .type("martinHansen")
    cy.get('#username').should('have.value', 'martinHansen')
    cy.get("#email").should("be.visible").type("test@gmail.com")
    cy.get("#password").should("be.visible").type("SterktPassord123")
    cy.get("#repeatPassword").should("be.visible").type("SterktPassord123")
    cy.contains('button', 'Registrer deg').should('be.visible').click()

    cy.get('h1.text-4xl.font-bold', { timeout: 5000 })
    .should('contain.text', 'Krisefikser');
    cy.visit("/profile");
    cy.get('p.text-gray-500.mt-1')
    .should('contain.text', 'martinHansen');
  })

})
