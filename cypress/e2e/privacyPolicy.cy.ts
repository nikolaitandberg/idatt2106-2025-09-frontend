describe("Check privacy policy", () => {
  it("should be able to open privacy policy anywhere", () => {
    cy.visit("/");
    cy.get('a[href="/privacy-policy"]').should("be.visible").click();
    cy.contains("h1", "Personvernerklæring").should("be.visible");
  });
});
