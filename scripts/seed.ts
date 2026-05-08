import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

type CategoryCsv = {
  slug: string;
  name: string;
  display_order: string;
  weight_percent: string;
  description?: string;
};

type QuestionCsv = {
  Question: string;
  "Catégorie": string;
  Poids_question_sur_10: string;
  Niveau_risque_1_a_5?: string;
  Explication?: string;
};

function parseCsv<T>(filePath: string) {
  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const parsed = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length) {
    throw new Error(parsed.errors.map((error) => error.message).join("\n"));
  }
  return parsed.data;
}

async function supabaseRequest<T>(
  supabaseUrl: string,
  serviceRole: string,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method || "GET"} ${path} failed: ${text}`);
  }

  return (text ? JSON.parse(text) : null) as T;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  const dataDir = path.join(process.cwd(), "data");
  const categories = parseCsv<CategoryCsv>(path.join(dataDir, "categories.csv"));
  const questions = parseCsv<QuestionCsv>(path.join(dataDir, "questions.csv"));

  const categoryRows = categories.map((row) => ({
    slug: row.slug,
    name: row.name,
    display_order: Number(row.display_order),
    weight_percent: Number(row.weight_percent),
    description: row.description || null,
  }));

  await supabaseRequest(supabaseUrl, serviceRole, "categories?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(categoryRows),
  });

  const savedCategories = await supabaseRequest<{ id: number; slug: string }[]>(
    supabaseUrl,
    serviceRole,
    "categories?select=id,slug",
  );
  const categoryIdBySlug = new Map(savedCategories.map((row) => [row.slug, row.id]));
  const orderByCategory = new Map<string, number>();

  const questionRows = questions.map((row) => {
    const slug = row["Catégorie"];
    const categoryId = categoryIdBySlug.get(slug);
    if (!categoryId) {
      throw new Error(`Unknown category slug in questions.csv: ${slug}`);
    }
    const nextOrder = (orderByCategory.get(slug) ?? 0) + 1;
    const riskLevel = Number(row.Niveau_risque_1_a_5);
    orderByCategory.set(slug, nextOrder);
    return {
      category_id: categoryId,
      text: row.Question,
      explanation: row.Explication || null,
      weight: Number(row.Poids_question_sur_10),
      risk_level: riskLevel >= 1 && riskLevel <= 5 ? riskLevel : null,
      display_order: nextOrder,
    };
  });

  await supabaseRequest(supabaseUrl, serviceRole, "questions?id=neq.0", {
    method: "DELETE",
  });

  await supabaseRequest(supabaseUrl, serviceRole, "questions", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(questionRows),
  });

  console.log(
    `Seed complete: ${categoryRows.length} categories, ${questionRows.length} questions.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
