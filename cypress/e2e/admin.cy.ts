describe("admin", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/auth/callback/credentials*").as("loginRequest");
    cy.visit("/login");

    cy.get("#username").should("be.visible").type("adminAdminsen");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();

    cy.wait("@loginRequest", { timeout: 10000 }).its("response.statusCode").should("eq", 200);
  });

  it("Should display admin profile", () => {
    cy.visit("/profile");
    cy.get('[data-testid="profile-username"]').should("contain.text", "@adminAdminsen");
  });

  it("Should be able to log out", () => {
    cy.visit("/profile");
    cy.contains("button", "Logg ut").should("be.visible").click();
    cy.url().should("include", "/login");
  });
});
