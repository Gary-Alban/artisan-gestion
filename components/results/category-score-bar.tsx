import { cn, formatPercent } from "@/lib/utils";
import type { CategoryScore } from "@/lib/scoring";

function scoreTone(score: number) {
  if (score < 40) return "bg-red-600";
  if (score < 60) return "bg-orange-500";
  if (score < 75) return "bg-accent";
  return "bg-teal";
}

export function CategoryScoreBar({ item }: { item: CategoryScore }) {
  const width = Math.max(0, Math.min(100, item.scorePercent));

  return (
    <div className="rounded-md border border-primary/10 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <span className="font-semibold leading-tight text-primary">{item.category.name}</span>
          <span className="mt-1 block text-xs text-secondary">
            {item.answered}/{item.total} reponses - poids {item.category.weight_percent}%
          </span>
        </div>
        <span className="rounded-full bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
          {formatPercent(item.scorePercent)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-primary/10">
        <div
          className={cn("h-full rounded-full", scoreTone(item.scorePercent))}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
