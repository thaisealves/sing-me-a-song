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

  it("Should be empty if there's no recommendations", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-cy="recommendation"]').should("have.length", 0);
  });

  it("Should get random recommendation", () => {
    cy.visit("http://localhost:3000/");
    cy.createRecommendation();
    cy.get('[data-cy="random"]').click();

    cy.url().should("equal", "http://localhost:3000/random");

    cy.get('[data-cy="recommendation"]').should("have.length", 1);
  });

  it("Random should be empty if there's no recommendation", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-cy="random"]').click();

    cy.url().should("equal", "http://localhost:3000/random");
    cy.visit("http://localhost:3000/random");
    cy.get('[data-cy="recommendation"]').should("have.length", 0);
  });

  it("Should get only 10 top recommendations", () => {
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

    cy.get('[data-cy="top"]').click();

    cy.url().should("equal", "http://localhost:3000/top");
    cy.get('[data-cy="recommendation"]').should("have.length", 10);
  });
  it("Should have no recommendations if its empty", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-cy="top"]').click();

    cy.url().should("equal", "http://localhost:3000/top");

    cy.get('[data-cy="recommendation"]').should("have.length", 0);
  });

  it("See if video works", () => {
    cy.visit("http://localhost:3000/");

    const recommendation = {
      name: "never be the same",
      youtubeLink:
        "https://www.youtube.com/watch?v=Ph54wQG8ynk&ab_channel=CamilaCabelloVEVO",
    };
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="recommendation"]')
      .first()
      .get('[data-cy="video"]')
      .click();
  });


});
