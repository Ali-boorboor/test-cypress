const followStatusTestValue = "test value";
const followStatusEditTestValue = "edit test value";

const followStatusInputs = [
  { selector: "input[name='fsName']", testValue: followStatusTestValue },
  { selector: "input[name='fsDesc']", testValue: followStatusTestValue },
  {
    selector: "label[for] + div input[type='number']",
    testValue: "0",
  },
];

describe("Employee page tests", () => {
  beforeEach(() => {
    cy.login();

    cy.intercept("GET", "**/tblFollowStatus*").as("followStatusDatas");

    cy.visit("/general/follow-status");

    cy.wait("@followStatusDatas").its("response.statusCode").should("eq", 200);
  });

  describe("Create follow status modal tests", () => {
    it("Render create modal correctly", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      cy.contains("Create Follow Status").should("be.visible");

      followStatusInputs.forEach((input) => {
        cy.get(input.selector).should("be.visible").should("have.value", "");
      });
    });

    it("Does not accept empty fields when OK is pressed", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      followStatusInputs.forEach((input) => {
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

    it("Pass with filling (required) inputs", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      followStatusInputs.forEach((input) => {
        cy.fillInput(input.selector, input.testValue);
      });

      cy.get("button").contains("Ok").click();

      cy.contains(followStatusTestValue).should("be.visible");
    });
  });

  describe("Edit modal tests", () => {
    it("Edit a row from table", () => {
      cy.get('[role="row"]')
        .contains('[data-field="fsName"]', followStatusTestValue)
        .closest('[role="row"]')
        .click();

      cy.get(
        'button:has(path[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"])',
      )
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.contains("Edit Follow Status").should("be.visible");

      followStatusInputs.forEach((input) => {
        cy.get(input.selector).should("be.visible").should("be.enabled");
        cy.get(input.selector).clear();
        cy.fillInput(input.selector, followStatusEditTestValue);
      });

      cy.intercept("PUT", "**/tblFollowStatus/*").as("updateFollowStatus");

      cy.get("button").contains("Ok").click();

      cy.wait("@updateFollowStatus")
        .its("response.statusCode")
        .should("be.oneOf", [200, 204]);

      cy.wait(500);

      cy.contains(followStatusEditTestValue).should("be.visible");
    });
  });

  describe("Delete modal tests", () => {
    it("Does not delete a row from table on cancel button clicked", () => {
      cy.get('[role="row"]')
        .contains('[data-field="fsName"]', followStatusTestValue)
        .closest('[role="row"]')
        .click();

      cy.wait(500);

      cy.get(
        'button:has(path[d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"])',
      )
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.contains("Delete Item").should("be.visible");

      cy.get("button").contains("Cancel").should("be.visible").click();

      cy.get('[role="row"]')
        .contains('[data-field="fsName"]', followStatusTestValue)
        .closest('[role="row"]')
        .click();

      cy.wait(500);

      cy.get(
        'button:has(path[d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"])',
      )
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.get(
        'button:has(path[d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"])',
      ).click();
    });

    it("Delete a row from table", () => {
      cy.get('[role="row"]')
        .contains('[data-field="fsName"]', followStatusTestValue)
        .closest('[role="row"]')
        .click();

      cy.wait(500);

      cy.get(
        'button:has(path[d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"])',
      )
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.get("button").contains("Delete").should("be.visible").click();

      cy.get('[role="row"]').should("not.contain", followStatusTestValue);
    });
  });
});
