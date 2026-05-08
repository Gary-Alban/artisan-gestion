import { formatPercent } from "@/lib/utils";
import type { CategoryScore } from "@/lib/scoring";

export function CategoryScoreBar({ item }: { item: CategoryScore }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-primary">{item.category.name}</span>
        <span className="text-secondary">
          {formatPercent(item.scorePercent)} - poids {item.category.weight_percent}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full bg-accent"
          style={{ width: `${Math.max(0, Math.min(100, item.scorePercent))}%` }}
        />
      </div>
    </div>
  );
}
