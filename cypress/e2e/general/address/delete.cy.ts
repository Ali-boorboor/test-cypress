describe("Delete address modal tests", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/address");
  });

  it("Does not delete a row from table on cancel button clicked", () => {
    cy.get('[role="row"]')
      .contains('[data-field="code"]', "test-value")
      .click();

    cy.wait(500);

    cy.get('span[aria-label="Delete"] > button')
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get("button").contains("Cancel").should("be.visible").click();

    cy.get('[role="row"]')
      .contains('[data-field="code"]', "test-value")
      .click();

    cy.wait(500);

    cy.get('span[aria-label="Delete"] > button')
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get(
      'button:has(path[d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"])',
    ).click();
  });

  it("Delete a row from table", () => {
    cy.get('[role="row"]')
      .contains('[data-field="code"]', "test-value")
      .click();

    cy.wait(500);

    cy.get('span[aria-label="Delete"] > button')
      .should("be.visible")
      .should("be.enabled")
      .click();

    cy.get("button").contains("Delete").should("be.visible").click();
  });
});
