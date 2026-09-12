describe("Testing login page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Renders the login page correctly", () => {
    cy.contains("Sign In").should("be.visible");

    cy.get('input[name="username"]').should("be.visible");

    cy.get('input[name="password"]').should("be.visible");

    cy.contains("button", "SIGN IN").should("be.visible").and("be.enabled");

    cy.contains("Forgot password?").should("be.visible");

    cy.contains("Remember me").should("be.visible");

    cy.get('input[name="username"]').should("have.value", "");

    cy.get('input[name="password"]').should("have.value", "");

    cy.get("button").find('svg path[d^="M12 7c-2.76"]').should("be.visible");

    cy.get('input[name="remember"]')
      .invoke("prop", "checked")
      .then((checked) => {
        cy.log(`checked = ${checked}`);
      });
  });

  it("Shows validation errors when submitting empty form", () => {
    cy.contains("button", "SIGN IN").click();

    cy.get('input[name="username"]').should(
      "have.attr",
      "aria-invalid",
      "true",
    );

    cy.get('input[name="password"]').should(
      "have.attr",
      "aria-invalid",
      "true",
    );
  });

  it("Does not submit when password is empty", () => {
    cy.env(["ADMIN_USERNAME"]).then(({ ADMIN_USERNAME }) => {
      cy.fillInput('input[name="username"]', ADMIN_USERNAME);
    });

    cy.contains("button", "SIGN IN").click();

    cy.contains("Password is required").should("be.visible");
  });

  it("Does not submit when username is empty", () => {
    cy.env(["ADMIN_PASSWORD"]).then(({ ADMIN_PASSWORD }) => {
      cy.fillInput('input[name="password"]', ADMIN_PASSWORD);
    });

    cy.contains("button", "SIGN IN").click();

    cy.contains("Username is required").should("be.visible");
  });

  it("Toggles show and hide the password", () => {
    cy.get('input[name="password"]').type("secret123");

    cy.get('input[name="password"]').should("have.attr", "type", "password");

    cy.get('input[name="password"]')
      .parent()
      .find("svg")
      .click({ multiple: true });

    cy.get('input[name="password"]').should("have.attr", "type", "text");

    cy.get('input[name="password"]')
      .parent()
      .find("svg")
      .click({ multiple: true });

    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });

  it("Toggles Theme", () => {
    cy.clearLocalStorage();

    cy.get("html")
      .should("have.attr", "data-mui-color-scheme")
      .and("match", /^(light|dark)$/);

    cy.get("button")
      .find('svg path[d^="M12 7c-2.76"]')
      .should("be.visible")
      .click();

    cy.get("html")
      .invoke("attr", "data-mui-color-scheme")
      .then((htmlTheme) => {
        cy.window()
          .its("localStorage")
          .invoke("getItem", "mui-mode")
          .should("eq", htmlTheme);
      });
  });

  it("Navigates to the dashboard after signing in with correct credentials", () => {
    cy.intercept("POST", "/auth/login").as("login");

    cy.intercept("GET", "/auth/authorization").as("authorization");

    cy.env(["ADMIN_USERNAME"]).then(({ ADMIN_USERNAME }) => {
      cy.fillInput('input[name="username"]', ADMIN_USERNAME);
    });

    cy.env(["ADMIN_PASSWORD"]).then(({ ADMIN_PASSWORD }) => {
      cy.fillInput('input[name="password"]', ADMIN_PASSWORD);
    });

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

    cy.location("pathname").should("eq", "/dashboard/local");
  });

  it("Does not navigate to the local dashboard with wrong credentials", () => {
    cy.fillInput('input[name="username"]', "wrong-data");

    cy.fillInput('input[name="password"]', "wrong-data");

    cy.contains("button", "SIGN IN").click();

    cy.location("pathname").should("not.eq", "/dashboard/local");
  });

  it("Does not execute script payloads supplied in credentials", () => {
    cy.window().then((window) => {
      (window as Window & { __xssExecuted?: boolean }).__xssExecuted = false;
    });

    const scriptPayload = "<script>window.__xssExecuted = true</script>";

    cy.fillInput('input[name="username"]', scriptPayload);

    cy.fillInput('input[name="password"]', scriptPayload);

    cy.contains("button", "SIGN IN").click();

    cy.window().its("__xssExecuted").should("not.eq", true);
    cy.location("pathname").should("not.eq", "/dashboard/local");
  });
});
