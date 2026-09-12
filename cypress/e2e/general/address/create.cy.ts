const inputs = [
  { selector: "input[name='code']", testValue: "test value" },
  { selector: "input[name='name']", testValue: "test value" },
  { selector: "input[name='address1']", testValue: "test value" },
  { selector: "input[name='address2']", testValue: "test value" },
  { selector: "input[name='contact']", testValue: "test value" },
  { selector: "input[name='phone']", testValue: "test value" },
  { selector: "input[name='eMail']", testValue: "test value" },
  { selector: "input[type='number']", testValue: "1" },
];

describe("Create address modal tests", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/address");
  });

  it("Render create address modal correctly", () => {
    cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

    cy.contains("Create Address").should("be.visible");

    inputs.forEach((input) => {
      cy.get(input.selector).should("be.visible").should("have.value", "");
    });
  });

  it("Does not accept empty fields when OK is pressed", () => {
    cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

    cy.contains("Create Address").should("be.visible");

    inputs.forEach((input) => {
      cy.get(input.selector).should("be.visible").and("have.value", "");
    });

    cy.get("button").contains("Ok").click();

    cy.get("body").then(($body) => {
      const text = $body.text();
      const hasValidationMessage =
        /required|invalid|error|fill|cannot be empty|please enter/i.test(text);
      const modalStillOpen = text.includes("Create Address");

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(hasValidationMessage || modalStillOpen).to.be.true;
    });
  });

  it("Stores typed values even when modal is closed", () => {
    cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

    inputs.forEach((input) => {
      cy.fillInput(input.selector, input.testValue);
    });

    cy.get("button").contains("Cancel").click();

    cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

    inputs.forEach((input) => {
      cy.get(input.selector).should("be.visible").should("not.have.value", "");
    });
  });

  it("Pass with filling code & name (required) inputs", () => {
    cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

    cy.fillInput(`input[name='code']`, "test-value");

    cy.fillInput(`input[name='name']`, "test-value");

    cy.get("button").contains("Ok").click();

    cy.contains("test-value").should("be.visible");
  });
});
