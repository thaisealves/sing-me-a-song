import { faker } from "@faker-js/faker";
import VidyardPlayer from "react-player/vidyard";
beforeEach(async () => {
  await cy.request("POST", "http://localhost:5000/e2e/reset", {});
});

describe("Testing to post the recommendation", () => {
  it("Testing if the recommendation is posted", () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink:
        "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(5),
    };

    cy.visit("http://localhost:3000/");
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);

    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "newRecommendation"
    );

    cy.get('[data-cy="submit"]').click();

    cy.wait("@newRecommendation");
    cy.get('[data-cy="name"]').should('have.value', '');
    cy.get('[data-cy="youtubeLink"]').should('have.value', '');
  });
});
