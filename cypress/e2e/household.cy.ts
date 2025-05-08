import { time } from "console";
import { TIMEOUT } from "dns";

describe("profile login", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#username").should("be.visible").clear().type("nordmannJunior");
    cy.get("#username").should("have.value","nordmannJunior");

    cy.get("#password").should("be.visible").clear().type("Password12345");

    cy.contains('button', "Logg inn").should("be.visible").click();
    cy.get('h1.text-4xl.font-bold', { timeout: 5000 })
    .should('contain.text', 'Krisefikser');
    cy.visit("/profile");
    cy.get('p.text-gray-500.mt-1')
    .should('contain.text', 'nordmannJunior');

  });

  it("Should be able create household",() => {
    cy.get('a[href="/household"]').click()
    cy.contains('button', 'Opprett ny').click()
    cy.get("#name", {timeout:5000})
    .should("be.visible").type("Huset");
    cy.get("#address").should("be.visible").type("Eirik jarls gate 2");
    cy.get('button[type="submit"]').click();
    cy.contains('p', 'Husholdning opprettet')
    cy.contains('p', 'Du har nå opprettet en husholdning')
  })

});

