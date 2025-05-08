describe("login", () => {
  it("Should log in to olaNordmann and then log out", () => {
    cy.visit("/login");
    cy.get('[data-testid="input-username"]').type("nordmannJunior");
    cy.get('[data-testid="input-password"]').type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.get('[data-testid="page-title"]', { timeout: 5000 }).should("contain.text", "Krisefikser");
    cy.visit("/profile");
    cy.get('[data-testid="profile-username"]').should("contain.text", "olaNordmann");
  });
});
