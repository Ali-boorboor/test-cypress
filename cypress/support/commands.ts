/// <reference types="cypress" />

Cypress.Commands.add("login", () => {
  cy.env(["ADMIN_USERNAME", "ADMIN_PASSWORD"]).then(
    ({ ADMIN_USERNAME, ADMIN_PASSWORD }) => {
      cy.session("admin", () => {
        cy.request({
          method: "POST",
          url: "/auth/login",
          body: {
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          },
        }).then(({ body }) => {
          expect(body.accessToken).to.not.equal(undefined);

          window.localStorage.setItem("access-token", body.accessToken);
        });
      });
    },
  );
});

Cypress.Commands.add("fillInput", (selector, value) => {
  cy.get(selector).should("be.visible").type(value);
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable;
      fillInput(selector: string, value: string): Chainable;
    }
  }
}

export { };

