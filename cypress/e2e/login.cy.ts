describe("login", () => {
  it("Should log in to olaNordmann and then log out", () => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("olaNordmann");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });
});
