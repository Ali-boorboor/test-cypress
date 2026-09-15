const employeeTestValue = "test value";
const employeeEditTestValue = "edit test value";

const employeeInputs = [
  { selector: "input[name='code']", employeeTestValue },
  { selector: "input[name='lastName']", employeeTestValue },
  { selector: "input[name='firstName']", employeeTestValue },
];

describe("Employee page tests", () => {
  beforeEach(() => {
    cy.login();

    cy.intercept("GET", "**/tblEmployee*").as("employeeDatas");

    cy.visit("/general/employee");

    cy.wait("@employeeDatas").its("response.statusCode").should("eq", 200);
  });

  describe("Create employee modal tests", () => {
    it("Render create modal correctly", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      cy.contains("Create Employee").should("be.visible");

      employeeInputs.forEach((input) => {
        cy.get(input.selector).should("be.visible").should("have.value", "");
      });

      cy.get("input[role='combobox']")
        .should("be.visible")
        .should("have.value", "");
    });

    it("Does not accept empty fields when OK is pressed", () => {
      cy.get('button:has(path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"])').click();

      employeeInputs.forEach((input) => {
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

      employeeInputs.forEach((input) => {
        cy.fillInput(input.selector, input.employeeTestValue);
      });

      cy.get("input[role='combobox']").click().type("ENG");

      cy.get('[role="option"]').contains("ENG").click();

      cy.get("button").contains("Ok").click();

      cy.get(
        'button:has(path[d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"])',
      ).click();

      cy.get("input[placeholder='Search...']")
        .should("be.visible")
        .type(employeeTestValue);

      cy.contains(employeeTestValue).should("be.visible");
    });
  });

  describe("Edit modal tests", () => {
    it("Edit a row from table", () => {
      cy.get('button[aria-label="Search"]')
        .should("have.attr", "aria-expanded", "false")
        .click();

      cy.get("input[placeholder='Search...']")
        .should("be.visible")
        .type(employeeTestValue);

      cy.get('[role="row"]')
        .contains('[data-field="code"]', employeeTestValue)
        .click();

      cy.get(
        'button:has(path[d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"])',
      )
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.contains("Edit Employee").should("be.visible");

      cy.get("input[name='code']").should("be.visible").should("be.enabled");

      employeeInputs.forEach((input) => {
        cy.get(input.selector).should("be.visible").should("be.enabled");
        cy.get(input.selector).clear();
        cy.fillInput(input.selector, employeeEditTestValue);
      });

      cy.get("input[role='combobox']").click().clear().type("PM");

      cy.get('[role="option"]').contains("PM").click();

      cy.intercept("PUT", "**/tblEmployee/*").as("updateEmployee");

      cy.get("button").contains("Ok").click();

      cy.wait("@updateEmployee")
        .its("response.statusCode")
        .should("be.oneOf", [200, 204]);

      cy.wait(500);

      cy.get("input[placeholder='Search...']")
        .should("be.visible")
        .clear()
        .type(employeeTestValue);

      cy.contains(employeeEditTestValue).should("be.visible");

      cy.contains("PM").should("be.visible");
    });
  });

  describe("Delete modal tests", () => {
    it("Does not delete a row from table on cancel button clicked", () => {
      cy.get('button[aria-label="Search"]')
        .should("have.attr", "aria-expanded", "false")
        .click();

      cy.get("input[placeholder='Search...']")
        .should("be.visible")
        .type(employeeTestValue);

      cy.get('[role="row"]')
        .contains('[data-field="code"]', employeeTestValue)
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
        .contains('[data-field="code"]', employeeTestValue)
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
      cy.get('button[aria-label="Search"]')
        .should("have.attr", "aria-expanded", "false")
        .click();

      cy.get("input[placeholder='Search...']")
        .should("be.visible")
        .type(employeeTestValue);

      cy.get('[role="row"]')
        .contains('[data-field="code"]', employeeTestValue)
        .click();

      cy.wait(500);

      cy.get(
        'button:has(path[d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"])',
      )
        .should("be.visible")
        .should("be.enabled")
        .click();

      cy.get("button").contains("Delete").should("be.visible").click();

      cy.get('[role="row"]').should("not.contain", employeeTestValue);
    });
  });
});
