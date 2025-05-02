describe("register", () =>{
  it("Should create user when registered", () => {
    cy.visit("/login");
    cy.get('a[href="/register"]')
    .should('have.class', 'text-blue-500') 
    .click()

    cy.wait(4000);

    cy.get("#username")
    .should("be.visible")
    .clear()
    .type("testUser")

    cy.get('#username').should('have.value', 'testUser')

    cy.get("#email").should("be.visible").type("test@gmail.com")
    cy.get("#password").should("be.visible").type("SterktPassord123")
    cy.get("#repeatPassword").should("be.visible").type("SterktPassord123")
    cy.contains('button', 'Registrer deg').should('be.visible').click()


  })

})