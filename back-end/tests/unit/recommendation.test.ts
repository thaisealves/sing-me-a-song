import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
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
  it.todo("Should put an upvote on an existing recommendation", async ()=>{
    jest.spyOn(recommendationRepository, "find").mockImplementation(():any=>{})
  });
});
