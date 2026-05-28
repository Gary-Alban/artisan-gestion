export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  display_order: number;
  weight_percent: number;
  description: string | null;
};

export type Question = {
  id: number;
  category_id: number;
  text: string;
  explanation: string | null;
  weight: number;
  risk_level: number | null;
  display_order: number;
};

export type Audit = {
  id: string;
  user_id: string;
  business_name: string | null;
  status: "in_progress" | "completed";
  category_scores: Record<string, number> | null;
  final_score: number | null;
  started_at: string;
  completed_at: string | null;
  viewed_by_admin: boolean;
  updated_at: string;
};

export type ResponseRow = {
  id?: string;
  audit_id: string;
  question_id: number;
  coef: number;
};

export type QuestionWithCategory = Question & {
  categories: Category;
};
