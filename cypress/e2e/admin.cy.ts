describe("admin", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("adminAdminsen");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.get('[data-testid="page-title"]', { timeout: 10000 }).should("be.visible").and("contain.text", "Krisefikser");
  });

  it("Should display admin profile", () => {
    cy.visit("/profile");
    cy.url().should("eq", "http://localhost:3000/profile");
    cy.get('[data-testid="profile-username"]', { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", "@adminAdminsen");
  });

  it("Should be able to log out", () => {
    cy.visit("/profile");
    cy.url().should("eq", "http://localhost:3000/profile");
    cy.contains("button", "Logg ut").should("be.visible").click();
    cy.url().should("include", "/login");
  });
});
