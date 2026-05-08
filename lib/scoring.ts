import type { Category, Question, ResponseRow } from "@/lib/types";

export type ScoringInput = {
  categories: Category[];
  questions: Question[];
  responses: Pick<ResponseRow, "question_id" | "coef">[];
};

export type CategoryScore = {
  category: Category;
  answered: number;
  total: number;
  scorePercent: number;
  contribution: number;
};

export type ScoringResult = {
  categoryScores: CategoryScore[];
  categoryScoreMap: Record<string, number>;
  finalScore: number;
};

export function calculateScores({
  categories,
  questions,
  responses,
}: ScoringInput): ScoringResult {
  const responseByQuestion = new Map(
    responses.map((response) => [response.question_id, response.coef]),
  );

  const categoryScores = categories
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((category) => {
      const categoryQuestions = questions.filter(
        (question) => question.category_id === category.id,
      );
      const totals = categoryQuestions.reduce(
        (acc, question) => {
          const coef = responseByQuestion.get(question.id);
          acc.max += question.weight * 5;
          if (coef !== undefined) {
            acc.answered += 1;
            acc.raw += question.weight * coef;
          }
          return acc;
        },
        { raw: 0, max: 0, answered: 0 },
      );

      const scorePercent = totals.max > 0 ? (totals.raw / totals.max) * 100 : 0;
      const contribution = scorePercent * (category.weight_percent / 100);

      return {
        category,
        answered: totals.answered,
        total: categoryQuestions.length,
        scorePercent,
        contribution,
      };
    });

  const finalScore = categoryScores.reduce(
    (sum, item) => sum + item.contribution,
    0,
  );
  const categoryScoreMap = Object.fromEntries(
    categoryScores.map((item) => [item.category.slug, item.scorePercent]),
  );

  return { categoryScores, categoryScoreMap, finalScore };
}

export async function calculateAuditScoresFromSupabase(
  supabase: {
    from: (table: string) => {
      select: (columns: string) => {
        order: (column: string, options?: { ascending?: boolean }) => Promise<{
          data: unknown;
          error: { message: string } | null;
        }>;
        eq: (column: string, value: string) => Promise<{
          data: unknown;
          error: { message: string } | null;
        }>;
      };
    };
  },
  auditId: string,
) {
  const [categoriesResult, questionsResult, responsesResult] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("questions").select("*").order("display_order"),
    supabase.from("responses").select("question_id, coef").eq("audit_id", auditId),
  ]);

  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (questionsResult.error) throw new Error(questionsResult.error.message);
  if (responsesResult.error) throw new Error(responsesResult.error.message);

  return calculateScores({
    categories: categoriesResult.data as Category[],
    questions: questionsResult.data as Question[],
    responses: responsesResult.data as Pick<ResponseRow, "question_id" | "coef">[],
  });
}
