describe("Testing address page Crud", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('input[name="username"]').type("sysop");

    cy.get('input[name="password"]').type("sysop");

    cy.contains("button", "SIGN IN").click();
  });

  it("Click svg button", () => {
    cy.get("button")
      .find('svg path[d^="M12 7c-2.76"]')
      .should("be.visible")
      .click();
  });
});
