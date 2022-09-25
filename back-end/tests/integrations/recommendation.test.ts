import supertest from "supertest";
import { recommendationFactory } from "../factories/recommendationFactory";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import { insertingRecommendation } from "../factories/insertingRecommendation";
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe("Testing all the routes from the app", () => {
  it("Must return 201 inserting new recommendation with right body", async () => {
    const recommendation = recommendationFactory();
    const inserting = await supertest(app)
      .post("/recommendations/")
      .send(recommendation);
    const posted = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name,
      },
    });

    expect(inserting.status).toBe(201);
    expect(posted).not.toBeNull();
  });

  it("Must return 422 inserting new recommendation with wrong body", async () => {
    const recommendation = recommendationFactory();
    const wrongRecommendation = {
      ...recommendation,
      youtubeLink: faker.lorem.word(),
    };
    const inserting = await supertest(app)
      .post("/recommendations/")
      .send(wrongRecommendation);
    const posted = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name,
      },
    });

    expect(inserting.status).toBe(422);
    expect(posted).toBeNull();
  });


});
