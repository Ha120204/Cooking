import { Star } from "lucide-react";

type RatingStarsProps = {
  average?: number | null;
  count?: number;
  input?: boolean;
};

export function RatingStars({ average = null, count = 0, input = false }: RatingStarsProps) {
  if (input) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-bep-md bg-bep-dim/70 px-4 py-3">
        <span className="text-sm font-medium text-bep-smoke">Chạm để đánh giá:</span>
        <div className="flex" aria-label="Chấm sao sẽ mở trong giai đoạn tiếp theo">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" disabled aria-label={star + " sao - sắp mở"} className="flex size-11 cursor-not-allowed items-center justify-center text-bep-star opacity-55">
              <Star size={22} />
            </button>
          ))}
        </div>
        <span className="text-xs text-bep-smoke">Sắp mở</span>
      </div>
    );
  }

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
