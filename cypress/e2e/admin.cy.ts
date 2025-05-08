describe("admin", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#username").should("be.visible").clear().type("adminAdminsen");
    cy.get("#username").should("have.value", "adminAdminsen");

    cy.get("#password").should("be.visible").clear().type("Password12345");

    cy.contains('button', "Logg inn").should("be.visible").click();
    cy.get('h1.text-4xl.font-bold', { timeout: 5000 })
    .should('contain.text', 'Krisefikser');
  });

  it("Should display admin profile", () => {
    cy.visit("/profile");
    cy.get('p.text-gray-500.mt-1')
      .should('contain.text', 'adminAdminsen');
  });

  it("Should be able to log out", () => {
    cy.visit("/profile");
    cy.contains('button', "Logg ut").should("be.visible").click();
    cy.url().should("include", "/login");
  });

  it("Should be able to open admin panel", () =>{
    cy.get('span.transition-all.duration-200').should('have.text', 'Admin').should("exist");
  })
});
