import { faker } from "@faker-js/faker";
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
    cy.get('[data-cy="name"]').should("have.value", "");
    cy.get('[data-cy="youtubeLink"]').should("have.value", "");
  });
  it("Must show an alert if the video name is repeated", () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink:
        "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(5),
    };
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Error creating recommendation!`);
    });
  });
  it("Must show an alert if the video name is empty", () => {
    const recommendation = {
      youtubeLink:
        "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(5),
    };
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Error creating recommendation!`);
    });
  });
  it("Must show an alert if the youtubeLink is empty", () => {
    const recommendation = {
      name: faker.lorem.words(2),
    };
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="submit"]').click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Error creating recommendation!`);
    });
  });
  it("Must show an alert if the youtubeLink is incorrect", () => {
    const recommendation = {
      name: faker.lorem.words(2),
      youtubeLink: faker.lorem.words(2),
    };
    cy.get('[data-cy="name"]').type(recommendation.name);
    cy.get('[data-cy="youtubeLink"]').type(recommendation.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Error creating recommendation!`);
    });
  });
});
