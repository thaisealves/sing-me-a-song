import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { findRecommendationFactory } from "../factories/findRecommendationFactory";
import { recommendationFactory } from "../factories/recommendationFactory";
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


