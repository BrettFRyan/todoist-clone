import faker from "@faker-js/faker";

describe("smoke tests", () => {
  // afterEach(() => {
  //   cy.cleanupUser();
  // });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    // cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/login");
  });
});
