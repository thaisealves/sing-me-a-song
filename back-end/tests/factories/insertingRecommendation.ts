import { recommendationFactory } from "./recommendationFactory";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";

export async function insertingRecommendation() {
  const recommendation = recommendationFactory();

  await supertest(app).post("/recommendations/").send(recommendation);
  const posted = await prisma.recommendation.findUnique({
    where: {
      name: recommendation.name,
    },
  });

  return posted;
}
