import { time } from "console";
import { TIMEOUT } from "dns";

describe("profile login", () => {
  beforeEach(() => {
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
  });
});
