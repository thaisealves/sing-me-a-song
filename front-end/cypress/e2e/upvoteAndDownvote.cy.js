beforeEach(async () => {
  await cy.request("POST", "http://localhost:5000/e2e/reset", {});
});
describe("Testing upvote and downvote on recommendation", () => {
  it("Should click on upvote and change its value", () => {
    cy.visit("http://localhost:3000/");
    cy.createRecommendation();

    cy.get('[data-cy="recommendation"]')
      .first()
      .get('[data-testid="num"]')
      .then(($span) => {
        //getting the first score
        const score1 = parseInt($span.text());
        cy.get('[data-cy="recommendation"]')
          .first()
          .get('[data-cy="upvote"]')
          .click()
          .then(() => {
            // getting the new value
            const score2 = parseInt($span.text());
            expect(score2).to.eq(score1 + 1);
          });
      });
  });
  it("Should click on downvote and change its value", () => {
    cy.visit("http://localhost:3000/");
    cy.createRecommendation();

    cy.get('[data-cy="recommendation"]')
      .first()
      .get('[data-testid="num"]')
      .then(($span) => {
        const score1 = parseInt($span.text());
        cy.get('[data-cy="recommendation"]')
          .first()
          .get('[data-cy="downvote"]')
          .click()
          .then(() => {
            const score2 = parseInt($span.text());
            expect(score2).to.eq(score1 - 1);
          });
      });
  });
});
