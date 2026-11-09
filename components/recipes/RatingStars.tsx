import { Star } from "lucide-react";

type RatingStarsProps = {
  average?: number | null;
  count?: number;
};

export function RatingStars({ average = null, count = 0 }: RatingStarsProps) {
  if (average === null || count === 0) {
    return <span className="text-xs font-medium text-bep-smoke">Chưa có đánh giá</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bep-ink" aria-label={average.toFixed(1) + " trên 5 sao, " + count + " đánh giá"}>
      <Star size={16} fill="currentColor" className="text-bep-star" />
      {average.toFixed(1)} ({count} đánh giá)
    </span>
  );
}
