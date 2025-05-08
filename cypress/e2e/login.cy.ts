describe("login", () => {
  it("Should log in to olaNordmann and then log out", () => {

    cy.visit("/login");
    cy.get("#username").should("be.visible").clear().type("olaNordmann");
    cy.get("#username").should("have.value","olaNordmann");

    cy.get("#password").should("be.visible").clear().type("Password12345");

    cy.contains('button', "Logg inn").should("be.visible").click();
    cy.get('h1.text-4xl.font-bold', { timeout: 5000 })
    .should('contain.text', 'Krisefikser');
    cy.visit("/profile");
    cy.get('p.text-gray-500.mt-1')
    .should('contain.text', 'olaNordmann');
    
  });
});
