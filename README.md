## Notes:
1. Always use ```dataset``` for selecting elements to test like ```data-cy="test"```
2. Set repeated codes in all tests in ```beforeEach``` function like ```cy.visit("/page")``` or login command
3. Set baseUrl in ```cypress.config.ts``` file so dont repeat it in every visit like:
```js
export default defineConfig({
  e2e: {
    baseUrl: "base path",
  },
});
```
## Factory:
> Reusable function that creates test data for you.
```js
function buildUser() {
  return {
    name: 'John Doe',
    email: 'john@test.com',
  }
}
```
Then use it in test like this:
```js
const user = buildUser();
```
They usually located in ```cypress/support/factories/user.factory.ts```

## Commands:
They usually located in ```cypress/support/commands.ts```
```js
Cypress.Commands.add("fillInput", (selector: string, value: string) => {
  cy.get(selector).should("be.visible").clear().type(value);
});
```
### For login:
```js
Cypress.Commands.add('login', () => {
  cy.session('admin', () => {
    cy.intercept("POST", "/auth/login").as("login");

    cy.intercept("GET", "/auth/authorization").as("authorization");

    cy.get('input[name="username"]').type("USERNAME");

    cy.get('input[name="password"]').type("PASSWORD");

    cy.contains("button", "SIGN IN").click();

    cy.wait("@login").its("response.statusCode").should("eq", 200);

    cy.window()
      .its("localStorage")
      .invoke("getItem", "access-token")
      .should("not.be.null")
      .then((token) => {
        cy.wait("@authorization")
          .its("request.headers.authorization")
          .should("eq", `Bearer ${token}`);
      });
  })
})
```
OR
```js
Cypress.Commands.add('login', () => {
  cy.session(
    'admin',
    () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: Cypress.env('ADMIN_EMAIL'),
          password: Cypress.env('ADMIN_PASSWORD'),
        },
      }).then(({ body }) => {
        window.localStorage.setItem('accessToken', body.accessToken)
      })
    },
    {
      validate() {
        cy.request({
          url: '/api/auth/me',
          failOnStatusCode: false,
        }).its('status').should('eq', 200)
      },
    },
  )
})
```
Then use it in test like:
```js
beforeEach(() => {
  cy.login()
  cy.visit('/users')
})
```
They need declaration for ts at the end of ```commands.ts``` file:
```ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
    }
  }
}
```
