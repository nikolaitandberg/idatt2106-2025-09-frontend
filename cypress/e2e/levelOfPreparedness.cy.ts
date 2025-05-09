describe("View level of preparedness", () => {
  it("should login and view storage and then add food to see change in level of preparedness", () => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.intercept("GET", "/api/auth/session").as("sessionRequest");
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("olaNordmann");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@sessionRequest").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="page-title"]', { timeout: 50000 }).should("be.visible").and("contain.text", "Krisefikser");
    cy.get('a[href="/household"] > button').should("be.visible").click();
    cy.contains("span", "25%").should("be.visible");
    cy.contains("button", "Legg til ny matvare").should("be.visible").click();
    cy.contains("button", "Velg").should("be.visible").click();
    cy.get("button > div.text-start").first().should("be.visible").and("contain.text", "Hermetiske tomater").click();
    cy.get("#amount").should("be.visible").clear().type("500").should("have.value", "5000");
    cy.get("#add-food-btn").click();
    cy.contains("p", "Den nye matvaren ble lagt til i husholdningen.").should("be.visible");
    cy.get("span.text-sm.text-muted-foreground").should("be.visible").and("contain.text", "5000 g");
    cy.contains("span", "26%").should("be.visible");
  });
});
