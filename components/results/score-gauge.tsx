import { cn, formatPercent } from "@/lib/utils";

function scoreColor(score: number) {
  if (score < 40) return "text-red-700";
  if (score < 60) return "text-orange-600";
  if (score < 75) return "text-yellow-600";
  return "text-green-700";
}

export function ScoreGauge({ score }: { score: number }) {
  const angle = Math.max(0, Math.min(100, score)) * 3.6;
  return (
    <div className="flex flex-col items-center">
      <div
        className="grid size-52 place-items-center rounded-full p-2 shadow-[inset_0_0_0_1px_rgba(15,38,64,.08)]"
        style={{
          background: `conic-gradient(#d4ac45 ${angle}deg, rgba(15,38,64,.1) 0deg)`,
        }}
      >
        <div className="grid size-40 place-items-center rounded-full bg-white shadow-sm">
          <div className="text-center">
            <span className={cn("font-serif text-5xl leading-none", scoreColor(score))}>
              {formatPercent(score)}
            </span>
            <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Score
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
