import { describe, expect, it } from "vitest";
import { calculateScores } from "./scoring";
import type { Category, Question } from "./types";

const categories: Category[] = [
  {
    id: 1,
    slug: "finance",
    name: "Finance",
    display_order: 1,
    weight_percent: 60,
    description: null,
  },
  {
    id: 2,
    slug: "rh",
    name: "RH",
    display_order: 2,
    weight_percent: 40,
    description: null,
  },
];

const questions: Question[] = [
  {
    id: 1,
    category_id: 1,
    text: "Q1",
    explanation: null,
    weight: 10,
    risk_level: null,
    display_order: 1,
  },
  {
    id: 2,
    category_id: 2,
    text: "Q2",
    explanation: null,
    weight: 5,
    risk_level: 3,
    display_order: 1,
  },
];

describe("calculateScores", () => {
  it("returns 100% for perfect answers", () => {
    const result = calculateScores({
      categories,
      questions,
      responses: [
        { question_id: 1, coef: 5 },
        { question_id: 2, coef: 5 },
      ],
    });

    expect(result.finalScore).toBe(100);
    expect(result.categoryScoreMap).toEqual({ finance: 100, rh: 100 });
  });

  it("returns 0% when there are no answers yet", () => {
    const result = calculateScores({
      categories,
      questions,
      responses: [],
    });

    expect(result.finalScore).toBe(0);
  });

  it("calculates a weighted intermediate score", () => {
    const result = calculateScores({
      categories,
      questions,
      responses: [
        { question_id: 1, coef: 4 },
        { question_id: 2, coef: 2 },
      ],
    });

    expect(result.categoryScoreMap.finance).toBe(80);
    expect(result.categoryScoreMap.rh).toBe(40);
    expect(result.finalScore).toBe(64);
  });
});
