describe("profile login", () => {
  before(() => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.intercept("GET", "/api/auth/session").as("sessionRequest");
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("nordmannJunior");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@sessionRequest").its("response.statusCode").should("eq", 200);
  });

  it("Should be able create household", () => {
    cy.intercept("POST", "/api/households/register").as("createHouseholdRequest");

    cy.visit("/household/join");
    cy.url().should("eq", "http://localhost:3000/household/join");
    cy.get('[data-testid="household-create"]').should("be.visible").click();
    cy.get("#name", { timeout: 5000 }).should("be.visible").type("Huset");
    cy.get("#address").should("be.visible").type("Eirik jarls gate 2");
    cy.get('button[type="submit"]').click();

    cy.wait("@createHouseholdRequest").its("response.statusCode").should("eq", 200);
    cy.visit("/household");
    cy.url().should("eq", "http://localhost:3000/household");
    cy.contains("button", "Legg til eller inviter medlem").should("be.visible").click();
    cy.get("#username").should("be.visible").clear().type("ensomNordmann");
    cy.contains("button", "Legg til bruker").should("be.visible").click();
    cy.contains("p.text-sm", "ensomNordmann er nå invitert til husholdningen").should("be.visible");
    cy.visit("/profile");
    cy.get('[data-testid="profile-username"]').should("be.visible").should("contain.text", "nordmannJunior");
    cy.contains("button", "Logg ut").should("be.visible").click();
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.intercept("GET", "/api/auth/session").as("sessionRequest");
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("ensomNordmann");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@sessionRequest").its("response.statusCode").should("eq", 200);
    cy.visit("/household");
    cy.contains("button, a, div", "Forlat husholdning").should("be.visible").click();
    cy.get('[data-testid="confirmation-confirm"]').should("be.visible").click();

    cy.contains("p.text-sm", "Du har forlatt husholdningen").should("be.visible");
    cy.contains("p.text-sm.text-gray-500", "Eirik jarls gate 2").should("be.visible");
    cy.contains("button", "Aksepter").should("be.visible").click({ timeout: 10000 });

    cy.contains("span.text-sm.text-muted-foreground", "2 medlemmer", { timeout: 3000 }).should("be.visible");
    cy.contains("h1", "Huset").should("be.visible");
    cy.contains("p", "Du har blitt med i husholdningen").should("be.visible");
  });
});
