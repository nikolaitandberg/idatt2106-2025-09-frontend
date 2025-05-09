describe("register", () => {
  it("Should create user when registered", () => {
    cy.intercept("POST", "/api/auth/register").as("register");

    cy.visit("/register");
    cy.contains("h1", "Registrer deg").should("be.visible");

    cy.get("#username").should("be.visible").clear().type("martinHansen");
    cy.get("#username").should("have.value", "martinHansen");
    cy.get("#email").should("be.visible").type("test@gmail.com");
    cy.get("#password").should("be.visible").type("SterktPassord123");
    cy.get("#repeatPassword").should("be.visible").type("SterktPassord123");
    cy.get("#privacyPolicy").should("be.visible").check();
    cy.contains("button", "Registrer deg").should("be.visible").click();
    cy.wait("@register").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="page-title"]').should("be.visible").and("contain.text", "Krisefikser");
  });
});
