import { Recommendation } from "@prisma/client";
import { findRecommendationFactory } from "./findRecommendationFactory";
export function recommendationListFactory(amount: number) {
  const recommendations: Recommendation[] = [];
  for (let i = 0; i < amount; i++) {
    recommendations.push(findRecommendationFactory());
  }
  return recommendations;
}

export function recommendationOrderedListFactory(amount: number) {
  const filteredRecommendations: Recommendation[] =
    recommendationListFactory(amount);

  filteredRecommendations.sort((a, b) => a.score - b.score);
  return filteredRecommendations;
}
