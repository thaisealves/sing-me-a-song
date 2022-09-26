import { faker } from "@faker-js/faker";

beforeEach(async () => {
  await cy.request("POST", "http://localhost:5000/e2e/reset", {});
});

describe("Testing all the gets for recommendations", () => {
  it("Should get the 10 last recommendations", () => {
    cy.visit("http://localhost:3000/");

    //creating multiple recommendations to certify it only shows ten
    for (let i = 0; i < 11; i++) {
      const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink:
          "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(5),
      };
      cy.get('[data-cy="name"]').type(recommendation.name);
      cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
      cy.get('[data-cy="submit"]').click();
    }

    cy.get('[data-cy="recommendation"]').should("have.length", 10);
  });
});
