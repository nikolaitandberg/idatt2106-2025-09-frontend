describe("profile", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.intercept("GET", "/api/auth/session").as("sessionRequest");
    cy.intercept("GET", "/api/user/**").as("userRequest");

    cy.visit("/login");
    cy.get("#username").should("be.visible").type("nordmannJunior");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@sessionRequest").its("response.statusCode").should("eq", 200);
  });

  it("Should be able to visit the profile page", () => {
    cy.visit("/profile");
    cy.wait("@sessionRequest");
    cy.wait("@userRequest");
    cy.url().should("eq", "http://localhost:3000/profile");
  });

  it("should be able to view and edit profile information", () => {
    cy.intercept("PUT", "/api/user/**").as("updateUserRequest");

    cy.visit("/profile");
    cy.wait("@sessionRequest");
    cy.wait("@userRequest");

    cy.get('[data-testid="profile-username"]').should("be.visible").should("contain.text", "nordmannJunior");
    cy.get('[data-testid="profile-email"]').should("be.visible").should("contain.text", "junior@gmail.com");

    cy.get('[data-testid="profile-edit-button"]').should("be.visible").click();
    cy.get('[data-testid="profile-edit-form"]').should("be.visible");

    cy.get("#firstName").should("be.visible").clear().type("nordmann");
    cy.get("#lastName").should("be.visible").clear().type("Junior");
    cy.get("button[type=submit]").should("be.visible").click();

    cy.wait("@updateUserRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@userRequest");
    cy.get('[data-testid="profile-name"]').should("be.visible").should("contain.text", "nordmann Junior");
    cy.get('[data-testid="profile-username"]').should("be.visible").should("contain.text", "nordmannJunior");
  });
});
