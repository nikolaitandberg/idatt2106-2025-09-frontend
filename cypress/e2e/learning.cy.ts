describe("learning", () => {
  it("Should be able to visit the learning page", () => {
    cy.visit("/learning");
    cy.url().should("eq", "http://localhost:3000/learning");
    cy.get("[data-testid=learning-header]").should("exist").should("have.text", "Scenarioer").should("be.visible");
    cy.get("[data-testid=learning-cards]").children().should("have.length.at.least", 1);
    cy.get("[data-testid=learning-cards]").children().first().should("be.visible");
  });

  it("Should be able to go to a specific scenario page", () => {
    cy.visit("/learning");
    cy.get("[data-testid=learning-cards]").children().first().find("[data-testid=scenario-link]").click();
    cy.url().should("not.eq", "http://localhost:3000/learning");
    cy.url().should("match", /http:\/\/localhost:3000\/learning\/[a-zA-Z0-9-]+/);
    cy.get("[data-testid=learning-page-title]").should("exist").should("be.visible");
    cy.get("[data-testid=scenario-content]").should("exist").should("be.visible");

    cy.get("[data-testid=scenario-back]").should("exist").should("be.visible").click();
    cy.url().should("eq", "http://localhost:3000/learning");
  });

  it("Should see error when trying to access a non-existing scenario", () => {
    cy.visit("/learning/a");
    cy.url().should("eq", "http://localhost:3000/learning/a");
    cy.get("[data-testid=learning-header]").should("not.exist");
    cy.get("[data-testid=learning-cards]").should("not.exist");
    cy.get("[data-testid=learning-page-title]").should("not.exist");
    cy.get("[data-testid=scenario-content]").should("not.exist");
    cy.get("[data-testid=scenario-back]").should("not.exist");
  });
});

describe("learning admin", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
    cy.intercept("GET", "/api/auth/session").as("sessionRequest");
    cy.visit("/login");
    cy.get("#username").should("be.visible").type("adminAdminsen");
    cy.get("#password").type("Password12345");

    cy.get('[data-testid="submit-login"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@sessionRequest").its("response.statusCode").should("eq", 200);
  });

  it("Should be able to visit the learning admin page", () => {
    cy.visit("/admin/scenario");
    cy.url().should("eq", "http://localhost:3000/admin/scenario");
    cy.get("[data-testid=admin-title]").should("exist").should("have.text", "Scenario").should("be.visible");
    cy.get("[data-testid=admin-scenario-list]").children().should("have.length.at.least", 1);
  });

  it("Should be able to create a new scenario, edit it and delete it", () => {
    cy.visit("/admin/scenario");
    cy.url().should("eq", "http://localhost:3000/admin/scenario");

    cy.get("[data-testid=create-scenario]").should("exist").should("be.visible").click();
    cy.get("[data-testid=create-scenario-form]").should("exist").should("be.visible");
    cy.get("#title").type("Test scenario");
    cy.get("[data-testid=create-scenario-form]").get("button[type=submit]").should("be.disabled");
    cy.get("#shortDescription").type("Test description");
    cy.get("[data-testid=create-scenario-form]").get("button[type=submit]").should("be.disabled");
    cy.get("#content").type("Test content");
    cy.get("[data-testid=create-scenario-form]").get("button[type=submit]").should("be.enabled").click();
    cy.url().should("eq", "http://localhost:3000/admin/scenario");

    cy.get("[data-testid=admin-scenario-list]").children().should("have.length.at.least", 1);
    cy.get("[data-testid=admin-scenario-list]").children().last().should("be.visible");
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=scenario-title]")
      .should("have.text", "Test scenario");
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=scenario-description]")
      .should("have.text", "Test description");
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=edit-scenario]")
      .should("be.visible")
      .click();

    cy.get("[data-testid=edit-scenario-form]").should("exist").should("be.visible");
    cy.get("#title").should("have.value", "Test scenario").clear().type("Test scenario edited");
    cy.get("#shortDescription").should("have.value", "Test description").clear().type("Test description edited");
    cy.get("#content").should("have.value", "Test content").clear().type("Test content edited");
    cy.get("[data-testid=edit-scenario-form]").get("button[type=submit]").should("be.enabled").click();
    cy.url().should("eq", "http://localhost:3000/admin/scenario");

    cy.get("[data-testid=admin-scenario-list]").children().should("have.length.at.least", 1);
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=scenario-title]")
      .should("have.text", "Test scenario edited");
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=scenario-description]")
      .should("have.text", "Test description edited");
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=delete-scenario]")
      .should("be.visible")
      .click();
    cy.get("[data-testid=confirmation-dialog]").should("exist").should("be.visible");
    cy.get("[data-testid=confirmation-dialog]").find("button").contains("Slett").should("be.visible").click();
    cy.get("[data-testid=confirmation-dialog]").should("not.exist");
    cy.get("[data-testid=admin-scenario-list]").children().should("have.length.at.least", 1);
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=scenario-title]")
      .should("not.have.text", "Test scenario edited");
    cy.get("[data-testid=admin-scenario-list]")
      .children()
      .last()
      .find("[data-testid=scenario-description]")
      .should("not.have.text", "Test description edited");
  });
});
