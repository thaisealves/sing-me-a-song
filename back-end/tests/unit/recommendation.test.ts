import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { findRecommendationFactory } from "../factories/findRecommendationFactory";
import { recommendationFactory } from "../factories/recommendationFactory";
import {
  recommendationListFactory,
  recommendationOrderedListFactory,
} from "../factories/recommendationListFactory";
beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Testing the insert from recommendations service", () => {
  it("Testing the insert with non-existing recommendation", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});
    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });
  it("Testing the inser with already existing recommendation", async () => {
    const recommendation = recommendationFactory();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => recommendation);

    const promise = recommendationService.insert(recommendation);

    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("Testing upvote from recommendations service", () => {
  it("Should put an upvote on an existing recommendation", async () => {
    const findingRecommendation = findRecommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return findingRecommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});
    await recommendationService.upvote(findingRecommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should not put an upvote on a non-existing recommendation", async () => {
    const findingRecommendation = findRecommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return null;
      });

    const promisse = recommendationService.upvote(findingRecommendation.id);

    expect(promisse).rejects.toEqual({
      type: "not_found",
      message: "",
    });
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });
});

describe("Testing downvote from recommendations service", () => {
  it("Should put an downvote on an existing recommendation with the score greater than -5", async () => {
    const findingRecommendation = findRecommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return findingRecommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { ...findingRecommendation, score: 3 };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});
    await recommendationService.downvote(findingRecommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it("Should not put an downvote on a non-existing recommendation", async () => {
    const findingRecommendation = findRecommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return null;
      });

    const promisse = recommendationService.downvote(findingRecommendation.id);

    expect(promisse).rejects.toEqual({
      type: "not_found",
      message: "",
    });
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("Should remove a recommendation if the score is lower than -5", async () => {
    const findingRecommendation = findRecommendationFactory();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return findingRecommendation;
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { ...findingRecommendation, score: -6 };
      });
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(findingRecommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("Testing the gets from the recommendations service", () => {
  it("Should return 10 last recommendations", async () => {
    const recommendation = recommendationListFactory(10);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [recommendation];
      });
    const promise = recommendationService.get();
    expect(promise).resolves.toEqual([recommendation]);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Should return top recommendations with right amount", async () => {
    const amount: number = faker.datatype.number({ min: 5, max: 100 });
    const filteredRecommendations = recommendationOrderedListFactory(amount);
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return filteredRecommendations;
      });
    const promise = recommendationService.getTop(amount);
    expect(promise).resolves.toEqual(filteredRecommendations);
    expect(filteredRecommendations).toHaveLength(amount);
    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });

 
});
