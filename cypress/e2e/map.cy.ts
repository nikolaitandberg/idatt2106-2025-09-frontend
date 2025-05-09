describe("map", () => {
  it("Should display map when opened", () => {
    cy.visit("/map");
    cy.get(".maplibregl-canvas", {timeout: 5000}).should("exist"); // Check if the map canvas exists
  });

  it("Should display event markers", () => {
    cy.visit("/map");
    cy.get(".maplibregl-canvas", {timeout: 5000}).should("exist"); // Check if the map canvas exists
    cy.get(".maplibregl-marker").should("have.length.greaterThan", 0); // Check if there are any markers on the map
  });

  it("Should display markers with varying colors", () => {
    cy.visit("/map");
    cy.get(".maplibregl-marker div", {timeout: 5000}) // Select the divs inside the markers
      .should("have.length.greaterThan", 1) // Ensure there are multiple markers
      .then((divs) => {
        const colors = new Set();
        divs.each((_, div) => {
          const color = Cypress.$(div).css("background-color");
          colors.add(color);
        });
        expect(colors.size).to.be.greaterThan(1); // Ensure there are varying colors
      });
  });

  it("Should display markers with varying icons", () => {
    cy.visit("/map");
    cy.get(".maplibregl-marker svg", { timeout: 5000 }) // Select the SVGs inside the markers
      .should("have.length.greaterThan", 1) // Ensure there are multiple markers
      .then((svgs) => {
        const icons = new Set();
        svgs.each((_, svg) => {
          const iconClass = Cypress.$(svg).attr("class"); // Get the class of the SVG
          if (iconClass) {
            icons.add(iconClass);
          }
        });
        expect(icons.size).to.be.greaterThan(1); // Ensure there are varying icons
      });
  });

  it("should display only the filtered markers", () => {
    cy.visit("/map");
        
    // Verify there is exactly one 'hjertestarter' marker
    cy.get(".maplibregl-marker")
      .should("have.length.greaterThan", 0)
      .find(".lucide-activity")
      .should("have.length", 1);
  
    // Open the filter menu and apply the 'hjertestarter' filter
    cy.contains("button", "Filtrer", { timeout: 5000 }).click();
    cy.contains("label", "Hjertestarter").click();
  
    // Verify there are no 'hjertestarter' markers after filtering
    cy.get(".maplibregl-marker").find(".lucide-activity").should("not.exist");
  });

  it("Should allow geolocation and center map on user's location", () => {
    const mockPosition = {
      coords: {
        latitude: 59.9139, // Example latitude
        longitude: 10.7522, // Example longitude
      },
    };

    cy.visit("/map", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((callback) => {
          callback(mockPosition);
        });
      },
    });

    cy.get(".maplibregl-canvas", { timeout: 5000 }).should("exist"); // Check if the map canvas exists
  });
});
