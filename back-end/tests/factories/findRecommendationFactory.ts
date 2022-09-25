import { faker } from "@faker-js/faker";
export function findRecommendationFactory() {
  return {
    id: Number(faker.datatype.number({ min: 1 })),
    name: faker.lorem.words(2),
    youtubeLink:
      "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(),
    score: Number(faker.datatype.number({ min: -4 })),
  };
}
