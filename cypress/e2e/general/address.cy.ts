const testValue = "test value";
const editTestValue = "edit test value";

const inputs = [
  { selector: "input[name='code']", testValue },
  { selector: "input[name='name']", testValue },
  { selector: "input[name='address1']", testValue },
  { selector: "input[name='address2']", testValue },
  { selector: "input[name='contact']", testValue },
  { selector: "input[name='phone']", testValue },
  { selector: "input[name='eMail']", testValue },
  { selector: "input[type='number']", testValue: "1" },
];

describe("Address page tests", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/general/address");
  });

  describe("Create address modal tests", () => {
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
          /required|invalid|error|fill|cannot be empty|please enter/i.test(
            text,
          );
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
        cy.get(input.selector)
          .should("be.visible")
          .should("not.have.value", "");
      });
    });

    it("Pass with filling code & name (required) inputs", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      cy.fillInput(`input[name='code']`, testValue);

      cy.fillInput(`input[name='name']`, testValue);

      cy.get("button").contains("Ok").click();

      cy.contains(testValue).should("be.visible");
    });

    it.skip("Fail with repeated datas", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      cy.fillInput(`input[name='code']`, testValue);

      cy.fillInput(`input[name='name']`, testValue);

      cy.get("button").contains("Ok").click();

      cy.contains(testValue).should("not.be.visible");
    });
  });

  describe("Edit address modal tests", () => {
    it("Edit a row from table", () => {
      cy.get('[role="row"]').contains('[data-field="code"]', testValue).click();

      cy.wait(500);

      cy.get('button[data-cy="address-edit-button"]')
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.contains("Edit Address").should("be.visible");

      inputs.forEach((input) => {
        cy.get(input.selector).clear();
        cy.fillInput(input.selector, editTestValue);
      });

      cy.get("button").contains("Ok").click();

      cy.contains(editTestValue).should("be.visible");
    });
  });

  describe("Delete address modal tests", () => {
    it("Does not delete a row from table on cancel button clicked", () => {
      cy.get('[role="row"]').contains('[data-field="code"]', testValue).click();

      cy.wait(500);

      cy.get("button").should("be.visible").should("be.enabled").click();

      cy.contains("Delete Item").should("be.visible");

      cy.get("button").contains("Cancel").should("be.visible").click();

      cy.get('[role="row"]').contains('[data-field="code"]', testValue).click();

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
      cy.get('[role="row"]').contains('[data-field="code"]', testValue).click();

      cy.wait(500);

      cy.get('span[aria-label="Delete"] > button')
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.get("button").contains("Delete").should("be.visible").click();
    });
  });
});
