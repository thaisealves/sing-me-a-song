import supertest from "supertest";
import { recommendationFactory } from "../factories/recommendationFactory";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import { insertingRecommendation } from "../factories/insertingRecommendation";
import { recommendationListFactory } from "../factories/recommendationListFactory";
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

  it("Must return 200 doing upvote on existing recommendation", async () => {
    const posted = await insertingRecommendation();

    const upvoting = await supertest(app).post(
      `/recommendations/${posted.id}/upvote`
    );
    expect(upvoting.status).toBe(200);
    expect(posted).not.toBeNull();
  });

  it("Must return 404 doing upvote on non-existing recommendation", async () => {
    const posted = await insertingRecommendation();

    const upvoting = await supertest(app).post(
      `/recommendations/${posted.id + 1}/upvote`
    );
    expect(upvoting.status).toBe(404);
    expect(posted).not.toBeNull();
  });

  it("Must return 200 doing downvote on existing recommendation", async () => {
    const posted = await insertingRecommendation();

    const downvoting = await supertest(app).post(
      `/recommendations/${posted.id}/downvote`
    );
    expect(posted.score).toBeGreaterThanOrEqual(-4);
    expect(downvoting.status).toBe(200);
    expect(posted).not.toBeNull();
  });

  it("Must return 404 doing downvote on non-existing recommendation", async () => {
    const posted = await insertingRecommendation();

    const downvoting = await supertest(app).post(
      `/recommendations/${posted.id + 1}/downvote`
    );
    expect(posted.score).toBeGreaterThanOrEqual(-4);
    expect(downvoting.status).toBe(404);
    expect(posted).not.toBeNull();
  });

  it("Must remove recommendation if try to downvote on score <-5", async () => {
    const posted = await insertingRecommendation();
    await supertest(app).post(`/recommendations/${posted.id}/downvote`);
    await supertest(app).post(`/recommendations/${posted.id}/downvote`);
    await supertest(app).post(`/recommendations/${posted.id}/downvote`);
    await supertest(app).post(`/recommendations/${posted.id}/downvote`);
    await supertest(app).post(`/recommendations/${posted.id}/downvote`);
    const downvote = await prisma.recommendation.findUnique({
      where: {
        name: posted.name,
      },
    });
    const lastDownvote = await supertest(app).post(
      `/recommendations/${posted.id}/downvote`
    );

    const removed = await prisma.recommendation.findUnique({
      where: {
        name: posted.name,
      },
    });
    expect(downvote.score).toBeLessThan(-4);
    expect(lastDownvote.status).toBe(200);
    expect(removed).toBeNull();
  });

  it("Must return an array with recommendations", async () => {
    const posted = await insertingRecommendation();

    const result = await supertest(app).get("/recommendations/");

    expect(result.status).toBe(200);
    expect(result.body).toEqual([posted]);
  });
  it("Must return an empty array when there's no recommendation", async () => {
    const result = await supertest(app).get("/recommendations/");
    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });

  it("Must return the recommendation by id", async () => {
    const posted = await insertingRecommendation();

    const result = await supertest(app).get(`/recommendations/${posted.id}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(posted);
  });
  it("Must return not found error if id doens't exists from recommendation by id", async () => {
    const posted = await insertingRecommendation();

    const result = await supertest(app).get(
      `/recommendations/${posted.id + 1}`
    );

    expect(result.status).toBe(404);
    expect(result.body).toEqual({});
  });
  it("Must return an random recommendation", async () => {
    await insertingRecommendation();

    const result = await supertest(app).get(`/recommendations/random`);

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });
  it("Must return 404 if there's no recommendation on random", async () => {
    const result = await supertest(app).get(`/recommendations/random`);
    console.log(result.body);
    expect(result.status).toBe(404);
    expect(result.body).toEqual({});
  });
});
