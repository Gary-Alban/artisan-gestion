import * as XLSX from "xlsx";
import { slugifyFileName } from "@/lib/utils";
import type { Audit, Category, Question, ResponseRow } from "@/lib/types";
import type { ScoringResult } from "@/lib/scoring";

export type ExcelPayload = {
  audit: Audit;
  categories: Category[];
  questions: Question[];
  responses: Pick<ResponseRow, "question_id" | "coef">[];
  scores: ScoringResult;
};

export function buildAuditWorkbook({
  questions,
  responses,
  scores,
}: ExcelPayload) {
  const workbook = XLSX.utils.book_new();
  const summaryRows = scores.categoryScores.map((item) => ({
    "Categorie": item.category.name,
    "Score %": Math.round(item.scorePercent),
    "Poids %": item.category.weight_percent,
    "Contribution au score final": Math.round(item.contribution * 100) / 100,
  }));
  summaryRows.push({
    "Categorie": "Score Global",
    "Score %": 0,
    "Poids %": 0,
    "Contribution au score final": Math.round(scores.finalScore),
  });

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(summaryRows),
    "Synthese",
  );

  const coefByQuestion = new Map(
    responses.map((response) => [response.question_id, response.coef]),
  );
  const categoryById = new Map(
    scores.categoryScores.map((item) => [item.category.id, item.category]),
  );
  const detailRows = questions.map((question) => {
    const coef = coefByQuestion.get(question.id) ?? 0;
    return {
      "Categorie": categoryById.get(question.category_id)?.name ?? "",
      "Question": question.text,
      "Reponse (1-5)": coef || "",
      "Poids question": question.weight,
      "Score brut": coef ? question.weight * coef : "",
      "Niveau risque": question.risk_level ?? "",
      "Explication": question.explanation ?? "",
    };
  });

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(detailRows),
    "Detail par question",
  );

  return workbook;
}

export function workbookToBase64(workbook: XLSX.WorkBook) {
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(buffer).toString("base64");
}

export function auditFileName(audit: Pick<Audit, "business_name">, date = new Date()) {
  const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
  const business = slugifyFileName(audit.business_name || "fonds");
  return `audit-${business}-${datePart}.xlsx`;
}
