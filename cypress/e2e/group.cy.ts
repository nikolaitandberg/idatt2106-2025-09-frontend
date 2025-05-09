describe("Group", () => {
  beforeEach(() => {
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
  it("Should be able to visit group page with both link in main page and top bar", () => {
    cy.get('a[href="/group"] > button').should("be.visible").click();
    cy.get("h1.text-xl.font-semibold", { timeout: 5000 }).should("be.visible").and("contain.text", "Beredskapsgruppe");
    cy.visit("/");
    cy.get('a[href="/group"]', { timeout: 2000 }).click();
    cy.get("h1.text-xl.font-semibold", { timeout: 5000 }).should("be.visible").and("contain.text", "Beredskapsgruppe");
  });
  it("Should be able to create group and invite", () => {
    cy.intercept("POST", "/api/emergency-groups").as("createGroup");
    cy.intercept("GET", "/group*").as("loadGroupPage");

    cy.visit("/group");
    cy.get("#name", { timeout: 3000 }).should("be.visible").clear().type("nordmanns gruppe");
    cy.get("#description").should("be.visible").clear().type("Dette er en gruppe for alle i nordmann utvidet familie");

    cy.contains("button", "Lag gruppe").should("be.enabled").click();

    cy.wait("@createGroup").its("response.statusCode").should("eq", 201);
    cy.wait("@loadGroupPage").its("response.statusCode").should("eq", 200);

    cy.contains("h3", "nordmanns gruppe").should("be.visible");

    cy.get('a[href="/group/1"] > div.rounded-lg').should("be.visible").click();

    cy.contains("h1", "nordmanns gruppe", { timeout: 3000 }).should("be.visible");

    cy.contains("button", "Inviter en husholdning").should("be.visible").click();

    cy.get("#householdId").should("be.visible").clear().type("2");
    cy.contains("button", "Send invitasjon").should("be.visible").click();
    cy.contains("p", "Husholdning 2 ble invitert til gruppen.").should("be.visible");
  });
});
