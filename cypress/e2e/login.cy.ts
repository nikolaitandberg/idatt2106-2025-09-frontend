describe("login", () => {
  it("Should log in to olaNordmann", () => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.intercept("GET", "/api/auth/session").as("sessionRequest");
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("olaNordmann");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@sessionRequest").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="page-title"]', { timeout: 10000 }).should("be.visible").and("contain.text", "Krisefikser");
  });
});
