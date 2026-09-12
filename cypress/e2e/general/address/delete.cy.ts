describe("Delete address modal tests", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/address");
  });

  it("Delete a row from table", () => {
    cy.get('[role="row"]')
      .contains('[data-field="code"]', "test-value")
      .click()
      .get('span[aria-label="Delete"] button')
      .click();

    cy.contains("Delete Item").should("be.visible");

    cy.get("button").contains("Delete").click();

    cy.contains("test-value").should("not.be.visible");
  });
});
