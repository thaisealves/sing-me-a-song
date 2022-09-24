import { faker } from "@faker-js/faker";

export function recommendationFactory() {
  return {
    name: faker.lorem.words(2),
    youtubeLink:
      "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(),
  };
}
