describe("Delete address modal tests", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/address");
  });

  it("Delete a row from table", () => {
    cy.get('div:has(data-rowindex="12")').click();

    cy.get(
      'button:has(path[d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"])',
    ).click();

    cy.contains("Delete Item").should("be.visible");

    cy.get("button").contains("Delete").click();
  });
});
